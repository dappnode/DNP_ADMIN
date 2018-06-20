# DNP_ADMIN

[![Website dappnode.io](https://img.shields.io/badge/Website-dappnode.io-brightgreen.svg)](https://dappnode.io/)
[![Documentation Wiki](https://img.shields.io/badge/Documentation-Wiki-brightgreen.svg)](https://github.com/dappnode/DAppNode/wiki)
[![GIVETH Campaign](https://img.shields.io/badge/GIVETH-Campaign-1e083c.svg)](https://alpha.giveth.io/campaigns/OcKJryNwjeidMXi9)
[![RIOT DAppNode](https://img.shields.io/badge/RIOT-DAppNode-blue.svg)](https://riot.im/app/#/room/#DAppNode:matrix.org)
[![Twitter Follow](https://img.shields.io/twitter/follow/espadrine.svg?style=social&label=Follow)](https://twitter.com/DAppNODE?lang=es)

<p align="left">
  <img src="ADMINUI-min.png" width="200"/>
</p>

DAppNode tool responsible for providing the admin UI of DAppNode.

It is an AragonApp whose repo is deployed at this address: [0xee66c4765696c922078e8670aa9e6d4f6ffcc455
](https://etherscan.io/address/0xee66c4765696c922078e8670aa9e6d4f6ffcc455
) and whose ENS address is: [admin.dnp.dappnode.eth](https://etherscan.io/enslookup?q=admin.dnp.dappnode.eth)

## Usage

Once connected to DAppNode, go to [my.admin.dnp.dappnode.eth](http://my.admin.dnp.dappnode.eth) to manage packages or devices.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- git

   Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) commandline tool.

- docker

   Install [docker](https://docs.docker.com/engine/installation). The community edition (docker-ce) will work. In Linux make sure you grant permissions to the current user to use docker by adding current user to docker group, `sudo usermod -aG docker $USER`. Once you update the users group, exit from the current terminal and open a new one to make effect.

- docker-compose

   Install [docker-compose](https://docs.docker.com/compose/install)
   
**Note**: Make sure you can run `git`, `docker ps`, `docker-compose` without any issue and without sudo command.

### Building

```
$ git clone https://github.com/dappnode/DNP_ADMIN.git
```

```
$ docker-compose -f docker-compose-admin.yml build
or 
$ docker build --rm -f build/Dockerfile -t dnp_admin:dev build 
```

### Running

#### Start
```
$ docker-compose -f docker-compose-admin.yml up -d
```
#### Stop
```
$ docker-compose -f docker-compose-admin.yml down
```
#### Status
```
$ docker-compose -f docker-compose-admin.yml ps
```
#### Logs
```
$ docker-compose -f docker-compose-admin.yml logs -f
```

## Generating a tar.xz image

[xz](https://tukaani.org/xz/) is required 

```
$ docker save dnp_admin:dev | xz -e9vT0 > dnp_admin.tar.xz
```

You can download the latest tar.xz version from here [releases](https://github.com/dappnode/DNP_ADMIN/releases).

### Loading a Docker image

```
$docker load -i dnp_admin.tar.xz
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/dappnode) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/dappnode/DNP_ADMIN/tags).

## Authors

* **DAppLion** - [dapplion](https://github.com/dapplion)
* **Eduardo Antuña Díez** - [eduadiez](https://github.com/eduadiez)

See also the list of [contributors](https://github.com/dappnode/DNP_ADMIN/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
