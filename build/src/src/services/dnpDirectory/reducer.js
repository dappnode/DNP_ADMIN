import * as t from "./actionTypes";
import merge from "deepmerge";
import { assertAction } from "utils/redux";
import { arrayToObj } from "utils/objects";
import * as schemas from "schemas";
import Joi from "joi";

// Service > dnpDirectory

/**
 * @param state = dnps = {
 *   "bitcoin.dnp.dappnode.eth": {
 *     name: "bitcoin.dnp.dappnode.eth",
 *     manifest: {},
 *     avatar: {Base64Img}
 *     ...
 *   }, ... }
 * [Tested]
 */

// Prevent manifest arrays to keep populating
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;
const mergeOverwriteArrays = (a, b) =>
  merge(a, b, { arrayMerge: overwriteMerge });

export default (state = {}, action) => {
  const assertActionSchema = obj => assertAction(action, Joi.object(obj));
  switch (action.type) {
    case t.UPDATE_DNP_DIRECTORY:
      assertActionSchema({
        dnps: Joi.array()
          .items(schemas.dnpDirectoryItem.required())
          .required()
      });
      /**
       * - Extend the dnp objects assuming this function is only called
       *   to fetch the DNPs from the DAPPMANAGER, whitelist them
       * - Convert the array of dnps to an object using the key `name`
       */
      const dnps = action.dnps.map(dnp => ({ ...dnp, whitelisted: true }));
      return mergeOverwriteArrays(state, arrayToObj(dnps, "name"));

    case t.UPDATE_DNP_DIRECTORY_BY_ID:
      // #### TODO: the dnp object changes way too much
      assertActionSchema({
        id: Joi.string().required(),
        dnp: Joi.object().required()
      });
      return mergeOverwriteArrays(state, { [action.id]: action.dnp });

    default:
      return state;
  }
};
