"""Offline tests for the optional manager. Real issuers/importers are mocked."""
import json,os,select,signal,subprocess,tempfile,time,unittest,pty
from pathlib import Path
HERE=Path(__file__).resolve().parent
TOOL=Path(os.environ.get('ACME_MANAGER_SOURCE',str(HERE.parent/'static/examples/acme/blikvm-acme')))
BINARY='815ffd1f3ebd65bfbb9cd790bfd18f9cca91f48d8aec3a08732b3fc3b39056d7'
class Manager(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name);self.base=self.root/'extension';self.bin=self.root/'mockbin';self.bin.mkdir();self.service=self.root/'services'
  for path in ['bin','config','state']:(self.base/path).mkdir(parents=True,exist_ok=True)
  self.cred=self.root/'credentials';self.cred.write_text('[default]\naws_access_key_id=TESTACCESSKEY1234\naws_secret_access_key=TESTSECRET1234567890\n');self.cred.chmod(0o600)
  self.token=self.root/'token';self.token.write_text('TESTCLOUDFLARETOKEN1234\n');self.token.chmod(0o600)
  self.server=self.root/'server';self.exe(self.server,'''#!/bin/sh
case "$*" in *--help*) echo '-certificate-file path';exit;; esac
case "$*" in *certificate-import*) [ "${FAKE_IMPORT_EXIT:-0}" = 0 ] || exit "$FAKE_IMPORT_EXIT";echo imported >> "$TEST_ROOT/imports";echo eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee > "$TEST_ROOT/fingerprint";;esac
fp=ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
[ ! -f "$TEST_ROOT/fingerprint" ] || fp=$(cat "$TEST_ROOT/fingerprint")
printf '{"source":"custom","status":"valid","fingerprint":"%s","notAfter":"2027-01-30T00:00:00Z"}\\n' "$fp"
''')
  self.exe(self.bin/'uname','#!/bin/sh\necho aarch64\n')
  self.exe(self.bin/'sha256sum',f'''#!/bin/sh
if [ "$1" = "$TEST_BASE/bin/lego" ] && grep -q '^# UNIT_LEGO$' "$1";then printf '{BINARY}  %s\\n' "$1";else exec /usr/bin/sha256sum "$@";fi
''')
  self.exe(self.base/'bin/lego','''#!/bin/sh
# UNIT_LEGO
printf '%s\\n' "$*" >> "$TEST_ROOT/client-calls"
[ -z "${CF_DNS_API_TOKEN_FILE:-}" ] || printf '%s\\n' "$CF_DNS_API_TOKEN_FILE" > "$TEST_ROOT/cf-path"
[ "${FAKE_DELAY:-0}" = 0 ] || sleep "$FAKE_DELAY"
if [ "${FAKE_LEAK:-0}" = 1 ];then echo 'TESTSECRET1234567890 TESTACCESSKEY1234 TESTCLOUDFLARETOKEN1234';fi
exit "${FAKE_ISSUER_EXIT:-0}"
''')
  self.init=self.root/'init';self.exe(self.init,'#!/bin/sh\necho start >> "$TEST_ROOT/starts"\n')
  self.supervisor=self.root/'supervisor';self.exe(self.supervisor,'#!/bin/sh\nprintf \'{"protocol":2}\\n\'\n')
  self.env=dict(os.environ,PATH=str(self.bin)+':'+os.environ['PATH'],TEST_ROOT=str(self.root),TEST_BASE=str(self.base),BLIKVM_ACME_DIR=str(self.base),BLIKVM_ACME_SERVER=str(self.server),BLIKVM_ACME_SCRIPT_ROOT=str(self.service),BLIKVM_ACME_INIT=str(self.init),BLIKVM_ACME_SUPERVISOR=str(self.supervisor))
 def exe(self,path,text):path.write_text(text);path.chmod(0o755)
 def run_tool(self,*args,**overrides):return subprocess.run([str(TOOL),*args],env=dict(self.env,**overrides),capture_output=True,text=True,timeout=12)
 def wizard(self,answers,extra=()):
  pid,fd=pty.fork()
  if pid==0:
   try:os.execve(str(TOOL),[str(TOOL),'configure','--prepare-only',*extra],self.env)
   except Exception:os._exit(127)
  transcript=b'';pending=b'';i=0;end=time.monotonic()+15
  try:
   while time.monotonic()<end:
    ready,_,_=select.select([fd],[],[],.1)
    if ready:
     try:data=os.read(fd,65536)
     except OSError:break
     if not data:break
     transcript+=data;pending+=data
     if i<len(answers) and answers[i][0].encode() in pending:
      os.write(fd,(answers[i][1]+'\n').encode());pending=b'';i+=1
    got,status=os.waitpid(pid,os.WNOHANG)
    if got:return os.waitstatus_to_exitcode(status),transcript.decode(errors='replace'),i
   got,status=os.waitpid(pid,os.WNOHANG)
   if got:return os.waitstatus_to_exitcode(status),transcript.decode(errors='replace'),i
   os.kill(pid,signal.SIGKILL);os.waitpid(pid,0);self.fail('Wizard did not finish: '+transcript.decode(errors='replace')[-800:])
  finally:os.close(fd)
  return 1,transcript.decode(errors='replace'),i
 def answers(self,provider='route53',agree='yes',existing=False):
  a=[('Certificate DNS hostname','kvm.example.com'),('DNS provider:',provider)]
  if provider=='route53':a += [('AWS region','us-east-1'),('Hosted zone ID','Z1234'),('AWS credentials:','keep' if existing else 'file')]+([] if existing else [('Dedicated AWS credentials file path',str(self.cred))])
  else:a += [('Cloudflare token:','file'),('Dedicated token file path',str(self.token))]
  return a+[('Recursive DNS resolver',''),('Accept the CA subscriber agreement',agree)]
 def configured(self,provider='route53'):
  code,text,n=self.wizard(self.answers(provider));self.assertEqual(code,0,text);self.assertEqual(n,len(self.answers(provider)))
 def state(self):return dict(line.split('=',1) for line in (self.base/'state/manager.env').read_text().splitlines())
 def test_prepare_protects_files_and_leaves_certificate_and_service_alone(self):
  sentinel=self.base/'state/production/accounts/existing';sentinel.parent.mkdir(parents=True);sentinel.write_text('identity')
  self.configured();self.assertEqual(sentinel.read_text(),'identity');self.assertFalse((self.root/'imports').exists());self.assertFalse((self.service/'scripts').exists());self.assertEqual((self.base/'config/renewal.env').stat().st_mode&0o777,0o600)
 def test_declining_reconfigure_preserves_live_profile_and_certificate(self):
  self.configured();before=(self.base/'config/renewal.env').read_bytes();profiles=list((self.base/'config').glob('profile.*'))
  code,text,_=self.wizard(self.answers(agree='no',existing=True));self.assertNotEqual(code,0);self.assertEqual((self.base/'config/renewal.env').read_bytes(),before);self.assertEqual(list((self.base/'config').glob('profile.*')),profiles);self.assertFalse((self.root/'imports').exists())
 def test_failed_issuer_is_redacted_and_retains_identity(self):
  self.configured();r=self.run_tool('renew',FAKE_ISSUER_EXIT='7',FAKE_LEAK='1');self.assertEqual(r.returncode,7,r.stderr);self.assertFalse((self.root/'imports').exists());s=self.state();self.assertEqual(s['LAST_ERROR'],'issuer_failed');self.assertEqual(int(s['NEXT_CHECK'])-int(s['LAST_CHECK']),300)
  text=(self.base/'state/renewal.log').read_text()+self.run_tool('status').stdout
  self.assertNotIn('TESTSECRET1234567890',text);self.assertNotIn('TESTACCESSKEY1234',text);self.assertIn('[REDACTED]',text)
 def test_success_no_duplicate_change_time_and_deployment_retry(self):
  self.configured();r=self.run_tool('renew');self.assertEqual(r.returncode,0,r.stderr);first=self.state();self.assertTrue(first['LAST_RENEWAL']);r=self.run_tool('renew');self.assertEqual(r.returncode,0);self.assertEqual(self.state()['LAST_RENEWAL'],first['LAST_RENEWAL']);self.assertNotIn('--renew-force',(self.root/'client-calls').read_text())
 def test_import_failure_preserves_old_identity_and_records_failure(self):
  self.configured();r=self.run_tool('renew',FAKE_IMPORT_EXIT='9');self.assertEqual(r.returncode,9);self.assertEqual(self.state()['LAST_ERROR'],'deployment_failed');self.assertFalse((self.root/'fingerprint').exists());self.assertEqual(self.run_tool('renew').returncode,0)
 def test_staging_never_imports_or_changes_production_status(self):
  self.configured();before=(self.base/'state/manager.env').read_bytes();r=self.run_tool('test');self.assertEqual(r.returncode,0,r.stderr);self.assertFalse((self.root/'imports').exists());self.assertEqual((self.base/'state/manager.env').read_bytes(),before);args=(self.root/'client-calls').read_text();self.assertIn('letsencrypt-staging',args);self.assertIn('--renew-force',args);self.assertNotIn('--deploy-hook',args)
 def test_cloudflare_token_file_wiring_and_redaction(self):
  self.configured('cloudflare');r=self.run_tool('renew',FAKE_LEAK='1');self.assertEqual(r.returncode,0,r.stderr);self.assertIn('/profile.',(self.root/'cf-path').read_text());self.assertNotIn('TESTCLOUDFLARETOKEN1234',(self.base/'state/renewal.log').read_text())
 def test_enable_disable_preserve_data_and_status_reads_real_manager_format(self):
  self.configured();self.assertNotEqual(self.run_tool('enable').returncode,0);self.assertEqual(self.run_tool('renew').returncode,0);self.assertEqual(self.run_tool('enable').returncode,0);self.assertIn('ENABLED=1',(self.service/'scripts-config/certificate-renewal.sh.conf').read_text())
  runtime=self.service/'scripts-runtime/certificate-renewal.sh';runtime.mkdir(parents=True);(runtime/'status').write_text('STATE=running\nPID=123\n');self.assertIn('Service state: running',self.run_tool('status').stdout)
  self.assertEqual(self.run_tool('disable').returncode,0);self.assertIn('ENABLED=0',(self.service/'scripts-config/certificate-renewal.sh.conf').read_text());self.assertTrue((self.base/'config/renewal.env').exists());self.assertTrue((self.root/'fingerprint').exists())
 def test_custom_startup_script_is_not_overwritten(self):
  folder=self.service/'scripts';folder.mkdir(parents=True);target=folder/'certificate-renewal.sh';target.write_text('#!/bin/sh\necho custom\n');r=self.run_tool('configure','--prepare-only');self.assertNotEqual(r.returncode,0);self.assertEqual(target.read_text(),'#!/bin/sh\necho custom\n');self.assertFalse((self.base/'config/renewal.env').exists())
 def test_old_supervisor_cannot_enable_service(self):
  self.configured();self.assertEqual(self.run_tool('renew').returncode,0);self.exe(self.supervisor,'#!/bin/sh\nprintf \'{"protocol":1}\\n\'\n');r=self.run_tool('enable');self.assertNotEqual(r.returncode,0);self.assertFalse((self.root/'starts').exists());self.assertFalse((self.service/'scripts-config/certificate-renewal.sh.conf').exists())
 def test_startup_daemon_does_not_inherit_operation_lock(self):
  self.configured();self.assertEqual(self.run_tool('renew').returncode,0)
  self.exe(self.init,'#!/bin/sh\nsleep 2 >/dev/null 2>&1 </dev/null &\n')
  self.assertEqual(self.run_tool('enable').returncode,0);self.assertEqual(self.run_tool('renew').returncode,0)
 def test_corrupt_download_does_not_commit_configuration(self):
  (self.base/'bin/lego').unlink();bad=self.root/'bad.tar.gz';bad.write_text('corrupt');code,text,_=self.wizard(self.answers(),extra=('--archive',str(bad)));self.assertNotEqual(code,0);self.assertIn('checksum mismatch',text);self.assertFalse((self.base/'config/renewal.env').exists())
 def test_tampered_client_is_rejected(self):
  self.configured();(self.base/'bin/lego').write_text('#!/bin/sh\necho tampered\n');r=self.run_tool('renew');self.assertNotEqual(r.returncode,0);self.assertFalse((self.root/'client-calls').exists())
 def test_reconfigure_requires_disabled_service_and_new_success(self):
  self.configured();self.assertEqual(self.run_tool('renew').returncode,0);self.assertEqual(self.run_tool('enable').returncode,0)
  before=(self.base/'config/renewal.env').read_bytes();r=self.run_tool('configure','--prepare-only');self.assertNotEqual(r.returncode,0);self.assertIn('Run disable',r.stderr);self.assertEqual((self.base/'config/renewal.env').read_bytes(),before)
  self.assertEqual(self.run_tool('disable').returncode,0);code,text,_=self.wizard(self.answers(existing=True));self.assertEqual(code,0,text);self.assertEqual(self.state()['LAST_SUCCESS'],'');self.assertNotEqual(self.run_tool('enable').returncode,0);self.assertTrue(list((self.base/'config/backups').glob('manager.*.env')))
 def test_lock_prevents_overlap(self):
  self.configured();a=subprocess.Popen([str(TOOL),'renew'],env=dict(self.env,FAKE_DELAY='1'),stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
  try:
   for _ in range(100):
    if (self.root/'client-calls').exists():break
    time.sleep(.02)
   b=self.run_tool('renew');self.assertEqual(b.returncode,75);self.assertEqual(a.wait(timeout=5),0);self.assertEqual(len((self.root/'client-calls').read_text().splitlines()),1)
  finally:
   if a.poll() is None:a.kill();a.wait()
if __name__=='__main__':unittest.main(verbosity=2)
