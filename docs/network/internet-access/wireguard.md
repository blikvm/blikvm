# WireGuard

Open **Settings → Remote Access → WireGuard**. Prepare `wg0.conf` for your existing VPN service. This page manages the device tunnel, not VPN-server deployment.

## Upload and enable

1. Have the VPN administrator allocate a unique tunnel address and key, peers, Endpoint, AllowedIPs and required DNS.
2. Choose the configuration and use **Upload** or **Upload and enable**.
3. Check saved configuration, service state and tunnel IP. **Download current file** can back it up; protect the enclosed private key.
4. Join the management computer to a routable VPN network and open the displayed VPN address.
5. Verify video, input and reconnection after refresh.

## Troubleshooting

- No handshake: check server Endpoint, UDP reachability, keys and peer settings.
- Handshake but no access: check AllowedIPs, both routes, firewalls and address conflicts.
- Configuration exists but service disabled: upload and tunnel activation are separate states.
- Other outbound traffic fails: inspect default-route takeover and DNS reachability.

The web flow needs no old package-install, `iptables` or `systemctl` examples. Full-tunnel routes such as `0.0.0.0/0` change device egress and should be chosen by an administrator who knows the topology, not used as universal defaults.
