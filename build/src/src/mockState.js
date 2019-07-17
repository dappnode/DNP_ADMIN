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
  name: "ln.dnp.dappnode.eth",
  version: "0.1.1",
  description:
    "The Lightning Network DAppNodePackage (lnd + lncli-web).The Lightning Network is a decentralized system for instant, high-volume micropayments that removes the risk of delegating custody of funds to trusted third parties.",
  avatar: "/ipfs/QmVrjV1ANxjYVqRJzycYKcCUAH8nU337UsMVir1CnZYNa8",
  type: "service",
  image: {
    path: "ln.dnp.dappnode.eth_0.1.1.tar.xz",
    hash: "/ipfs/QmdKxt6qoFbSSWGYqD44raEZzU62tcXnq3Hs33vCz4Zjqs",
    size: 51448118,
    ports: ["9735:9735"],
    volumes: ["lndconfig_data:/root/.lnd/"],
    environment: [
      "RPCUSER=dappnode",
      "RPCPASS=dappnode",
      "BITCOIND_HOST=my.bitcoin.dnp.dappnode.eth",
      "NETWORK=mainnet",
      "SET_SERVERHOST=0.0.0.0",
      "ALIAS=",
      "EXT_IP="
    ]
  },
  author:
    "DAppNode Association <admin@dappnode.io> (https://github.com/dappnode)",
  contributors: [
    "Abel Boldú (@vdo)",
    "Eduardo Antuña <eduadiez@gmail.com> (https://github.com/eduadiez)"
  ],
  keywords: ["bitcoin", "btc", "lightning network", "lnd"],
  homepage: {
    homepage:
      "https://github.com/dappnode/DAppNodePackage-LightningNetwork#readme"
  },
  repository: {
    type: "git",
    url: "git+https://github.com/dappnode/DAppNodePackage-LightningNetwork.git"
  },
  bugs: {
    url: "https://github.com/dappnode/DAppNodePackage-LightningNetwork/issues"
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
  description:
    "The Raiden Network is an off-chain scaling solution, enabling near-instant, low-fee and scalable payments.",
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
    featuredBackground: "linear-gradient(to right, #323131, #395353)",
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
      manifest: manifestLn,
      avatar: "https://i.ibb.co/Twjv2f3/ln.png"
    },
    "raiden.dnp.dappnode.eth": {
      name: "raiden.dnp.dappnode.eth",
      whitelisted: true,
      isFeatured: true,
      manifest: manifestRaiden,
      avatar:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAMAAABOo35HAAAAZlBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLZRe2AAAAIXRSTlMA/fkLaxLuy+UG3vQCGKVXhya7sJI1Yh+cLdVMRMR1fj1qholiAAAIGUlEQVR42u3d266rug4G4ADlDOVUCi30wPu/5Lra0r5YWnJiU43Efx5gauobJk0cxzHGfeyv4tdjM96Opsuj6PjliDvj8fiO8U+54rvPWmaesgha5PG4FvHvtGrPtcxjLSJoWXBVP+PKvNcy81r9SqvovNcy359xVZv/Wma//ojruQegZbZr9hOtfA5BK+mmn6wjxkcIWqa9j7/QmpYgtMzwzn+gtaZhaJm5L07HivokEK1yv0bnL+XLQLRM2r1OX8pvJpixvM9eRlSPcLTK+Xr2cisNR8sk3clL+msZkFbT3s6d6N8mpNF8n6dq7UFpmaQ/M7iyJSwtM58ZXHkZmFZzZnCtJrQxn5h27oLTKtfTUjf1EJyW2U4LruCmLWNMe1pe8GYCHO+TMjdxF6LW93XOp1gtIWq16ympiGgqQ9QqL6fsreu3CXLspxxoFHOYWsNan3E4loaplZ7xq1h/TKCjO2FrXe2has0nTFxTGqrWsuIX0WbiEl+fPr/BapWd+I/iNdgP0Ziv9I+i//Wm/zEe0j+K+SNgrUX6RzGYapF/neaFD62z3YSsdUORG30kvaxWyHO8MclbdrE1BK1Vymp9krC1LqKLrdkEHluSW581DVureUueku0m9NgS1BrT0LU+glpdE7pWL6f1bAPHMslNTusSOpZJV7HfxCL40DKt3K66Dx7LDGIZm3oJX+shdp/sFj6W+UpVQtSDAq1NqspmVYBl7jFCiz4+QiVbVw1YidACIlMRWukLs5bFckvm8DVbVGjtMrPWTQVWI5NnLlIVWjKTfPxRgWVakSqIZ6lDa5ZI19R3HVgyx2MvHVgyJSPFpkRrqLDnoY9Oot77oeVDFKhGqj9aQmsQyJu+EjUfIr+eubgbfIj0cm8tWBIHGM9ZC1Zzr7FB/OXSdErVaO3spWm1qcEy/DY2vR6shZ2RHxc9WhfusWvW6cFKJnbdQ6NHa+Me9rweerAMt5tureg7NDN3+XArFWkxq00jVd/hwgytWNN32DDLvqNe03eYMn8Qx0ERlmGGVr0bhBb9FkGDWYuep2k1hVbL2yFWsyYsw7yr0qnCGngJ5j5VpcVLPrxULR7Ml/UdxromLcM7Frs3qrB4hSKrrkmrZC1Mn4uu75DXtUbZpDWwpvh7qUtrxKRF3yBuHKy81RVZKWuDqGtZakpWvdama6VlZjTWsvgOOScXU6rsO+Qstby5JPb9C9+hLzP8JDRfsG6L+dIpKheqKEs4v4e+nB7mtdCEwbkRPHnyc5hLNYdZGKmHKvUFS6iDB6t8ufUFS+g2W3lnYH19wZJqtvoI/1w6P45okpm0GKl4T4ra8kPqrXrO5afRH6xjFPmnGOcWlUdYMgXpM6NEJPEH63hJ/GU591sHj7AyiWarKeMtqM0jrOMlsIbmtMe4+IQl8pwX49jCj4sp/5tncoFzYfc7BNHkFZbEJVxGn9zcKyyJB6oYM3zhF1bEzwI2jNdUSq+wJFoHdIEnaf5vIdmzP4Xdvbz04RlWxc4qze6nFrtnWMeNu0Nj/BzefcMquH9e9xcJordvWMeNuelhnIf13mHV3P2s+9rh5h3WsTJ/wd0PLa7+YUXM0Opc83/R6B8W90ab+9sNLw+xmFk499ZHuY9YvGY6s3NmufIRi1f+83DufFR4icXKArov4TMvsVgXHhbnu4e1n1ici0fu+53YT6zj4h5a7nVHkadYhXtoMRLLnmIxsoAKsdxrARViuT+5pBErds2I65vgj+NwrQXUt3Q4jiP6YlFKxnLNmKjb7nCygO5nYT5jOeaX0u7iOO4+Y8VO//umdB4+Y/lSQPw3sOI3cMhYR5VAh4wV99AhY0XFAh4q1hHfwEPG0vNSnASWnkcIBbAEagEVYR0ILQusYoMQGeuYGhCRsYoORGQsb5p5/AWsKLvDiBxZyrrbM7FqhBYdS9XDemys+AIlMpayt3GYWAdCywIrR6qGjnW8cdJDx3oitOhY6hr6srAKhBYd6+gRWnSsGqFFx+JfNteEdSC0LLCuCC2Lp6tmYNGxkGC2eRRtB5bFne8EWBYPAgCLPp4JsEJrkPk3sKIiBRZ9fIBFD62sBVZgnZv+ClY2ACuwPld/BSubgWXRMhpYFqG1A8viJRNgWYRWB6zA2vP9FazsAixkAU/Byt7AsuiT2QKL3gvlAyyL0BqARe9J1APLIrQewAqs2f1fwXp+gWURWg2w6G22d2DRs4AKawHdnwYtdmDRx5oCi76f3oBlcSyWAos+x2/Aog9tl81ZWLzXQbRhvVpgWYRWCSz6froFlkWZaQks+qanBRZ9aLpszsaqW2BZZAFLYNE3PQuwLFI1DbDoYwCWxX4aWBZjBhbKTE/BOjZgWZQ+NMCijzuwLFI1KbDoyYcHsMg/h10CLOJp60fJGl4Aa9y05B34+ayPnmJcLta4I1NKrVp+q+pSzcJ67bq6vTKw4o+25ufuWPmuromwK1bcK7zs5Ij1VHmt3AkrXnW2O3LBqrQ+imWPVV/VdtGy7hhSKe78Z4lVT5qbs9k1G6t0v1hkg5VpfwrLAuup/iEsMlZ2xTNYVKwnXiqiYmVX9M6nYuUXvFJExKpXhBUVK7+jaz4RK17xHAMV63lPYUTEwmxFxqo6hBUVax3wljsRq0BYkbGuC9ahRKysw9qKijUtmK2IWDWW7GSsCXkrKlaNBAMZC0+3k7EyvK5NxYpGJBioWAVe1qZixeMXGESsCq9qU7HiEU+IUrGqHgkGIlY0bWAgYlWfFgq00dwCCKt/AFuFKYDem0BZAAAAAElFTkSuQmCC"
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
      ports: [],
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
