import { rootPath, mountPoint } from "../../pages/installer";
import * as s from "../../pages/installer/selectors";

describe("getUserSet variables (envs / ports / vols", () => {
  describe("getEnvs", () => {
    it("Should merge ENVs from all sources in the ln.dnp.dappnode.eth case", () => {
      const state = {
        // External router state to pick up the query ID
        router: {
          location: {
            pathname: `${rootPath}/ln.dnp.dappnode.eth`
          }
        },
        // Directory
        directory: {
          "ln.dnp.dappnode.eth": {
            name: "ln.dnp.dappnode.eth",
            manifest: {
              image: {
                environment: ["ENV_NAME1=ENV_VALUE1", "ENV_NAME2=ENV_VALUE1"]
              }
            },
            requestResult: {
              success: {
                "bitcoin.dnp.dappnode.eth": "0.1.1"
              }
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
        installedPackages: [
          {
            name: "bitcoin.dnp.dappnode.eth",
            envs: {
              ENV_NAME2: "set_on_installation"
            }
          }
        ],
        [mountPoint]: {
          packageData: "packages",
          userSetEnvs: {
            "ln.dnp.dappnode.eth": {
              ENV_NAME2: "user_set"
            }
          }
        }
      };
      expect(s.getEnvs(state)).toEqual({
        "ln.dnp.dappnode.eth": {
          ENV_NAME1: "ENV_VALUE1",
          ENV_NAME2: "user_set"
        },
        "bitcoin.dnp.dappnode.eth": {
          ENV_NAME1: "ENV_VALUE1",
          ENV_NAME2: "set_on_installation"
        }
      });
    });

    it("Should merge ENVs from all sources in an IPFS case: /ipfs/QmPi32MzYBMWgsqVaWeLB728rJqyZwcZBwwoJjd8dTyqte case", () => {
      const state = {
        // External router state to pick up the query ID
        router: {
          location: {
            pathname: `${rootPath}/ipfs:QmPi32MzYBMWgsqVaWeLB728rJqyZwcZBwwoJjd8dTyqte`
          }
        },
        // Directory
        directory: {
          "/ipfs/QmPi32MzYBMWgsqVaWeLB728rJqyZwcZBwwoJjd8dTyqte": {
            name: "ethchain.dnp.dappnode.eth",
            manifest: {
              image: {
                environment: ["ENV_NAME1=ENV_VALUE1", "ENV_NAME2=ENV_VALUE1"]
              }
            },
            requestResult: {
              success: {
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
        installedPackages: [
          {
            name: "dep.dnp.dappnode.eth",
            envs: {
              ENV_NAME2: "set_on_installation"
            }
          }
        ],
        [mountPoint]: {
          packageData: "packages",
          userSetEnvs: {
            "ethchain.dnp.dappnode.eth": {
              ENV_NAME2: "user_set"
            }
          }
        }
      };
      expect(s.getEnvs(state)).toEqual({
        "ethchain.dnp.dappnode.eth": {
          ENV_NAME1: "ENV_VALUE1",
          ENV_NAME2: "user_set"
        },
        "dep.dnp.dappnode.eth": {
          ENV_NAME1: "ENV_VALUE1",
          ENV_NAME2: "set_on_installation"
        }
      });
    });
  });

  describe("getPorts", () => {
    it("Should merge ports from all sources in the ln.dnp.dappnode.eth case", () => {
      const state = {
        // External router state to pick up the query ID
        router: {
          location: {
            pathname: `${rootPath}/ln.dnp.dappnode.eth`
          }
        },
        // Directory
        directory: {
          "ln.dnp.dappnode.eth": {
            name: "ln.dnp.dappnode.eth",
            manifest: {
              image: {
                ports: ["30303", "30304:30304/udp"]
              }
            },
            requestResult: {
              success: {
                "bitcoin.dnp.dappnode.eth": "0.1.1"
              }
            }
          },
          "bitcoin.dnp.dappnode.eth": {
            name: "bitcoin.dnp.dappnode.eth",
            manifest: {
              image: {
                ports: ["8333:8333"]
              }
            }
          }
        },
        [mountPoint]: {
          packageData: "packages",
          userSetPorts: {
            "ln.dnp.dappnode.eth": {
              "30304/udp": "35354"
            }
          }
        }
      };
      expect(s.getPorts(state)).toEqual({
        "bitcoin.dnp.dappnode.eth": {
          "8333:8333": { container: "8333", host: "8333", type: undefined }
        },
        "ln.dnp.dappnode.eth": {
          "30303": { container: undefined, host: "30303", type: undefined },
          "30304/udp": "35354",
          "30304:30304/udp": { container: "30304", host: "30304", type: "udp" }
        }
      });
    });
  });

  describe("getVols", () => {
    it("Should merge vols from all sources in the ln.dnp.dappnode.eth case", () => {
      const state = {
        // External router state to pick up the query ID
        router: {
          location: {
            pathname: `${rootPath}/ln.dnp.dappnode.eth`
          }
        },
        // Directory
        directory: {
          "ln.dnp.dappnode.eth": {
            name: "ln.dnp.dappnode.eth",
            manifest: {
              image: {
                volumes: ["ln_data:/data/.var/chain"]
              }
            },
            requestResult: {
              success: {
                "bitcoin.dnp.dappnode.eth": "0.1.1"
              }
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
        [mountPoint]: {
          packageData: "packages",
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
      expect(s.getVols(state)).toEqual({
        "ln.dnp.dappnode.eth": {
          "ln_data:/data/.var/chain": {
            container: "/data/.var/chain",
            host: "ln_data2"
          }
        },
        "bitcoin.dnp.dappnode.eth": {
          "/usr/src/config:/data/.chain/config:ro": {
            host: "/usr/src/config",
            container: "/data/.chain/config",
            accessMode: "ro"
          },
          "bitcoin_data:/data/.chain/var": {
            container: "/data/.chain/var",
            host: "bitcoin_data"
          }
        }
      });
    });
  });

  describe("getUserSetPortsStringified", () => {
    it("Should return the userSetPorts in a format compatible with the installer", () => {
      const state = {
        [mountPoint]: {
          userSetPorts: {
            "ln.dnp.dappnode.eth": {
              "30303:30303/udp": {
                container: "30303",
                host: null,
                type: "udp"
              },
              "30304": {
                container: "30304",
                host: "8001"
              }
            }
          }
        }
      };
      expect(s.getUserSetPortsStringified(state)).toEqual({
        "ln.dnp.dappnode.eth": {
          "30303:30303/udp": "30303/udp",
          "30304": "8001:30304"
        }
      });
    });
  });

  describe("getUserSetVolsStringified", () => {
    it("Should return the userSetVols in a format compatible with the installer", () => {
      const state = {
        [mountPoint]: {
          userSetVols: {
            "ln.dnp.dappnode.eth": {
              "ln_data:/data/.var/chain": {
                container: "/data/.var/chain",
                host: "ln_data2"
              },
              "/usr/src/config:/data/.var/config:ro": {
                container: "/data/.var/config",
                host: "/usr/src/dappnode/config",
                accessMode: "ro"
              }
            }
          }
        }
      };
      expect(s.getUserSetVolsStringified(state)).toEqual({
        "ln.dnp.dappnode.eth": {
          "ln_data:/data/.var/chain": "ln_data2:/data/.var/chain",
          "/usr/src/config:/data/.var/config:ro":
            "/usr/src/dappnode/config:/data/.var/config:ro"
        }
      });
    });
  });
});
