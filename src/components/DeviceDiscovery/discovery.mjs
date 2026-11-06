const endpoint = 'http://blikvm-discover.local/api/v1/discovery';
const localName = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.local$/i;
const ipv4 = /^(?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3}$/;

function isIPv4(value) {
  return ipv4.test(value) && value.split('.').every(part => Number(part) < 256);
}

export function deviceAddress(value) {
  const address = value.trim();
  if (!localName.test(address) && !isIPv4(address) && !/^\[[0-9a-f:.]+\]$/i.test(address)) {
    return null;
  }
  try {
    return new URL(`https://${address}`).origin;
  } catch {
    return null;
  }
}

export function parseDevices(body) {
  if (body?.version !== 1 || !Array.isArray(body.devices) || body.devices.length > 256) {
    throw new Error('Invalid BliKVM discovery response');
  }
  const devices = new Map();
  for (const device of body.devices) {
    if (typeof device?.id !== 'string' || !/^[a-z0-9-]{6,64}$/i.test(device.id) ||
        typeof device.hostname !== 'string' || !localName.test(device.hostname) ||
        device.hostname.toLowerCase() === 'blikvm-discover.local') {
      continue;
    }
    const hostname = device.hostname.toLowerCase();
    devices.set(device.id, {
      id: device.id,
      name: typeof device.name === 'string' && device.name.trim() ? device.name.trim().slice(0, 96) : hostname,
      model: typeof device.model === 'string' ? device.model.slice(0, 64) : '',
      hostname,
      ip: typeof device.ip === 'string' && isIPv4(device.ip) ? device.ip : '',
    });
  }
  if (body.devices.length && !devices.size) {
    throw new Error('Invalid BliKVM devices');
  }
  return [...devices.values()];
}

export async function discoverDevices(signal) {
  const response = await fetch(endpoint, {
    cache: 'no-store',
    credentials: 'omit',
    mode: 'cors',
    redirect: 'error',
    referrerPolicy: 'no-referrer',
    signal,
    targetAddressSpace: 'local',
  });
  if (!response.ok) throw new Error('BliKVM discovery is unavailable');
  return parseDevices(await response.json());
}

export async function localNetworkDenied() {
  for (const name of ['local-network', 'local-network-access']) {
    try {
      const permission = await navigator.permissions.query({name});
      return permission.state === 'denied';
    } catch {
      // Browsers differ in which permission names they expose.
    }
  }
  return false;
}
