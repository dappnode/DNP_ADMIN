import { prettyVolumeName } from "../../utils/format";

describe("utils > format", () => {
  describe("prettyVolumeName", () => {
    const dnpName = "vipnode.dnp.dappnode.eth";
    it("Prettify own volume name", () => {
      expect(
        prettyVolumeName("dncore_ethchaindnpdappnodeeth_data", dnpName)
      ).toEqual("Ethchain - Data");
    });

    it("Prettify other volume name", () => {
      expect(prettyVolumeName("vipnodednpdappnodeeth_data", dnpName)).toEqual(
        "Data"
      );
    });

    it("Prettify wierd volume name", () => {
      const wierdName = "714673659786948756293876598768234";
      expect(prettyVolumeName(wierdName, dnpName)).toEqual(wierdName);
    });
  });
});
