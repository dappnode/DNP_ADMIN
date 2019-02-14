<p align="center"><a href="#"><img width="400" title="ADMIN" src='banner-admin.png' /></a></p>

[![Website dappnode.io](https://img.shields.io/badge/Website-dappnode.io-brightgreen.svg)](https://dappnode.io/)
[![Documentation Wiki](https://img.shields.io/badge/Documentation-Wiki-brightgreen.svg)](https://github.com/dappnode/DAppNode/wiki)
[![GIVETH Campaign](https://img.shields.io/badge/GIVETH-Campaign-1e083c.svg)](https://beta.giveth.io/campaigns/5b44b198647f33526e67c262)
[![RIOT DAppNode](https://img.shields.io/badge/RIOT-DAppNode-blue.svg)](https://riot.im/app/#/room/#DAppNode:matrix.org)
[![Twitter Follow](https://img.shields.io/twitter/follow/espadrine.svg?style=social&label=Follow)](https://twitter.com/DAppNODE?lang=es)

The **DNP_ADMIN** serves the [admin UI](build/src) accessible only if connected to a DAppNode at [my.admin.dnp.dappnode.eth](http://my.admin.dnp.dappnode.eth). It also serves the access UI.

- :bust_in_silhouette: For user / usage documentation go to the [user manual](https://dappnode.readthedocs.io/en/latest/user-manual.html#admin)
- :wrench: For developers check the [technical documentation](build/src)
- :speech_balloon: For feedback and reporting problems please [submit an issue](https://github.com/dappnode/DNP_ADMIN/issues/new) or contact us on [RIOT•IM](https://riot.im/app/#/room/#DAppNode:matrix.org)

The [admin.dnp.dappnode.eth](https://etherscan.io/enslookup?q=admin.dnp.dappnode.eth) is an AragonApp whose repo is deployed at this address: [0xee66c4765696c922078e8670aa9e6d4f6ffcc455
](https://etherscan.io/address/0xee66c4765696c922078e8670aa9e6d4f6ffcc455).

## Getting Started

This repo is an isolated single piece of DAppNode. To actually install and use DAppNode go to the [installation guide](https://github.com/dappnode/DAppNode/wiki/DAppNode-Installation-Guide).

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You must have git, docker and docker-compose in your environment to run this repo. To verify so, run the following commands.

```
git --version
docker --version
docker-compose --version
```

Go to the pre-requisites setup guide if you any command returned an error and need to install a pre-requisite.

### Install and run

To get started, clone the project locally.

```
git clone https://github.com/dappnode/DNP_ADMIN.git
```

To develop locally, cd into the src folder and start the [create react app](https://facebook.github.io/create-react-app/) aplication. It uses [yarn](https://yarnpkg.com/) as dependency manager, so please use it instead of npm to prevent [package locks issues](https://stackoverflow.com/questions/44552348/should-i-commit-yarn-lock-and-package-lock-json-files).

```
cd build/src
yarn
yarn start
```

The Admin UI expects to be in a DAppNode network to connect to its WAMP module, Ethereum node and IPFS node.

### Build and publish

We highly encourage to use the [dappnodesdk](https://github.com/dappnode/DAppNodeSDK) (DAppNode Software Development Kit) to build and distribute DNPs. Please check [this tutorial](https://github.com/dappnode/DAppNodeSDK) to build, test and publish a DNP.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/dappnode) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/dappnode/DNP_ADMIN/tags).

## Authors

- **DAppLion** - [dapplion](https://github.com/dapplion)
- **Eduardo Antuña Díez** - [eduadiez](https://github.com/eduadiez)

See also the list of [contributors](https://github.com/dappnode/DNP_ADMIN/contributors) who participated in this project.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details
