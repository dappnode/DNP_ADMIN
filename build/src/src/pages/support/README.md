# Support

## Auto-diagnose

Auto-support tool to help identify error causes. Provides generic solutions to common problems after performing a list of routine checks. It also prepopulates a github issue with that DAppNode's particular system info to aid in the support proccess. All info is shown to the admin beforehand and is not sent anywhere without the explicit action of the admin.

- A **diagnose** is test or verification of a relevant part of DAppNode.
- An **info** is data to be used in prepopulating the github issue url.

## Diagnoses

They are computed in `/pages/troubleshoot/selectors`

- Connection is open (`getDiagnoseConnection`):
- Open ports (`getDiagnoseOpenPorts`):
- No NatLoopback (`getDiagnoseNoNatLoopback`):
- DAPPMANAGER returns ping (`getDiagnoseDappmanagerConnected`)
- VPN returns ping (`getDiagnoseVpnConnected`)
- IPFS resolves (`getDiagnoseIpfs`)

A diagnose object must be:

```js
{
    ok: false,
    msg: "Ports have to be openned and UPnP is not available"
    solutions: [
        "If you can, open ports manually",
        "Try to enable UPnP in your router"
    ]
}
```

A diagnose can also be `null` and it will be ignored

## Info / github issue prepopulation

They are computed in `/pages/troubleshoot/selectors`

- Core DNPs versions:
- System info:
  - Unknown items, as they are forwarded by the DAPPMANAGER

### System info

System info objects must be:

```js
{
    name: "Docker version",
    result: "Docker version 18.06.1-ce, build e68fc7a"
}
```

or

```js
{
    name: "Docker version",
    error: "Command 'docker -v' failed"
}
```
