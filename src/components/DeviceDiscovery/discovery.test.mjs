import assert from 'node:assert/strict';
import {test} from 'node:test';
import {deviceAddress, discoverDevices, parseDevices} from './discovery.mjs';

test('discovered devices cannot supply arbitrary navigation targets', () => {
  const device = {id: 'a13f7c', name: 'Lab KVM', model: 'BliKVM v4', hostname: 'BLiKVM-a13f7c.local', ip: '192.168.8.31'};
  const unsafeHosts = ['example.com', 'blikvm-discover.local', 'blikvm.local@evil.local', 'blikvm.local:8000', 'blikvm.local/other'];
  const devices = parseDevices({version: 1, devices: [
    ...unsafeHosts.map((hostname, index) => ({...device, id: `invalid-${index}`, hostname})),
    device, {...device, ip: '999.1.2.3'},
  ]});
  assert.deepEqual(devices, [{...device, hostname: 'blikvm-a13f7c.local', ip: ''}]);
  assert.throws(() => parseDevices({version: 1, devices: [{...device, hostname: 'example.com'}]}));
  assert.deepEqual(parseDevices({version: 1, devices: []}), []);
});

test('manual access accepts IP or .local addresses and rejects URL syntax', () => {
  assert.equal(deviceAddress(' 192.168.8.31 '), 'https://192.168.8.31');
  assert.equal(deviceAddress('blikvm-a13f7c.local'), 'https://blikvm-a13f7c.local');
  assert.equal(deviceAddress('[fd00::123]'), 'https://[fd00::123]');
  for (const value of ['2130706433', '192.168.8.999', '192.168.08.31', 'example.com', '//example.local', 'user@device.local', 'device.local?foo=bar']) {
    assert.equal(deviceAddress(value), null, value);
  }
});

test('discovery reads only the local endpoint and omits user data from the request', async t => {
  const controller = new AbortController();
  const mockedFetch = t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({version: 1, devices: []})));
  assert.deepEqual(await discoverDevices(controller.signal), []);
  assert.deepEqual(mockedFetch.mock.calls[0].arguments, [
    'http://blikvm-discover.local/api/v1/discovery',
    {
      cache: 'no-store', credentials: 'omit', mode: 'cors', redirect: 'error',
      referrerPolicy: 'no-referrer', signal: controller.signal, targetAddressSpace: 'local',
    },
  ]);
});
