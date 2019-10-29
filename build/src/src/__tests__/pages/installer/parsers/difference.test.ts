import {
  formDataToUserSettings,
  userSettingsToFormData
} from "../../../../pages/installer/parsers/formDataParser";
import { SetupWizardFormDataReturn } from "pages/installer/types";
import { UserSettingsAllDnps } from "types";
import deepmerge from "deepmerge";
import difference from "pages/installer/parsers/difference";

describe("difference", () => {
  const dnpName = "lightning-network.dnp.dappnode.eth";
  const depName = "bitcoin.dnp.dappnode.eth";

  const userSettings: UserSettingsAllDnps = {
    [dnpName]: {
      environment: {
        PAYOUT_ADDRESS: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
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

  const additionalUserSettings: UserSettingsAllDnps = {
    [dnpName]: {
      fileUpload: {
        "/usr/src/app/config.json":
          "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D"
      }
    },
    [depName]: {
      portMapping: {
        "5555/udp": ""
      },
      namedVolumePath: {
        bitcoin_data: "/dev1/custom-path/"
      }
    }
  };

  it("Should return the difference of an object with new keys", () => {
    const newUserSettings = deepmerge(userSettings, additionalUserSettings);
    expect(difference(userSettings, newUserSettings)).toEqual(
      additionalUserSettings
    );
  });
});
