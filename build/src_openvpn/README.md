# OpenVPN UI

Url template:

`http://origin/?{urlParams}#${key}`

Url example

`http://origin/?id=7e00cfadbe61f2ed&name=MyDAppNode&intip=192.168.20.42#mc5pGQQ4VbbuWJDayJD0kXsElAUddmUktJYUYSDNaDE=`

## Mandatory params

- `id`: VPN credentials file ID. It is supplied by the VPN user managment process. 16 character hexadecimal ID, i.e. `"7e00cfadbe61f2ed"`

## Optional params

- `name`: DAppNode's server name. Used in the VPN credentials metadata and file name at download time, i.e. `"MyDAppNode"`
- `intip`: The internal IP of the DAppNode. The existance of this url param signals the OpenVPN UI that NAT Loopback is disabled and two profiles must be offered to the user, i.e. `"192.168.0.1"`

## Dev urls

- `http://localhost?dev=error` : Show an error state
- `http://localhost?dev=loading` : Show the loading state
- `http://localhost?dev=success` : Show the success state
- `http://localhost?dev=success-intip` : Show the success + noNatLoopback case
