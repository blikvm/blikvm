#!/usr/bin/env python3
"""Reproducible public reference download; --check rejects stale artifacts."""
from pathlib import Path
import hashlib,io,sys,zipfile
root=Path(__file__).resolve().parents[1]/'static/examples/acme'
names=['blikvm-acme','renew-once.sh','deploy.sh','certificate-renewal.sh','renewal.env.example','certificate-renewal.sh.conf']
buf=io.BytesIO()
with zipfile.ZipFile(buf,'w',compression=zipfile.ZIP_DEFLATED) as archive:
 for name in names:
  source=root/name
  if source.is_symlink() or not source.is_file():raise SystemExit('Missing regular reference source: '+name)
  item=zipfile.ZipInfo('acme-reference/'+name,(1980,1,1,0,0,0));item.compress_type=zipfile.ZIP_DEFLATED;item.external_attr=((0o100755 if name=='blikvm-acme' or name.endswith('.sh') else 0o100644)<<16)
  archive.writestr(item,source.read_bytes())
files={name:(root/name).read_bytes() for name in names};files['acme-reference.zip']=buf.getvalue()
files['SHA256SUMS.txt']=(''.join(hashlib.sha256(data).hexdigest()+'  '+name+'\n' for name,data in files.items())).encode()
for name in ['acme-reference.zip','SHA256SUMS.txt']:
 path=root/name
 if '--check' in sys.argv:
  if not path.exists() or path.read_bytes()!=files[name]:raise SystemExit('Stale reference download: '+name)
 else:path.write_bytes(files[name])
print('Reference archive and hashes verified' if '--check' in sys.argv else 'Reference archive and hashes generated')
