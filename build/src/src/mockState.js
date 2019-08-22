// Services
import { mountPoint as chainDataMountPoint } from "services/chainData/data";
import { mountPoint as connectionStatusMountPoint } from "services/connectionStatus/data";
import { mountPoint as coreUpdateMountPoint } from "services/coreUpdate/data";
import { mountPoint as dappnodeStatusMountPoint } from "services/dappnodeStatus/data";
import { mountPoint as devicesMountPoint } from "services/devices/data";
import { mountPoint as dnpDirectoryMountPoint } from "services/dnpDirectory/data";
import { mountPoint as dnpInstalledMountPoint } from "services/dnpInstalled/data";
import { mountPoint as isInstallingLogsMountPoint } from "services/isInstallingLogs/data";
import { mountPoint as loadingStatusMountPoint } from "services/loadingStatus/data";
import { mountPoint as notificationsMountPoint } from "services/notifications/data";
import { mountPoint as userActionLogsMountPoint } from "services/userActionLogs/data";

/**
 * Manifests
 * =========
 */

const manifestLn = {
  name: "lightning-network.dnp.dappnode.eth",
  version: "0.0.3",
  upstreamVersion: "0.6.1-beta",
  shortDescription: "Scalable, instant Bitcoin/Blockchain transactions",
  description:
    "The Lightning Network DAppNodePackage (lnd + RTL). The Lightning Network is a decentralized system for instant, high-volume micropayments that removes the risk of delegating custody of funds to trusted third parties.",
  avatar: "/ipfs/QmVrjV1ANxjYVqRJzycYKcCUAH8nU337UsMVir1CnZYNa8",
  type: "service",
  image: {
    path: "",
    hash: "",
    size: "",
    ports: ["9735:9735"],
    volumes: ["lndconfig_data:/root/.lnd/"],
    restart: "always",
    environment: [
      "RTL_PASSWORD=changeme",
      "RPCUSER=dappnode",
      "RPCPASS=dappnode",
      "BITCOIND_HOST=my.bitcoin.dnp.dappnode.eth",
      "NETWORK=mainnet",
      "ALIAS=",
      "COLOR=#5ACDC5",
      "EXT_IP="
    ]
  },
  backup: [
    {
      name: "data",
      path: "/root/.lnd/data"
    }
  ],
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

const manifestVipnode = {
  name: "vipnode.dnp.dappnode.eth",
  version: "0.0.1",
  description:
    "https://vipnode.org - Economic incentive for running Ethereum full nodes. The goal is to allow the Ethereum network to remain decentralized by creating a financial marketplace for more people to run full nodes and serve native light clients.",
  avatar: "https://ipfs.io/ipfs/Qmen3srZXEHncMM2RPsgVKkPbkJPTMN9SNFVEAQQY4a7Nf",
  type: "service",
  image: {
    path: "vipnode.dnp.dappnode.eth_0.0.1.tar.xz",
    hash: "/ipfs/QmYnj7JtmDn4KuQADDNSAo2UwM9npjATjsX8AK12LewhyQ",
    size: 7848217,
    restart: "always",
    environment: ["PAYOUT_ADDRESS="],
    external_vol: ["dncore_ethchaindnpdappnodeeth_data:/app/.ethchain:ro"]
  },
  dependencies: {},
  disclaimer: {
    message:
      "This software is experimental, presented 'as is' and inherently carries risks. By installing it, you acknowledge that DAppNode Association has done its best to mitigate these risks and accept to waive any liability or responsibility for DAppNode in case of any shortage, discrepancy, damage, loss or destruction of any digital asset managed within this DAppNode package.\n\nThis package stores private keys, which will be stored in your DAppNode. Neither DAppNode Association nor the developers of this software can have access to your private key, nor help you recover it if you lose it. \n\nYou are solely responsible for keeping your private keys and password safe and to perform secure backups, as well as to restrict access to your computer and other equipment. To the extent permitted by applicable law, you agree to be responsible for all activities that have been conducted from your account. You must take all necessary steps to ensure that your private key, password, and recovery phrase remain confidential and secured. \n\nThis is an Alpha version of experimental open source software released as a test version under an MIT license and may contain errors and/or bugs. No guarantee or representations whatsoever is made regarding its suitability (or its use) for any purpose or regarding its compliance with any applicable laws and regulations. Use of the software is at your own risk and discretion and by using the software you acknowledge that you have read this disclaimer, understand its contents, assume all risk related thereto and hereby release, waive, discharge and covenant not to sue Brainbot Labs Establishment or any officers, employees or affiliates from and for any direct or indirect liability resulting from the use of the software as permissible by applicable laws and regulations.\n\nPrivacy Warning: Please be aware, that by using the Raiden Client, \namong others, your Ethereum address, channels, channel deposits, settlements and the Ethereum address of your channel counterparty will be stored on the Ethereum chain, i.e. on servers of Ethereum node operators and ergo are to a certain extent publicly available. The same might also be stored on systems of parties running Raiden nodes connected to the same token network. Data present in the Ethereum chain is very unlikely to be able to be changed, removed or deleted from the public arena.\n\nAlso be aware, that data on individual Raiden token transfers will be made available via the Matrix protocol to the recipient, intermediating nodes of a specific transfer as well as to the Matrix server operators."
  }
};

const manifestRaiden = {
  name: "raiden.dnp.dappnode.eth",
  version: "0.0.1",
  upstreamVersion: "0.100.3",
  shortDescription: "Fast, cheap, scalable token transfers for Ethereum",
  description:
    "The Raiden Network is an off-chain scaling solution, enabling near-instant, low-fee and scalable payments. It’s complementary to the Ethereum blockchain and works with any ERC20 compatible token. \n\n\n **Getting started** \n\n Once you have installed the Raiden DAppNode Package you **must** upload your own keystore. Go to this [getting started guide](https://github.com/dappnode/DAppNodePackage-raiden) to learn how to do so.  \n\n\n All set? Check out the [documentation and introductory guides](https://raiden-network.readthedocs.io/en/stable/#how-to-get-started) to quickly get started doing payments.",
  avatar: "/ipfs/QmaqgLyZXpETXYzhWcebNJnh6vPs4WqiCJbZY3EY1fXqer",
  type: "service",
  image: {
    path: "raiden.dnp.dappnode.eth_0.0.1.tar.xz",
    hash: "/ipfs/QmZR6Fqo1S3opX1ZRpCVFwz9YywNuRHPUbDsnJqeUyZZyE",
    size: 24469186,
    restart: "always",
    ports: [],
    volumes: ["data:/root/.raiden"],
    environment: [
      "RAIDEN_KEYSTORE_PASSWORD=",
      "RAIDEN_ADDRESS=",
      "EXTRA_OPTS=--disable-debug-logfile"
    ],
    keywords: ["Raiden", "Ethereum"]
  },
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

const manifestRaidenTestnet = {
  name: "raiden-testnet.dnp.dappnode.eth",
  version: "0.0.2",
  description:
    "The Raiden Network is an off-chain scaling solution, enabling near-instant, low-fee and scalable payments. It’s complementary to the Ethereum blockchain and works with any ERC20 compatible token. \n\n\n **Getting started** \n\n Once you have installed the Raiden DAppNode Package you **must** upload your own keystore. Go to this [getting started guide](https://github.com/dappnode/DAppNodePackage-raiden) to learn how to do so.  \n\n\n All set? Check out the [documentation and introductory guides](https://raiden-network.readthedocs.io/en/stable/#how-to-get-started) to quickly get started doing payments.",
  avatar: "/ipfs/QmaqgLyZXpETXYzhWcebNJnh6vPs4WqiCJbZY3EY1fXqer",
  type: "service",
  image: {
    path: "",
    hash: "",
    size: "",
    restart: "always",
    ports: [],
    volumes: ["data:/root/.raiden"],
    environment: [
      "RAIDEN_ADDRESS=",
      "RAIDEN_KEYSTORE_PASSWORD=",
      "RAIDEN_ETH_RPC_ENDPOINT=http://goerli-geth.dappnode:8545",
      "RAIDEN_NETWORK_ID=goerli",
      "EXTRA_OPTS=--disable-debug-logfile"
    ],
    keywords: ["Raiden", "Ethereum", "Testnet", "Goerli"]
  },
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

const manifestBitcoin = {
  name: "bitcoin.dnp.dappnode.eth",
  version: "0.1.3",
  description:
    "The Bitcoin Core daemon (0.18.0). Bitcoind is a program that implements the Bitcoin protocol for remote procedure call (RPC) use.",
  avatar: "/ipfs/QmNrfF93ppvjDGeabQH8H8eeCDLci2F8fptkvj94WN78pt",
  type: "service",
  image: {
    path: "bitcoin.dnp.dappnode.eth_0.1.3.tar.xz",
    hash: "/ipfs/QmYjngn4Tr21rcBqet9pHiZ7HPqBszwdpWvvdVuipYk4Sy",
    size: 9349894,
    ports: ["8333:8333"],
    volumes: ["bitcoin_data:/root/.bitcoin"],
    environment: [
      "BTC_RPCUSER=dappnode",
      "BTC_RPCPASSWORD=dappnode",
      "BTC_TXINDEX=1",
      "BTC_PRUNE=0"
    ]
  },
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

/**
 * Actual mockState
 * ================
 */

export const mockState = {
  /* chainData */
  [chainDataMountPoint]: [],

  /* connectionStatus */
  [connectionStatusMountPoint]: {
    isOpen: true,
    session: {}
  },

  /* coreUpdate */
  [coreUpdateMountPoint]: {
    coreDeps: {
      "admin.dnp.dappnode.eth": { version: "0.2.1" },
      "vpn.dnp.dappnode.eth": { version: "0.2.1" }
    },
    coreManifest: {
      version: "0.2.1",
      changelog:
        "Major improvements to the 0.2 version https://github.com/dappnode/DAppNode/wiki/DAppNode-Migration-guide-to-OpenVPN",
      warnings: {
        onInstall: "Your VPN will be restarted and you may lose connection"
      }
    }
  },

  /* dappnodeStatus */
  [dappnodeStatusMountPoint]: {
    params: {},
    stats: {},
    diagnose: {},
    pingReturns: {},
    ipfsConnectionStatus: {},
    wifiStatus: { running: true },
    passwordIsInsecure: true,
    autoUpdateSettings: {
      "my-packages": {
        "ln.dnp.dappnode.eth": true
      },
      "system-packages": true
    }
  },

  /* devices */
  [devicesMountPoint]: [
    { id: "test-name", admin: true },
    { id: "other-user", admin: false, url: "link-to-otp/?id=617824#hdfuisf" }
  ],

  /* dnpDirectory */
  [dnpDirectoryMountPoint]: {
    "bitcoin.dnp.dappnode.eth": {
      name: "bitcoin.dnp.dappnode.eth",
      whitelisted: true,
      manifest: manifestBitcoin,
      avatar: "https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png"
    },
    "ln.dnp.dappnode.eth": {
      name: "ln.dnp.dappnode.eth",
      whitelisted: true,
      isFeatured: true,
      manifest: manifestLn,
      avatar: "https://i.ibb.co/Twjv2f3/ln.png"
    },
    "raiden.dnp.dappnode.eth": {
      name: "raiden.dnp.dappnode.eth",
      whitelisted: true,
      manifest: manifestRaiden,
      avatar: "https://i.ibb.co/Y0YzyrG/raiden300-min.png"
    },
    "raiden-testnet.dnp.dappnode.eth": {
      name: "raiden-testnet.dnp.dappnode.eth",
      whitelisted: true,
      manifest: manifestRaidenTestnet,
      avatar: "https://i.ibb.co/2ynnctD/raiden-testnet-300.png"
    },
    "vipnode.dnp.dappnode.eth": {
      name: "vipnode.dnp.dappnode.eth",
      whitelisted: true,
      manifest: manifestVipnode,
      avatar:
        "https://i.ibb.co/ypjjMVJ/Qmen3sr-ZXEHnc-MM2-RPsg-VKk-Pbk-JPTMN9-SNFVEAQQY4a7-Nf.png"
    }
  },

  /* dnpInstalled */
  [dnpInstalledMountPoint]: [
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
      name: "ln.dnp.dappnode.eth",
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
      manifest: manifestLn,
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
    }
  ],

  /* isInstallingLogs */
  [isInstallingLogsMountPoint]: {
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
    }
  },

  /* loadingStatus */
  [loadingStatusMountPoint]: {},

  /* notifications */
  [notificationsMountPoint]: {
    "diskSpaceRanOut-stoppedPackages": {
      id: "diskSpaceRanOut-stoppedPackages",
      type: "danger",
      title: "Disk space ran out, stopped packages",
      body: "Available disk space gone wrong ".repeat(10),
      timestamp: 153834824,
      viewed: false,
      fromDappmanager: true
    }
  },

  /* userActionLogs */
  [userActionLogsMountPoint]: [
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
  ]
};
