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
    ipfsConnectionStatus: {}
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
      manifest: { name: "bitcoin.dnp.dappnode.eth" },
      avatar: "https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png"
    },
    "ln.dnp.dappnode.eth": {
      name: "ln.dnp.dappnode.eth",
      whitelisted: true,
      manifest: { name: "ln.dnp.dappnode.eth", version: "0.1.0" }
    },
    "raiden.dnp.dappnode.eth": {
      name: "raiden.dnp.dappnode.eth",
      whitelisted: true,
      manifest: {
        name: "raiden.dnp.dappnode.eth",
        description:
          "The Raiden Network is an off-chain scaling solution, enabling near-instant, low-fee and scalable payments. It’s complementary to the Ethereum blockchain and works with any ERC20 compatible token. The Raiden project is work in progress. Its goal is to research state channel technology, define protocols and develop reference implementations.",
        version: "0.1.0",
        disclaimer: {
          message:
            "This software is experimental, presented 'as is' and inherently carries risks. By installing it, you acknowledge that DAppNode Association has done its best to mitigate these risks and accept to waive any liability or responsibility for DAppNode in case of any shortage, discrepancy, damage, loss or destruction of any digital asset managed within this DAppNode package.\n\nThis package stores private keys, which will be stored in your DAppNode. Neither DAppNode Association nor the developers of this software can have access to your private key, nor help you recover it if you lose it. \n\nYou are solely responsible for keeping your private keys and password safe and to perform secure backups, as well as to restrict access to your computer and other equipment. To the extent permitted by applicable law, you agree to be responsible for all activities that have been conducted from your account. You must take all necessary steps to ensure that your private key, password, and recovery phrase remain confidential and secured. \n\nThis is an Alpha version of experimental open source software released as a test version under an MIT license and may contain errors and/or bugs. No guarantee or representations whatsoever is made regarding its suitability (or its use) for any purpose or regarding its compliance with any applicable laws and regulations. Use of the software is at your own risk and discretion and by using the software you acknowledge that you have read this disclaimer, understand its contents, assume all risk related thereto and hereby release, waive, discharge and covenant not to sue Brainbot Labs Establishment or any officers, employees or affiliates from and for any direct or indirect liability resulting from the use of the software as permissible by applicable laws and regulations.\n\nPrivacy Warning: Please be aware, that by using the Raiden Client, \namong others, your Ethereum address, channels, channel deposits, settlements and the Ethereum address of your channel counterparty will be stored on the Ethereum chain, i.e. on servers of Ethereum node operators and ergo are to a certain extent publicly available. The same might also be stored on systems of parties running Raiden nodes connected to the same token network. Data present in the Ethereum chain is very unlikely to be able to be changed, removed or deleted from the public arena.\n\nAlso be aware, that data on individual Raiden token transfers will be made available via the Matrix protocol to the recipient, intermediating nodes of a specific transfer as well as to the Matrix server operators."
        }
      }
    },
    "vipnode.dnp.dappnode.eth": {
      name: "vipnode.dnp.dappnode.eth",
      whitelisted: true,
      manifest: {
        name: "vipnode.dnp.dappnode.eth",
        version: "0.0.1",
        description:
          "https://vipnode.org - Economic incentive for running Ethereum full nodes. The goal is to allow the Ethereum network to remain decentralized by creating a financial marketplace for more people to run full nodes and serve native light clients.",
        avatar:
          "https://ipfs.io/ipfs/Qmen3srZXEHncMM2RPsgVKkPbkJPTMN9SNFVEAQQY4a7Nf",
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
      },
      avatar:
        "https://ipfs.io/ipfs/Qmen3srZXEHncMM2RPsgVKkPbkJPTMN9SNFVEAQQY4a7Nf"
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
      name: "ln.dnp.dappnode.eth",
      isDnp: true,
      version: "0.1.0",
      state: "running"
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
