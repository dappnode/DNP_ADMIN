import { mountPoint } from "../../../pages/installer/data";
import { mountPoint as dnpDirectoryMountPoint } from "../../../services/dnpDirectory/data";
import { mountPoint as dnpInstalledMountPoint } from "../../../services/dnpInstalled/data";
import * as s from "../../../pages/installer/selectors";

describe("pages > installer > selectors", () => {
  describe("getEnvs", () => {
    it("Should merge ENVs from all sources in the ln.dnp.dappnode.eth case", () => {
      const state = {
        // Directory
        [dnpDirectoryMountPoint]: {
          "ln.dnp.dappnode.eth": {
            name: "ln.dnp.dappnode.eth",
            manifest: {
              image: {
                environment: ["ENV_NAME1=ENV_VALUE1", "ENV_NAME2=ENV_VALUE1"]
              }
            },
            requestResult: {
              dnps: { "bitcoin.dnp.dappnode.eth": "0.1.1" }
            }
          },
          "bitcoin.dnp.dappnode.eth": {
            name: "bitcoin.dnp.dappnode.eth",
            manifest: {
              image: {
                environment: ["ENV_NAME1=ENV_VALUE1", "ENV_NAME2=ENV_VALUE1"]
              }
            }
          }
        },
        [dnpInstalledMountPoint]: [
          {
            name: "bitcoin.dnp.dappnode.eth",
            envs: {
              ENV_NAME2: "set_on_installation"
            }
          }
        ],
        [mountPoint]: {
          userSetEnvs: {
            "ln.dnp.dappnode.eth": {
              ENV_NAME2: {
                name: "ENV_NAME2",
                value: "user_set"
              }
            }
          }
        }
      };
      const ownProps = {
        match: { params: { id: "ln.dnp.dappnode.eth" } }
      };
      expect(s.getEnvs(state, ownProps)).toEqual({
        "ln.dnp.dappnode.eth": {
          ENV_NAME1: {
            name: "ENV_NAME1",
            value: "ENV_VALUE1",
            index: 0
          },
          ENV_NAME2: {
            name: "ENV_NAME2",
            value: "user_set",
            index: 1
          }
        },
        "bitcoin.dnp.dappnode.eth": {
          ENV_NAME1: {
            name: "ENV_NAME1",
            value: "ENV_VALUE1",
            index: 0
          },
          ENV_NAME2: {
            name: "ENV_NAME2",
            value: "set_on_installation",
            index: 1
          }
        }
      });
    });

    it("Should merge ENVs from all sources in an IPFS case: /ipfs/QmPi32MzYBMWgsqVaWeLB728rJqyZwcZBwwoJjd8dTyqte case", () => {
      const state = {
        // Directory
        [dnpDirectoryMountPoint]: {
          "/ipfs/QmPi32MzYBMWgsqVaWeLB728rJqyZwcZBwwoJjd8dTyqte": {
            name: "ethchain.dnp.dappnode.eth",
            manifest: {
              image: {
                environment: ["ENV_NAME1=ENV_VALUE1", "ENV_NAME2=ENV_VALUE1"]
              }
            },
            requestResult: {
              dnps: {
                "ethchain.dnp.dappnode.eth":
                  "/ipfs/QmPi32MzYBMWgsqVaWeLB728rJqyZwcZBwwoJjd8dTyqte",
                "dep.dnp.dappnode.eth":
                  "/ipfs/QmAAA2MzYBMWgsqVaWeLB728rJqyZwcZBwwoJjd8dTyqte"
              }
            }
          },
          "dep.dnp.dappnode.eth@/ipfs/QmAAA2MzYBMWgsqVaWeLB728rJqyZwcZBwwoJjd8dTyqte": {
            name: "dep.dnp.dappnode.eth",
            manifest: {
              image: {
                environment: ["ENV_NAME1=ENV_VALUE1", "ENV_NAME2=ENV_VALUE1"]
              }
            }
          }
        },
        [dnpInstalledMountPoint]: [
          {
            name: "dep.dnp.dappnode.eth",
            envs: { ENV_NAME2: "set_on_installation" }
          }
        ],
        [mountPoint]: {
          userSetEnvs: {
            "ethchain.dnp.dappnode.eth": {
              ENV_NAME2: {
                name: "ENV_NAME2",
                value: "user_set"
              }
            }
          }
        }
      };
      const ownProps = {
        match: {
          params: {
            id: "%2Fipfs%2FQmPi32MzYBMWgsqVaWeLB728rJqyZwcZBwwoJjd8dTyqte"
          }
        }
      };
      expect(s.getEnvs(state, ownProps)).toEqual({
        "ethchain.dnp.dappnode.eth": {
          ENV_NAME1: {
            name: "ENV_NAME1",
            value: "ENV_VALUE1",
            index: 0
          },
          ENV_NAME2: {
            name: "ENV_NAME2",
            value: "user_set",
            index: 1
          }
        },
        "dep.dnp.dappnode.eth": {
          ENV_NAME1: {
            name: "ENV_NAME1",
            value: "ENV_VALUE1",
            index: 0
          },
          ENV_NAME2: {
            name: "ENV_NAME2",
            value: "set_on_installation",
            index: 1
          }
        }
      });
    });
  });

  describe("getPorts", () => {
    it("Should merge ports from all sources in the ln.dnp.dappnode.eth case", () => {
      const state = {
        // Directory
        [dnpDirectoryMountPoint]: {
          "ln.dnp.dappnode.eth": {
            name: "ln.dnp.dappnode.eth",
            manifest: {
              image: { ports: ["30303", "30304:30304/udp"] }
            },
            requestResult: {
              dnps: { "bitcoin.dnp.dappnode.eth": "0.1.1" }
            }
          },
          "bitcoin.dnp.dappnode.eth": {
            name: "bitcoin.dnp.dappnode.eth",
            manifest: {
              image: { ports: ["8333:8333"] }
            }
          }
        },
        [dnpInstalledMountPoint]: {},
        [mountPoint]: {
          userSetPorts: {
            "ln.dnp.dappnode.eth": { "30304/udp": "35354" }
          }
        }
      };
      const ownProps = {
        match: {
          params: { id: "ln.dnp.dappnode.eth" }
        }
      };
      expect(s.getPorts(state, ownProps)).toEqual({
        "bitcoin.dnp.dappnode.eth": {
          "8333:8333": {
            container: "8333",
            host: "8333",
            type: undefined,
            index: 0
          }
        },
        "ln.dnp.dappnode.eth": {
          "30303": { container: "30303", type: undefined, index: 0 },
          "30304/udp": "35354",
          "30304:30304/udp": {
            container: "30304",
            host: "30304",
            type: "udp",
            index: 1
          }
        }
      });
    });
  });

  describe("getVols", () => {
    it("Should merge vols from all sources in the ln.dnp.dappnode.eth case", () => {
      const state = {
        // Directory
        [dnpDirectoryMountPoint]: {
          "ln.dnp.dappnode.eth": {
            name: "ln.dnp.dappnode.eth",
            manifest: {
              image: { volumes: ["ln_data:/data/.var/chain"] }
            },
            requestResult: {
              dnps: { "bitcoin.dnp.dappnode.eth": "0.1.1" }
            }
          },
          "bitcoin.dnp.dappnode.eth": {
            name: "bitcoin.dnp.dappnode.eth",
            manifest: {
              image: {
                volumes: [
                  "bitcoin_data:/data/.chain/var",
                  "/usr/src/config:/data/.chain/config:ro"
                ]
              }
            }
          }
        },
        [dnpInstalledMountPoint]: [],
        [mountPoint]: {
          userSetVols: {
            "ln.dnp.dappnode.eth": {
              "ln_data:/data/.var/chain": {
                container: "/data/.var/chain",
                host: "ln_data2"
              }
            }
          }
        }
      };
      const ownProps = {
        match: { params: { id: "ln.dnp.dappnode.eth" } }
      };
      expect(s.getVols(state, ownProps)).toEqual({
        "ln.dnp.dappnode.eth": {
          "ln_data:/data/.var/chain": {
            container: "/data/.var/chain",
            host: "ln_data2",
            index: 0
          }
        },
        "bitcoin.dnp.dappnode.eth": {
          "bitcoin_data:/data/.chain/var": {
            container: "/data/.chain/var",
            host: "bitcoin_data",
            index: 0
          },
          "/usr/src/config:/data/.chain/config:ro": {
            host: "/usr/src/config",
            container: "/data/.chain/config",
            accessMode: "ro",
            index: 1
          }
        }
      });
    });
  });

  describe("getUserSetFormatted", () => {
    it("Should return the userSetPorts in a format compatible with the installer", () => {
      const state = {
        [mountPoint]: {
          userSetEnvs: {
            "ln.dnp.dappnode.eth": {
              FOO: {
                name: "FOO",
                value: "BAR",
                index: 0
              }
            }
          },
          userSetPorts: {
            "ln.dnp.dappnode.eth": {
              "30303:30303/udp": {
                container: "30303",
                host: null,
                type: "udp",
                index: 0
              },
              "30304": {
                container: "30304",
                host: "8001",
                index: 1
              }
            }
          },
          userSetVols: {
            "ln.dnp.dappnode.eth": {
              "ln_data:/data/.var/chain": {
                container: "/data/.var/chain",
                host: "ln_data2",
                index: 0
              },
              "/usr/src/config:/data/.var/config:ro": {
                container: "/data/.var/config",
                host: "/usr/src/dappnode/config",
                accessMode: "ro",
                index: 1
              }
            }
          }
        }
      };

      expect(s.getUserSetFormatted(state)).toEqual({
        userSetEnvs: {
          "ln.dnp.dappnode.eth": { FOO: "BAR" }
        },
        userSetPorts: {
          "ln.dnp.dappnode.eth": {
            "30303:30303/udp": "30303/udp",
            "30304": "8001:30304"
          }
        },
        userSetVols: {
          "ln.dnp.dappnode.eth": {
            "ln_data:/data/.var/chain": "ln_data2:/data/.var/chain",
            "/usr/src/config:/data/.var/config:ro":
              "/usr/src/dappnode/config:/data/.var/config:ro"
          }
        }
      });
    });
  });

  describe("getHideCardHeaders", () => {
    it("Should hide the headers", () => {
      const name = "ln.dnp.dappnode.eth";
      const state = {
        [mountPoint]: {
          userSetEnvs: { [name]: { FOO: "BAR" } },
          userSetPorts: { [name]: { FOO: "BAR" } },
          userSetVols: { [name]: { FOO: "BAR" } }
        },
        [dnpDirectoryMountPoint]: { [name]: { name } },
        [dnpInstalledMountPoint]: []
      };
      const ownProps = { match: { params: { id: name } } };
      expect(s.getHideCardHeaders(state, ownProps)).toEqual(true);
    });

    it("Should NOT hide the headers", () => {
      const name = "ln.dnp.dappnode.eth";
      const otherName = "bitcoin.dnp.dappnode.eth";
      const state = {
        [mountPoint]: {
          userSetEnvs: {
            [name]: { FOO: "BAR" },
            [otherName]: { FOO: "BAR" }
          },
          userSetPorts: { [name]: { FOO: "BAR" } },
          userSetVols: { [name]: { FOO: "BAR" } }
        },
        [dnpDirectoryMountPoint]: { [name]: { name } },
        [dnpInstalledMountPoint]: []
      };
      const ownProps = { match: { params: { id: name } } };
      expect(s.getHideCardHeaders(state, ownProps)).toEqual(false);
    });
  });

  describe("getDnpDirectoryWithTagsNonCores", () => {
    const dnp1 = "dnp1.dnp.dappnode.eth";
    const dnp2 = "dnp2.dnp.dappnode.eth";
    const dnp3 = "dnp3.dnp.dappnode.eth";
    const dnp4 = "core.dnp.dappnode.eth";
    const dnpDirectory = {
      [dnp1]: {
        name: dnp1,
        version: "0.1.0",
        manifest: { name: dnp1 },
        whitelisted: true
      },
      [dnp2]: {
        name: dnp2,
        version: "0.2.0",
        manifest: { name: dnp2 },
        whitelisted: true
      },
      [dnp3]: {
        name: dnp3,
        version: "0.1.0",
        manifest: { name: dnp3 },
        whitelisted: true
      },
      [dnp4]: {
        name: dnp4,
        version: "0.1.0",
        manifest: { name: dnp3, type: "dncore" },
        whitelisted: true
      }
    };
    const dnpInstalled = [
      { name: dnp1, version: "0.1.0" },
      { name: dnp2, version: "0.1.0" },
      { name: dnp3, version: "0.2.0" }
    ];

    const byName = (a, b) => (a.name < b.name ? -1 : 1);

    it("Should add the installer tag properly", () => {
      const state = {
        [mountPoint]: {
          selectedTypes: {},
          input: ""
        },
        [dnpDirectoryMountPoint]: dnpDirectory,
        [dnpInstalledMountPoint]: dnpInstalled
      };
      expect(s.getDnpDirectoryWithTagsNonCores(state).sort(byName)).toEqual(
        [
          {
            name: dnp1,
            tag: "UPDATED",
            version: "0.1.0",
            manifest: { name: dnp1 },
            whitelisted: true
          },
          {
            name: dnp2,
            tag: "UPDATE",
            version: "0.2.0",
            manifest: { name: dnp2 },
            whitelisted: true
          },
          {
            name: dnp3,
            tag: "UPDATED",
            version: "0.1.0",
            manifest: { name: dnp3 },
            whitelisted: true
          }
        ].sort(byName)
      );
    });
  });
});
