import { assertObjTypes, arrayToObj } from "../../utils/objects";

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

  describe("assertObjTypes", () => {
    it("should parse a simple object", () => {
      expect(() => {
        assertObjTypes({ a: 1 }, { a: 0 });
      }).not.toThrow();
    });

    it("should parse a simple bad object, and throw", () => {
      expect(() => {
        assertObjTypes({ a: "ops" }, { a: 0 });
      }).toThrow(
        "Obj prop a must be like 0 (number), instead is: ops (string)"
      );
    });

    it("should parse a nested object", () => {
      const obj = {
        a: {
          ab: {
            abc: "ops"
          }
        }
      };
      const reference = {
        a: {
          ab: {
            abc: 0
          }
        }
      };
      expect(() => {
        assertObjTypes(obj, reference);
      }).toThrow(
        "Obj.a.ab prop abc must be like 0 (number), instead is: ops (string)"
      );
    });
  });
});
