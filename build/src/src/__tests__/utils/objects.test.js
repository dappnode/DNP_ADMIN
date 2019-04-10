import { arrayToObj } from "../../utils/objects";

describe("utils > objects", () => {
  describe("arrayToObj", () => {
    it("Convert and array to object by passing the key to use as id", () => {
      expect(arrayToObj([{ id: "a" }, { id: "b" }], "id")).toEqual({
        a: { id: "a" },
        b: { id: "b" }
      });
    });

    it("Convert and array to object by passing a key getter function", () => {
      const keyGetter = item => "id_" + item.id;
      expect(arrayToObj([{ id: "a" }, { id: "b" }], keyGetter)).toEqual({
        id_a: { id: "a" },
        id_b: { id: "b" }
      });
    });
  });
});
