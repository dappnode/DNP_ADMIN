import filterDirectory from "../../../pages/installer/helpers/filterDirectory";

describe("pages > installer > helpers", () => {
  describe("filterDirectory", () => {
    const dnp1Name = "dnp1.dnp.dappnode.eth";
    const dnp2Name = "dnp2.dnp.dappnode.eth";
    const dnp1 = {
      name: dnp1Name,
      version: "0.1.0",
      manifest: { name: dnp1Name, type: "library" }
    };
    const dnp2 = {
      name: dnp2Name,
      version: "0.1.0",
      manifest: { name: dnp2Name, type: "service" }
    };
    const directory = [dnp1, dnp2];

    it("Should filter directory by input", () => {
      const query = dnp1Name;
      const selectedTypes = {};
      expect(filterDirectory({ directory, query, selectedTypes })).toEqual([
        dnp1
      ]);
    });

    it("Should filter directory by type", () => {
      const query = "";
      const selectedTypes = { library: false, service: true };
      expect(filterDirectory({ directory, query, selectedTypes })).toEqual([
        dnp2
      ]);
    });
  });
});
