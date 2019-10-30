import {
  formDataToUserSettings,
  userSettingsToFormData
} from "pages/installer/parsers/formDataParser";
import { SetupWizardFormDataReturn } from "pages/installer/types";
import { SetupSchemaAllDnps, UserSettingsAllDnps } from "types";
import deepmerge from "deepmerge";

describe("formDataToUserSettings", () => {
  const dnpName = "lightning-network.dnp.dappnode.eth";
  const depName = "bitcoin.dnp.dappnode.eth";

  const setupSchema: SetupSchemaAllDnps = {
    [dnpName]: {
      type: "object",
      properties: {
        payoutAddress: {
          // @ts-ignore
          target: {
            type: "environment",
            name: "PAYOUT_ADDRESS"
          },
          type: "string",
          title: "Payout address"
        },
        unfilledProp: {
          // @ts-ignore
          target: {
            type: "environment",
            name: "UNFILLED_PROP"
          },
          type: "string",
          title: "Payout address"
        },
        configFile: {
          // @ts-ignore
          target: {
            type: "fileUpload",
            path: "/usr/src/app/config.json"
          },
          type: "string",
          format: "data-url",
          title: "Config file"
        }
      }
    },
    [depName]: {
      type: "object",
      properties: {
        uiPort: {
          // @ts-ignore
          target: {
            type: "portMapping",
            containerPort: "8080"
          },
          type: "string",
          title: "UI port"
        },
        p2pPort: {
          // @ts-ignore
          target: {
            type: "portMapping",
            containerPort: "5555/udp"
          },
          type: "string",
          title: "P2P port"
        },
        dataVolume: {
          // @ts-ignore
          target: {
            type: "namedVolumePath",
            volumeName: "bitcoin_data"
          },
          type: "string",
          title: "Custom volume path"
        },
        txIndex: {
          // @ts-ignore
          target: {
            type: "environment",
            name: "BTC_TXINDEX"
          },
          type: "string",
          title: "TX index",
          description: "Choose the TX index",
          default: "1",
          enum: ["0", "1", "2"]
        }
      }
    }
  };

  const userSettings: UserSettingsAllDnps = {
    [dnpName]: {
      environment: {
        PAYOUT_ADDRESS: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
      },
      fileUpload: {
        "/usr/src/app/config.json":
          "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D"
      }
    },
    [depName]: {
      portMapping: {
        "8080": "",
        "5555/udp": "5800"
      },
      namedVolumePath: {
        bitcoin_data: ""
      },
      environment: {
        BTC_TXINDEX: "2"
      }
    }
  };

  const formData: SetupWizardFormDataReturn = {
    [dnpName]: {
      payoutAddress: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      configFile: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D"
    },
    [depName]: {
      uiPort: "",
      p2pPort: "5800",
      dataVolume: "",
      txIndex: "2"
    }
  };

  it("Should convert form data to userSettings", () => {
    expect(formDataToUserSettings(formData, setupSchema)).toEqual(userSettings);
  });

  it("Should convert form data to userSettings with unknown props", () => {
    const formDataUnknownProps: SetupWizardFormDataReturn = {
      [dnpName]: {
        ...formData[dnpName],
        unknownProp: "UNKNOWN"
      }
    };

    const formDataWithUnknownProps: SetupWizardFormDataReturn = deepmerge(
      formData,
      formDataUnknownProps
    );

    expect(
      formDataToUserSettings(formDataWithUnknownProps, setupSchema)
    ).toEqual(userSettings);
  });

  it("Should convert userSettings to form data", () => {
    expect(userSettingsToFormData(userSettings, setupSchema)).toEqual(formData);
  });

  it("Should convert userSettings to form data with unknown props", () => {
    const userSettingsUnknownProps: UserSettingsAllDnps = {
      "unknown.dnp.eth": {
        environment: {
          unknownPropFromUnknownDnp: "?"
        }
      },
      [dnpName]: {
        ...formData[dnpName],
        environment: {
          unknownProp: "UNKNOWN"
        }
      }
    };

    const userSettingsWithUnknownProps: UserSettingsAllDnps = deepmerge(
      userSettings,
      userSettingsUnknownProps
    );

    expect(
      userSettingsToFormData(userSettingsWithUnknownProps, setupSchema)
    ).toEqual(formData);
  });
});
