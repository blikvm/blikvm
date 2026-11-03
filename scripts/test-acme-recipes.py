"""Offline process-boundary tests; never contacts a CA or DNS provider."""
import os
from pathlib import Path
import shutil
import signal
import subprocess
import tempfile
import time
import unittest

HERE=Path(__file__).resolve().parents[1]/'static/examples/acme'
@unittest.skipUnless(shutil.which('flock'), 'requires the production flock utility')
class Recipe(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.base=Path(self.tmp.name);(self.base/'bin').mkdir();(self.base/'config').mkdir()
  for n in ['renew-once.sh','deploy.sh','certificate-renewal.sh']:
   shutil.copyfile(HERE/n,self.base/'bin'/n);(self.base/'bin'/n).chmod(0o755)
  (self.base/'config/renewal.env').write_text('ACME_DOMAIN=kvm.example.com\nACME_DNS_PROVIDER=route53\nACME_ACCEPT_TOS=1\n')
  self.lego=self.base/'lego.log';self.server=self.base/'server.log'
  (self.base/'bin/lego').write_text('#!/bin/sh\nprintf "%s\\n" "$*" >> "$FAKE_LEGO_LOG"\n[ "${FAKE_DELAY:-0}" = 0 ] || sleep "$FAKE_DELAY"\nexit "${FAKE_LEGO_EXIT:-0}"\n');(self.base/'bin/lego').chmod(0o755)
  fake=self.base/'fake-server';fake.write_text('#!/bin/sh\nprintf "%s\\n" "$*" >> "$FAKE_SERVER_LOG"\nexit "${FAKE_SERVER_EXIT:-0}"\n');fake.chmod(0o755)
  self.env=dict(os.environ,BLIKVM_ACME_DIR=str(self.base),BLIKVM_SERVER_BIN=str(fake),FAKE_LEGO_LOG=str(self.lego),FAKE_SERVER_LOG=str(self.server))
 def run_once(self,**env):return subprocess.run([str(self.base/'bin/renew-once.sh')],env=dict(self.env,**env),capture_output=True,text=True,timeout=5)
 def test_success_deploys_through_root_cli(self):
  self.assertEqual(self.run_once().returncode,0);args=self.server.read_text();self.assertIn('--subcomponent certificate-import',args);self.assertIn('state/production/certificates/kvm.example.com.key',args);self.assertIn('--deploy-hook',self.lego.read_text())
 def test_renewal_failure_never_deploys(self):
  self.assertEqual(self.run_once(FAKE_LEGO_EXIT='7').returncode,7);self.assertFalse(self.server.exists())
 def test_deploy_failure_is_retried_on_next_successful_check(self):
  self.assertEqual(self.run_once(FAKE_SERVER_EXIT='9').returncode,9);self.assertEqual(self.run_once().returncode,0);self.assertEqual(len(self.server.read_text().splitlines()),2)
 def test_no_terms_consent_means_no_client_execution(self):
  p=self.base/'config/renewal.env';p.write_text(p.read_text().replace('ACME_ACCEPT_TOS=1','ACME_ACCEPT_TOS=0'));self.assertNotEqual(self.run_once().returncode,0);self.assertFalse(self.lego.exists())
 def test_unsafe_domain_cannot_reach_importer(self):
  p=self.base/'config/renewal.env';p.write_text(p.read_text().replace('kvm.example.com','../../other'));self.assertNotEqual(self.run_once().returncode,0);self.assertFalse(self.server.exists())
 def test_exclusive_lock_prevents_overlapping_checks(self):
  first=subprocess.Popen([str(self.base/'bin/renew-once.sh')],env=dict(self.env,FAKE_DELAY='1'),stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
  try:
   end=time.monotonic()+3
   while not self.lego.exists() and time.monotonic()<end:time.sleep(.03)
   self.assertTrue(self.lego.exists());self.assertEqual(self.run_once().returncode,0);self.assertEqual(first.wait(timeout=4),0);self.assertEqual(len(self.lego.read_text().splitlines()),1)
  finally:
   if first.poll() is None:first.terminate();first.wait()
 def test_resident_repeats_and_stops_as_process_group(self):
  process=subprocess.Popen([str(self.base/'bin/certificate-renewal.sh')],env=dict(self.env,BLIKVM_ACME_INTERVAL='1'),start_new_session=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
  try:
   end=time.monotonic()+5
   while time.monotonic()<end:
    if self.server.exists() and len(self.server.read_text().splitlines())>=2:break
    time.sleep(.05)
   self.assertGreaterEqual(len(self.server.read_text().splitlines()),2)
  finally:
   os.killpg(process.pid,signal.SIGTERM);process.wait(timeout=3)
if __name__=='__main__':unittest.main(verbosity=2)
