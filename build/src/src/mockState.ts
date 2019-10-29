// Services
import { mountPoint as chainDataMountPoint } from "services/chainData/data";
import { mountPoint as connectionStatusMountPoint } from "services/connectionStatus/data";
import { mountPoint as coreUpdateMountPoint } from "services/coreUpdate/data";
import { mountPoint as dappnodeStatusMountPoint } from "services/dappnodeStatus/data";
import { mountPoint as devicesMountPoint } from "services/devices/data";
import { mountPoint as dnpDirectoryMountPoint } from "services/dnpDirectory/data";
import { mountPoint as dnpInstalledMountPoint } from "services/dnpInstalled/data";
import { mountPoint as dnpRequestMountPoint } from "services/dnpRequest/data";
import { mountPoint as isInstallingLogsMountPoint } from "services/isInstallingLogs/data";
import { mountPoint as loadingStatusMountPoint } from "services/loadingStatus/data";
import { mountPoint as notificationsMountPoint } from "services/notifications/data";
import { mountPoint as userActionLogsMountPoint } from "services/userActionLogs/data";
import { DnpRequestState } from "services/dnpRequest/types";
import { DnpDirectoryState } from "services/dnpDirectory/types";
import { UserSettings } from "types";

function getDescription(manifest: {
  shortDescription?: string;
  description: string;
}) {
  return manifest.shortDescription || manifest.description;
}

/**
 * Avatars
 * =======
 */

const bitcoinAvatar = "https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png";
const lightningNetworkAvatar = "https://i.ibb.co/Twjv2f3/ln.png";
const raidenAvatar = "https://i.ibb.co/Y0YzyrG/raiden300-min.png";
const raidenTestnetAvatar = "https://i.ibb.co/2ynnctD/raiden-testnet-300.png";
const vipnodeAvatar =
  "https://i.ibb.co/ypjjMVJ/Qmen3sr-ZXEHnc-MM2-RPsg-VKk-Pbk-JPTMN9-SNFVEAQQY4a7-Nf.png";
const trustlinesAvatar = "https://i.ibb.co/vLBbdGZ/avatar-min.png";

/**
 * Metadatas
 * =========
 */

/**
 * Lightning network
 */

const lightningNetworkMetadata = {
  name: "lightning-network.dnp.dappnode.eth",
  version: "0.0.3",
  upstreamVersion: "0.6.1-beta",
  shortDescription: "Scalable, instant Bitcoin/Blockchain transactions",
  description:
    "The Lightning Network DAppNodePackage (lnd + RTL). The Lightning Network is a decentralized system for instant, high-volume micropayments that removes the risk of delegating custody of funds to trusted third parties.",
  avatar: "/ipfs/QmVrjV1ANxjYVqRJzycYKcCUAH8nU337UsMVir1CnZYNa8",
  type: "service",
  backup: [{ name: "data", path: "/root/.lnd/data" }],
  style: {
    featuredBackground: "linear-gradient(67deg, #090909, #2f1354)",
    featuredColor: "#eee"
  },
  author:
    "DAppNode Association <admin@dappnode.io> (https://github.com/dappnode)",
  contributors: [
    "Abel Boldú (@vdo)",
    "Eduardo Antuña <eduadiez@gmail.com> (https://github.com/eduadiez)"
  ],
  categories: ["Payment channels", "Economic incentive"],
  keywords: ["bitcoin", "btc", "lightning network", "lnd"],
  links: {
    homepage:
      "https://github.com/dappnode/DAppNodePackage-LightningNetwork#readme",
    ui: "http://lightning-network.dappnode",
    api: "http://lightning-network.dappnode:8080"
  },
  repository: {
    type: "git",
    url: "git+https://github.com/dappnode/DAppNodePackage-LightningNetwork.git"
  },
  bugs: {
    url: "https://github.com/dappnode/DAppNodePackage-LightningNetwork/issues"
  },
  disclaimer: {
    message:
      "This software is experimental, presented 'as is' and inherently carries risks. By installing it, you acknowledge that DAppNode Association has done its best to mitigate these risks and accept to waive any liability or responsibility for DAppNode in case of any shortage, discrepancy, damage, loss or destruction of any digital asset managed within this DAppNode package.\n\nThis package stores private keys, which will be stored in your DAppNode. Neither DAppNode Association nor the developers of this software can have access to your private key, nor help you recover it if you lose it. \n\nYou are solely responsible for keeping your private keys and password safe and to perform secure backups, as well as to restrict access to your computer and other equipment. To the extent permitted by applicable law, you agree to be responsible for all activities that have been conducted from your account. You must take all necessary steps to ensure that your private key, password, and/or recovery phrase remain confidential and secured."
  },
  license: "GPL-3.0",
  dependencies: {
    "bitcoin.dnp.dappnode.eth": "latest"
  }
};

const lightningNetworkSetupSchema = {
  description: `This setup wizard will help you start. In case of problems: https://vipnode.io`,
  type: "object",
  required: ["network"],
  properties: {
    rtlPassword: {
      target: {
        type: "environment",
        name: "RTL_PASSWORD"
      },
      type: "string",
      title: "RTL password",
      description: "Password to protect RTL",
      minLength: 8
    },
    network: {
      target: {
        type: "environment",
        name: "NETWORK"
      },
      type: "string",
      title: "Network",
      description: "Choose which network to connect to",
      default: "mainnet",
      enum: ["mainnet", "testnet"]
    }
  }
};
const lightningNetworkSetupUiSchema = {};

const lightningNetworkSetup: UserSettings = {
  portMapping: { "9735": "9735" },
  namedVolumePath: { lndconfig_data: "" },
  environment: {
    RTL_PASSWORD: "changeme",
    RPCUSER: "dappnode",
    RPCPASS: "dappnode",
    BITCOIND_HOST: "my.bitcoin.dnp.dappnode.eth",
    NETWORK: "mainnet",
    ALIAS: "",
    COLOR: "#5ACDC5",
    EXT_IP: ""
  }
};

/**
 * Vipnode
 */

const vipnodeMetadata = {
  name: "vipnode.dnp.dappnode.eth",
  version: "0.1.0",
  upstreamVersion: "2.2.1",
  shortDescription: "Economic incentive for running Ethereum full nodes",
  description:
    "[Vipnode](https://vipnode.org)'s goal is to allow the Ethereum network to remain decentralized by creating a financial marketplace for more people to run full nodes and serve native light clients. Check this [medium article](https://medium.com/vipnode/an-economic-incentive-for-running-ethereum-full-nodes-ecc0c9ebe22) to understand the motivation behind this project and this [2.0 release article](https://medium.com/vipnode/vipnode-2-0-released-9af1d65b4552) for a tutorial on how to use Vipnode.",
  avatar: "https://ipfs.io/ipfs/Qmen3srZXEHncMM2RPsgVKkPbkJPTMN9SNFVEAQQY4a7Nf",
  type: "service",
  author:
    "DAppNode Association <admin@dappnode.io> (https://github.com/dappnode)",
  categories: ["Economic incentive"],
  links: {
    homepage: "https://github.com/dappnode/DAppNodePackage-vipnode"
  },
  wizard: {},
  disclaimer: {
    message:
      "This software is experimental, presented 'as is' and inherently carries risks. By installing it, you acknowledge that DAppNode Association has done its best to mitigate these risks and accept to waive any liability or responsibility for DAppNode in case of any shortage, discrepancy, damage, loss or destruction of any digital asset managed within this DAppNode package."
  },
  repository: {
    type: "git",
    url: "https://github.com/dappnode/DAppNodePackage-vipnode.git"
  },
  bugs: {
    url: "https://github.com/dappnode/DAppNodePackage-vipnode/issues"
  },
  license: "GPL-3.0"
};

const vipnodeSetup: UserSettings = {
  environment: { PAYOUT_ADDRESS: "" }
};

const vipnodeSetupSchema = {
  description: `This setup wizard will help you start. In case of problems: https://vipnode.io`,
  type: "object",
  required: ["payoutAddress"],
  properties: {
    payoutAddress: {
      target: {
        type: "environment",
        name: "PAYOUT_ADDRESS"
      },
      type: "string",
      title: "Payout address",
      description: "Define an Ethereum mainnet address to get rewards to",
      pattern: "^0x[a-fA-F0-9]{40}$",
      customErrors: {
        pattern: "Must be an address 0x1234... 40 bytes"
      }
    },
    keychain: {
      target: {
        type: "fileUpload",
        path: "/usr/src/app"
      },
      type: "string",
      format: "data-url",
      title: "Keychain",
      description: "Key chain containing the private key of this node",
      "ui:options": {
        accept: ".pdf"
      }
    }
  }
};

const vipnodeSetupUiSchema = {
  payoutAddress: {
    "ui:help": "Don't use your main address"
  }
};

/**
 * Raiden
 */

const raidenMetadata = {
  name: "raiden.dnp.dappnode.eth",
  version: "0.0.1",
  upstreamVersion: "0.100.3",
  shortDescription: "Fast, cheap, scalable token transfers for Ethereum",
  description:
    "The Raiden Network is an off-chain scaling solution, enabling near-instant, low-fee and scalable payments. It’s complementary to the Ethereum blockchain and works with any ERC20 compatible token. \n\n\n **Getting started** \n\n Once you have installed the Raiden DAppNode Package you **must** upload your own keystore. Go to this [getting started guide](https://github.com/dappnode/DAppNodePackage-raiden) to learn how to do so.  \n\n\n All set? Check out the [documentation and introductory guides](https://raiden-network.readthedocs.io/en/stable/#how-to-get-started) to quickly get started doing payments.",
  avatar: "/ipfs/QmaqgLyZXpETXYzhWcebNJnh6vPs4WqiCJbZY3EY1fXqer",
  type: "service",
  dependencies: {},
  requirements: {
    minimumDappnodeVersion: "0.2.4"
  },
  backup: [{ name: "keystore", path: "/root/.raiden/keystore" }],
  style: {
    featuredBackground: "linear-gradient(293deg, #000000, #313131)",
    featuredColor: "white",
    featuredAvatarFilter: "invert(1)"
  },
  author:
    "DAppNode Association <admin@dappnode.io> (https://github.com/dappnode)",
  contributors: ["Abel Boldú (@vdo)"],
  homepage: {
    homepage: "https://github.com/dappnode/DAppNodePackage-raiden#readme"
  },
  repository: {
    type: "git",
    url: "https://github.com/dappnode/DAppNodePackage-raiden.git"
  },
  bugs: {
    url: "https://github.com/dappnode/DAppNodePackage-raiden/issues"
  },
  disclaimer: {
    message:
      "This software is experimental, presented 'as is' and inherently carries risks. By installing it, you acknowledge that DAppNode Association has done its best to mitigate these risks and accept to waive any liability or responsibility for DAppNode in case of any shortage, discrepancy, damage, loss or destruction of any digital asset managed within this DAppNode package.\n\nThis package stores private keys, which will be stored in your DAppNode. Neither DAppNode Association nor the developers of this software can have access to your private key, nor help you recover it if you lose it. \n\nYou are solely responsible for keeping your private keys and password safe and to perform secure backups, as well as to restrict access to your computer and other equipment. To the extent permitted by applicable law, you agree to be responsible for all activities that have been conducted from your account. You must take all necessary steps to ensure that your private key, password, and recovery phrase remain confidential and secured. \n\nThis is an Alpha version of experimental open source software released as a test version under an MIT license and may contain errors and/or bugs. No guarantee or representations whatsoever is made regarding its suitability (or its use) for any purpose or regarding its compliance with any applicable laws and regulations. Use of the software is at your own risk and discretion and by using the software you acknowledge that you have read this disclaimer, understand its contents, assume all risk related thereto and hereby release, waive, discharge and covenant not to sue Brainbot Labs Establishment or any officers, employees or affiliates from and for any direct or indirect liability resulting from the use of the software as permissible by applicable laws and regulations.\n\nPrivacy Warning: Please be aware, that by using the Raiden Client, \namong others, your Ethereum address, channels, channel deposits, settlements and the Ethereum address of your channel counterparty will be stored on the Ethereum chain, i.e. on servers of Ethereum node operators and ergo are to a certain extent publicly available. The same might also be stored on systems of parties running Raiden nodes connected to the same token network. Data present in the Ethereum chain is very unlikely to be able to be changed, removed or deleted from the public arena.\n\nAlso be aware, that data on individual Raiden token transfers will be made available via the Matrix protocol to the recipient, intermediating nodes of a specific transfer as well as to the Matrix server operators."
  },
  license: "MIT License"
};

const raidenSetup = {
  restart: "always",
  ports: [],
  volumes: ["data:/root/.raiden"],
  environment: [
    "RAIDEN_KEYSTORE_PASSWORD=",
    "RAIDEN_ADDRESS=",
    "EXTRA_OPTS=--disable-debug-logfile"
  ]
};

/**
 * Raiden testnet
 */

const raidenTestnetMetadata = {
  name: "raiden-testnet.dnp.dappnode.eth",
  version: "0.0.2",
  description:
    "The Raiden Network is an off-chain scaling solution, enabling near-instant, low-fee and scalable payments. It’s complementary to the Ethereum blockchain and works with any ERC20 compatible token. \n\n\n **Getting started** \n\n Once you have installed the Raiden DAppNode Package you **must** upload your own keystore. Go to this [getting started guide](https://github.com/dappnode/DAppNodePackage-raiden) to learn how to do so.  \n\n\n All set? Check out the [documentation and introductory guides](https://raiden-network.readthedocs.io/en/stable/#how-to-get-started) to quickly get started doing payments.",
  avatar: "/ipfs/QmaqgLyZXpETXYzhWcebNJnh6vPs4WqiCJbZY3EY1fXqer",
  type: "service",
  author:
    "DAppNode Association <admin@dappnode.io> (https://github.com/dappnode)",
  contributors: ["Abel Boldú (@vdo)", "Eduardo Antuña (@eduadiez)"],
  homepage: {
    WebApplication: "http://raiden-testnet.dappnode/",
    homepage:
      "https://github.com/dappnode/DAppNodePackage-raiden-testnet#readme"
  },
  repository: {
    type: "git",
    url: "http://github.com/dappnode/DAppNodePackage-raiden-testnet.git"
  },
  bugs: {
    url: "https://github.com/dappnode/DAppNodePackage-raiden-testnet/issues"
  },
  license: "GPL-3.0",
  dependencies: {
    "goerli-geth.dnp.dappnode.eth": "latest"
  },
  disclaimer: {
    message:
      "This software is experimental, presented 'as is' and inherently carries risks. By installing it, you acknowledge that DAppNode Association has done its best to mitigate these risks and accept to waive any liability or responsibility for DAppNode in case of any shortage, discrepancy, damage, loss or destruction of any digital asset managed within this DAppNode package.\n\nThis package stores private keys, which will be stored in your DAppNode. Neither DAppNode Association nor the developers of this software can have access to your private key, nor help you recover it if you lose it. \n\nYou are solely responsible for keeping your private keys and password safe and to perform secure backups, as well as to restrict access to your computer and other equipment. To the extent permitted by applicable law, you agree to be responsible for all activities that have been conducted from your account. You must take all necessary steps to ensure that your private key, password, and recovery phrase remain confidential and secured. \n\nThis is an Alpha version of experimental open source software released as a test version under an MIT license and may contain errors and/or bugs. No guarantee or representations whatsoever is made regarding its suitability (or its use) for any purpose or regarding its compliance with any applicable laws and regulations. Use of the software is at your own risk and discretion and by using the software you acknowledge that you have read this disclaimer, understand its contents, assume all risk related thereto and hereby release, waive, discharge and covenant not to sue Brainbot Labs Establishment or any officers, employees or affiliates from and for any direct or indirect liability resulting from the use of the software as permissible by applicable laws and regulations.\n\nPrivacy Warning: Please be aware, that by using the Raiden Client, \namong others, your Ethereum address, channels, channel deposits, settlements and the Ethereum address of your channel counterparty will be stored on the Ethereum chain, i.e. on servers of Ethereum node operators and ergo are to a certain extent publicly available. The same might also be stored on systems of parties running Raiden nodes connected to the same token network. Data present in the Ethereum chain is very unlikely to be able to be changed, removed or deleted from the public arena.\n\nAlso be aware, that data on individual Raiden token transfers will be made available via the Matrix protocol to the recipient, intermediating nodes of a specific transfer as well as to the Matrix server operators."
  }
};

const raidenTestnetSetup = {
  restart: "always",
  ports: [],
  volumes: ["data:/root/.raiden"],
  environment: [
    "RAIDEN_ADDRESS=",
    "RAIDEN_KEYSTORE_PASSWORD=",
    "RAIDEN_ETH_RPC_ENDPOINT=http://goerli-geth.dappnode:8545",
    "RAIDEN_NETWORK_ID=goerli",
    "EXTRA_OPTS=--disable-debug-logfile"
  ]
};

/**
 * Bitcoin
 */

const bitcoinMetadata = {
  name: "bitcoin.dnp.dappnode.eth",
  version: "0.1.3",
  description:
    "The Bitcoin Core daemon (0.18.0). Bitcoind is a program that implements the Bitcoin protocol for remote procedure call (RPC) use.",
  avatar: "/ipfs/QmNrfF93ppvjDGeabQH8H8eeCDLci2F8fptkvj94WN78pt",
  type: "service",
  style: {
    featuredBackground: "linear-gradient(to right, #4b3317, #cb6e00)",
    featuredColor: "white"
  },
  author:
    "DAppNode Association <admin@dappnode.io> (https://github.com/dappnode)",
  contributors: [
    "Abel Boldú (@vdo)",
    "Eduardo Antuña <eduadiez@gmail.com> (https://github.com/eduadiez)",
    "Loco del Bitcoin <ellocodelbitcoin@gmail.com>"
  ],
  keywords: ["bitcoin", "btc"],
  homepage: {
    homepage: "https://github.com/dappnode/DAppNodePackage-bitcoin#readme"
  },
  repository: {
    type: "git",
    url: "git+https://github.com/dappnode/DAppNodePackage-bitcoin.git"
  },
  bugs: {
    url: "https://github.com/dappnode/DAppNodePackage-bitcoin/issues"
  },
  license: "GPL-3.0"
};

const bitcoinSetup: UserSettings = {
  portMapping: { "8333": "8333" },
  namedVolumePath: { bitcoin_data: "/dev1/custom-path-previously-set" },
  environment: {
    BTC_RPCUSER: "dappnode",
    BTC_RPCPASSWORD: "dappnode",
    BTC_TXINDEX: "1",
    BTC_PRUNE: "0"
  }
};

const bitcoinSetupSchema = {
  description: `Bitcoin setup https://docs.bitcoin.io`,
  type: "object",
  required: ["txIndex"],
  properties: {
    txIndex: {
      target: {
        type: "environment",
        name: "BTC_TXINDEX"
      },
      type: "string",
      title: "TX index",
      description: "Choose the TX index",
      default: "1",
      enum: ["0", "1", "2"]
    },
    bitcoinData: {
      target: {
        type: "namedVolumePath",
        volumeName: "bitcoin_data"
      },
      type: "string",
      title: "Custom volume data path",
      description:
        "If you want to store the Bitcoin blockchain is a separate drive, enter the absolute path of the location of an external drive."
    }
  }
};

/**
 * Ethchain
 */

const ethchainMetadata = {
  name: "ethchain.dnp.dappnode.eth",
  version: "0.2.6",
  description:
    "Dappnode package responsible for providing the Ethereum blockchain, based on Parity v2.5.8-stable",
  avatar: "/ipfs/QmNdWMzgapc49kpofYFE9M63Snc2dKJ8YQmEmdRU8wPMEg",
  type: "dncore",
  chain: "ethereum",
  upstreamVersion: "v2.5.8-stable",
  author:
    "DAppNode Association <admin@dappnode.io> (https://github.com/dappnode)",
  contributors: [
    "Eduardo Antuña <eduadiez@gmail.com> (https://github.com/eduadiez)"
  ],
  keywords: ["DAppNodeCore", "Parity", "Mainnet", "Ethereum"],
  links: {
    endpoint: "http://my.ethchain.dnp.dappnode.eth:8545",
    homepage: "https://github.com/dappnode/DNP_ETHCHAIN#readme"
  },
  repository: {
    type: "git",
    url: "https://github.com/dappnode/DNP_ETHCHAIN"
  },
  bugs: {
    url: "https://github.com/dappnode/DNP_ETHCHAIN/issues"
  },
  license: "GPL-3.0"
};

const ethchainSetup = {
  volumes: [
    "ethchaindnpdappnodeeth_data:/root/.local/share/io.parity.ethereum/",
    "ethchaindnpdappnodeeth_geth:/root/.ethereum/"
  ],
  ports: ["30303:30303", "30303:30303/udp", "30304:30304/udp"],
  environment: ["EXTRA_OPTS_PARITY=", "EXTRA_OPTS_GETH=", "DEFAULT_CLIENT="],
  restart: "always",
  subnet: "172.33.0.0/16",
  ipv4_address: "172.33.1.6"
};

/**
 * Trustlines metadata
 */

const trustlinesMetadata = {
  name: "trustlines.dnp.dappnode.eth",
  version: "0.0.1",
  upstreamVersion: "release4044",
  shortDescription: "Financial inclusion through OS decentralized systems",
  description:
    "The Trustlines Protocol aims to provide the service of “transfer of value” without actually transferring value. This can be accomplished by leveraging networks of mutual-trust. The Trustlines Protocol is being built to support a range of use cases by leveraging existing networks of mutual trust and mapping trust-based relationships onto trustless infrastructure",
  avatar: "/ipfs/QmcpEAc5CsaSD5jc1rkmiGtjtpxDaWDMHUWWh2tUgXFhDC",
  type: "service",
  chain: "ethereum",
  requirements: {
    minimumDappnodeVersion: "0.2.10"
  },
  backup: [{ name: "config", path: "/config" }],
  style: {
    featuredBackground: "linear-gradient(67deg, #140a0a, #512424)",
    featuredColor: "white"
  },
  author:
    "DAppNode Association <admin@dappnode.io> (https://github.com/dappnode)",
  contributors: [
    "Eduardo Antuña <eduadiez@gmail.com> (https://github.com/eduadiez)"
  ],
  categories: ["Blockchain"],
  links: {
    homepage: "https://github.com/dappnode/DAppNodePackage-trustlines#readme",
    trustlines: "https://trustlines.network",
    explorer: "https://explorelaika.trustlines.foundation"
  },
  repository: {
    type: "git",
    url: "https://github.com/dappnode/DAppNodePackage-trustlines.git"
  },
  bugs: {
    url: "https://github.com/dappnode/DAppNodePackage-trustlines/issues"
  },
  license: "GPL-3.0"
};

const trustlinesSetup = {
  restart: "always",
  volumes: ["data:/data", "config:/config/custom"],
  environment: ["ROLE=observer", "ADDRESS", "PASSWORD"],
  ports: ["30300", "30300/udp"]
};

// Fake is installing package
const isInstallingDnp = "is-installing.dnp.dappnode.eth";
const isInstallingAvatar =
  "https://image.flaticon.com/icons/png/512/18/18229.png";
const isInstallingMetadata = {
  name: isInstallingDnp,
  version: "0.1.0",
  description: "Mock DNP that is installing"
};

/**
 * Actual mockState
 * ================
 */

const coreUpdateState = {
  coreDeps: {
    "admin.dnp.dappnode.eth": { version: "0.2.1" },
    "vpn.dnp.dappnode.eth": { version: "0.2.1" }
  },
  coreMetadata: {
    version: "0.2.1",
    changelog:
      "Major improvements to the 0.2 version https://github.com/dappnode/DAppNode/wiki/DAppNode-Migration-guide-to-OpenVPN",
    warnings: {
      onInstall: "Your VPN will be restarted and you may lose connection"
    }
  }
};

const dappnodeStatusState = {
  params: {},
  stats: {},
  diagnose: {},
  pingReturns: {},
  ipfsConnectionStatus: {},
  wifiStatus: { running: true },
  passwordIsInsecure: true,
  autoUpdateData: {
    settings: {
      "system-packages": { enabled: true },
      "my-packages": { enabled: true },
      "bitcoin.dnp.dappnode.eth": { enabled: false },
      "lightning-network.dnp.dappnode.eth": { enabled: true }
    },
    registry: {
      "core.dnp.dappnode.eth": {
        "0.2.4": { updated: 1563304834738, successful: true },
        "0.2.5": { updated: 1563304834738, successful: false }
      },
      "bitcoin.dnp.dappnode.eth": {
        "0.1.1": { updated: 1563304834738, successful: true },
        "0.1.2": { updated: 1563304834738, successful: true }
      },
      "lightning-network.dnp.dappnode.eth": {
        "0.1.1": { updated: 1565284039677, successful: true }
      }
    },
    pending: {
      "core.dnp.dappnode.eth": {
        version: "0.2.4",
        firstSeen: 1563218436285,
        scheduledUpdate: 1563304834738,
        completedDelay: true
      },
      "bitcoin.dnp.dappnode.eth": {
        version: "0.1.2",
        firstSeen: 1563218436285,
        scheduledUpdate: 1563304834738,
        completedDelay: false
      }
    },

    dnpsToShow: [
      {
        id: "system-packages",
        displayName: "System packages",
        enabled: true,
        feedback: { scheduled: 1566645310441 }
      },
      {
        id: "my-packages",
        displayName: "My packages",
        enabled: true,
        feedback: {}
      },
      {
        id: "bitcoin.dnp.dappnode.eth",
        displayName: "Bitcoin",
        enabled: false,
        feedback: { updated: 1563304834738 }
      },
      {
        id: "lightning-network.dnp.dappnode.eth",
        displayName: "LN",
        enabled: true,
        feedback: {
          inQueue: true,
          errorMessage:
            "Error updating LN: Mainnet is still syncing. More lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
        }
      }
    ]
  }
};

const devicesState = [
  { id: "test-name", admin: true },
  { id: "other-user", admin: false, url: "link-to-otp/?id=617824#hdfuisf" }
];

const dnpDirectoryState: DnpDirectoryState = [
  {
    name: "bitcoin.dnp.dappnode.eth",
    description: getDescription(bitcoinMetadata),
    avatar: "https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png",
    isInstalled: false,
    isUpdated: false,
    whitelisted: true,
    isFeatured: false,
    categories: ["Blockchain"]
  },
  {
    name: "lightning-network.dnp.dappnode.eth",
    description: getDescription(lightningNetworkMetadata),
    avatar: lightningNetworkAvatar,
    isInstalled: false,
    isUpdated: false,
    whitelisted: true,
    isFeatured: false,
    categories: ["Payment channels", "Economic incentive"]
  },
  {
    name: "raiden.dnp.dappnode.eth",
    description: getDescription(raidenMetadata),
    avatar: raidenAvatar,
    isInstalled: true,
    isUpdated: true,
    whitelisted: true,
    isFeatured: false,
    categories: ["Payment channels"]
  },
  {
    name: "raiden-testnet.dnp.dappnode.eth",
    description: getDescription(raidenTestnetMetadata),
    avatar: raidenTestnetAvatar,
    isInstalled: true,
    isUpdated: false,
    whitelisted: true,
    isFeatured: false,
    categories: ["Developer tools"]
  },
  {
    name: "vipnode.dnp.dappnode.eth",
    description: getDescription(vipnodeMetadata),
    avatar: vipnodeAvatar,
    isInstalled: false,
    isUpdated: false,
    whitelisted: true,
    isFeatured: false,
    categories: ["Economic incentive"]
  },
  {
    name: "trustlines.dnp.dappnode.eth",
    description: getDescription(trustlinesMetadata),
    avatar: trustlinesAvatar,
    isInstalled: false,
    isUpdated: false,
    whitelisted: true,
    isFeatured: true,
    featuredStyle: {
      featuredBackground: "linear-gradient(67deg, #140a0a, #512424)",
      featuredColor: "white"
    },
    categories: ["Blockchain"]
  },
  {
    name: isInstallingDnp,
    description: getDescription(isInstallingMetadata),
    avatar: isInstallingAvatar,
    isInstalled: false,
    isUpdated: false,
    whitelisted: true,
    isFeatured: false,
    categories: ["Blockchain"]
  }
];

const dnpInstalledState = [
  {
    name: "admin.dnp.dappnode.eth",
    isCore: true,
    state: "exited"
  },
  {
    name: "core.dnp.dappnode.eth",
    isCore: true,
    version: "0.2.3",
    state: "exited"
  },
  {
    name: "lightning-network.dnp.dappnode.eth",
    isDnp: true,
    version: "0.1.0",
    state: "running",
    ports: [
      {
        host: "30303",
        container: "30303",
        protocol: "TCP"
      },
      {
        host: "30303",
        container: "30303",
        protocol: "UDP"
      }
    ],
    volumes: [
      {
        type: "volume",
        path:
          "/var/lib/docker/volumes/dncore_ethchaindnpdappnodeeth_data/_data",
        dest: "/app/.ethchain",
        name: "dncore_ethchaindnpdappnodeeth_data",
        users: ["vipnode.dnp.dappnode.eth", "ethchain.dnp.dappnode.eth"],
        owner: "ethchain.dnp.dappnode.eth",
        isOwner: false,
        links: "2",
        size: "71.57GB"
      }
    ],
    manifest: lightningNetworkMetadata,
    envs: {
      ENV_NAME: "ENV_VALUE"
    }
  },
  {
    name: "wifi.dnp.dappnode.eth",
    isCore: true,
    envs: {
      SSID: "DAppNodeWIFI",
      WPA_PASSPHRASE: "dappnode"
    }
  },
  {
    name: "ethchain.dnp.dappnode.eth",
    isCore: true,
    version: "0.2.6",
    state: "running",
    ports: [
      {
        host: "30303",
        container: "30303",
        protocol: "TCP"
      },
      {
        host: "30303",
        container: "30303",
        protocol: "UDP"
      }
    ],
    volumes: [
      {
        type: "volume",
        path:
          "/var/lib/docker/volumes/dncore_ethchaindnpdappnodeeth_data/_data",
        dest: "/app/.ethchain",
        name: "dncore_ethchaindnpdappnodeeth_data",
        users: ["vipnode.dnp.dappnode.eth", "ethchain.dnp.dappnode.eth"],
        owner: "ethchain.dnp.dappnode.eth",
        isOwner: true,
        links: "2",
        size: "71.57GB"
      },
      {
        type: "volume",
        path:
          "/var/lib/docker/volumes/dncore_ethchaindnpdappnodeeth_geth/_data",
        dest: "/root/.ethereum/",
        name: "dncore_ethchaindnpdappnodeeth_geth",
        users: ["ethchain.dnp.dappnode.eth"],
        owner: "ethchain.dnp.dappnode.eth",
        isOwner: true,
        links: "1",
        size: "94.62GB"
      }
    ],
    envs: {
      DEFAULT_CLIENT: "GETH"
    },
    manifest: ethchainMetadata
  }
];

/**
 * ==========
 * dnpRequest
 * ==========
 */

const dnpRequestState: DnpRequestState = {
  dnps: {
    "lightning-network.dnp.dappnode.eth": {
      name: "lightning-network.dnp.dappnode.eth",
      version: "0.2.2",
      origin: null,
      avatar: lightningNetworkAvatar,
      metadata: lightningNetworkMetadata,

      imageSize: 19872630,
      isUpdated: false,
      isInstalled: false,

      settings: {
        "lightning-network.dnp.dappnode.eth": lightningNetworkSetup,
        "bitcoin.dnp.dappnode.eth": bitcoinSetup
      },
      // @ts-ignore
      setupSchema: {
        type: "object",
        properties: {
          "lightning-network.dnp.dappnode.eth": lightningNetworkSetupSchema,
          "bitcoin.dnp.dappnode.eth": bitcoinSetupSchema
        }
      },
      setupUiSchema: {
        "lightning-network.dnp.dappnode.eth": lightningNetworkSetupUiSchema,
        "bitcoin.dnp.dappnode.eth": {}
      },

      request: {
        compatible: {
          requiresCoreUpdate: false,
          resolving: false,
          isCompatible: true,
          error: "",
          dnps: {
            "lightning-network.dnp.dappnode.eth": { from: null, to: "0.2.2" },
            "bitcoin.dnp.dappnode.eth": { from: "0.2.5", to: "0.2.5" }
          }
        },
        available: {
          isAvailable: true,
          message: ""
        }
      }
    },

    "bitcoin.dnp.dappnode.eth": {
      name: "bitcoin.dnp.dappnode.eth",
      version: "0.2.5",
      origin: null,
      avatar: bitcoinAvatar,
      metadata: bitcoinMetadata,

      imageSize: 37273582,
      isUpdated: false,
      isInstalled: true,

      settings: {},
      request: {
        compatible: {
          requiresCoreUpdate: false,
          resolving: false,
          isCompatible: true,
          error: "",
          dnps: {
            "bitcoin.dnp.dappnode.eth": { from: "0.2.10", to: "0.2.5" },
            "dependency.dnp.dappnode.eth": { from: "0.0.0", to: "1.2.0" }
          }
        },
        available: {
          isAvailable: true,
          message: ""
        }
      }
    },

    "vipnode.dnp.dappnode.eth": {
      name: vipnodeMetadata.name,
      version: vipnodeMetadata.version,
      origin: null,
      avatar: vipnodeAvatar,
      metadata: vipnodeMetadata,

      imageSize: 10000000,
      isUpdated: false,
      isInstalled: true,

      settings: {
        "vipnode.dnp.dappnode.eth": vipnodeSetup
      },

      // @ts-ignore
      setupSchema: {
        type: "object",
        properties: {
          "vipnode.dnp.dappnode.eth": vipnodeSetupSchema
        }
      },
      // setupSchema: vipnodeSetupSchema,
      setupUiSchema: { "vipnode.dnp.dappnode.eth": vipnodeSetupUiSchema },

      request: {
        compatible: {
          requiresCoreUpdate: false,
          resolving: false,
          isCompatible: true,
          error: "",
          dnps: {
            "vipnode.dnp.dappnode.eth": { from: "0.2.0", to: "0.2.5" }
          }
        },
        available: {
          isAvailable: true,
          message: ""
        }
      }
    },

    "/ipfs/QmcQPSzajUUKP1j4rsnGRCcAqfnuGSFnCcC4fnmf6eUqcy": {
      name: vipnodeMetadata.name,
      version: "/ipfs/QmcQPSzajUUKP1j4rsnGRCcAqfnuGSFnCcC4fnmf6eUqcy",
      origin: "/ipfs/QmcQPSzajUUKP1j4rsnGRCcAqfnuGSFnCcC4fnmf6eUqcy",
      avatar: vipnodeAvatar,
      metadata: vipnodeMetadata,

      imageSize: 10000000,
      isUpdated: false,
      isInstalled: true,

      settings: {},
      // @ts-ignore
      setupSchema: vipnodeSetupSchema,
      setupUiSchema: vipnodeSetupUiSchema,

      request: {
        compatible: {
          requiresCoreUpdate: false,
          resolving: false,
          isCompatible: true,
          error: "",
          dnps: {
            "vipnode.dnp.dappnode.eth": { from: "0.2.0", to: "0.2.5" }
          }
        },
        available: {
          isAvailable: true,
          message: ""
        }
      }
    },

    [isInstallingDnp]: {
      name: isInstallingDnp,
      version: "0.1.0",
      origin: null,
      avatar: isInstallingAvatar,
      metadata: isInstallingMetadata,

      imageSize: 10000000,
      isUpdated: false,
      isInstalled: true,

      settings: {},
      // @ts-ignore
      setupSchema: {},
      setupUiSchema: {},

      request: {
        compatible: {
          requiresCoreUpdate: false,
          resolving: false,
          isCompatible: true,
          error: "",
          dnps: {
            [isInstallingDnp]: { from: null, to: "0.1.0" }
          }
        },
        available: {
          isAvailable: true,
          message: ""
        }
      }
    }
  },
  requestStatus: {
    "lightning-network.dnp.dappnode.eth": {
      loading: true
    },
    "raiden-testnet.dnp.dappnode.eth": {
      error: "Demo error to simulate load failure"
    }
  }
};

const isInstallingState = {
  /* Core update */
  "core.dnp.dappnode.eth": {
    id: "834d5e59-664b-46b9-8906-fbc5341d1acf",
    log: "Downloading 54%"
  },
  "vpn.dnp.dappnode.eth": {
    id: "834d5e59-664b-46b9-8906-fbc5341d1acf",
    log: "Downloading 54%"
  },
  "admin.dnp.dappnode.eth": {
    id: "834d5e59-664b-46b9-8906-fbc5341d1acf",
    log: "Loading..."
  },
  /* Regular install of non-core*/
  "bitcoin.dnp.dappnode.eth": {
    id: "834d5e59-664b-46b9-8906-fbc5341d1acf",
    log: "Downloading 87%"
  },
  [isInstallingDnp]: {
    [isInstallingDnp]: "Downloading 47%"
  }
};

const notificationsState = {
  "diskSpaceRanOut-stoppedPackages": {
    id: "diskSpaceRanOut-stoppedPackages",
    type: "danger",
    title: "Disk space ran out, stopped packages",
    body: "Available disk space gone wrong ".repeat(10),
    timestamp: 153834824,
    viewed: false,
    fromDappmanager: true
  }
};

const userActionLogsState = [
  {
    event: "installPackage.dappmanager.dnp.dappnode.eth",
    kwargs: {
      id: "rinkeby.dnp.dappnode.eth",
      userSetVols: {},
      userSetPorts: {},
      options: {}
    },
    level: "error",
    message: "Timeout to cancel expired",
    name: "Error",
    stack: "Error: Timeout to cancel expired↵  ...",
    timestamp: "2019-02-01T19:09:16.503Z"
  }
];

export const mockState = {
  /* chainData */
  [chainDataMountPoint]: [],

  /* connectionStatus */
  [connectionStatusMountPoint]: {
    isOpen: true,
    session: {}
  },

  [coreUpdateMountPoint]: coreUpdateState,
  [dappnodeStatusMountPoint]: dappnodeStatusState,
  [devicesMountPoint]: devicesState,
  [dnpRequestMountPoint]: dnpRequestState,
  [dnpDirectoryMountPoint]: dnpDirectoryState,
  [dnpInstalledMountPoint]: dnpInstalledState,
  [isInstallingLogsMountPoint]: isInstallingState,
  [loadingStatusMountPoint]: {},
  [notificationsMountPoint]: notificationsState,
  [userActionLogsMountPoint]: userActionLogsState
};
