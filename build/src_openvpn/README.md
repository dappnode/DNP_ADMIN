# OpenVPN UI

Url template:

`http://origin/?{urlParams}#${key}`

Url example

`http://origin/?id=7e00cfadbe61f2ed&name=MyDAppNode&intip=192.168.20.42#mc5pGQQ4VbbuWJDayJD0kXsElAUddmUktJYUYSDNaDE=`

## Mandatory params

- id: VPN credentials file ID. It is supplied by the VPN user managment process. 16 character hexadecimal ID, i.e. `"7e00cfadbe61f2ed"`

## Optional params

- name: DAppNode's server name. Used in the VPN credentials metadata and file name at download time. `"MyDAppNode"`
- intip: The internal IP of the DAppNode. The existance of this url param signals the OpenVPN UI that NAT Loopback is disabled and two profiles must be offered to the user.

## Dev urls

- `http://localhost?dev=error` : Show an error state
- `http://localhost?dev=error` : Show the loading state
- `http://localhost?dev=error` : Show the success state
- `http://localhost?dev=error` : Show the success + noNatLoopback case
