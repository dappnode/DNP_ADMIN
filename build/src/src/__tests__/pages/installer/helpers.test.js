import filterDirectory from "../../../pages/installer/helpers/filterDirectory";

describe("pages > installer > helpers", () => {
  describe("filterDirectory", () => {
    const dnp1Name = "dnp1.dnp.dappnode.eth";
    const dnp2Name = "dnp2.dnp.dappnode.eth";
    const dnp1 = {
      name: dnp1Name,
      version: "0.1.0",
      manifest: { name: dnp1Name, categories: ["Blockchain"] }
    };
    const dnp2 = {
      name: dnp2Name,
      version: "0.1.0",
      manifest: { name: dnp2Name, categories: ["Storage"] }
    };
    const directory = [dnp1, dnp2];

    it("Should filter directory by input", () => {
      const query = dnp1Name;
      const selectedCategories = {};
      expect(filterDirectory({ directory, query, selectedCategories })).toEqual(
        [dnp1]
      );
    });

    it("Should filter directory by type", () => {
      const query = "";
      const selectedCategories = { Blockchain: false, Storage: true };
      expect(filterDirectory({ directory, query, selectedCategories })).toEqual(
        [dnp2]
      );
    });
  });
});
