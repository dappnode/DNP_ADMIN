import * as t from "./actionTypes";
import { assertAction } from "utils/redux";
import { arrayToObj } from "utils/objects";

// Service > dnpInstalled

/**
 * @param state = dnps = {
 *   "otpweb.dnp.dappnode.eth-83283497234...": {
 *     id: '927623894...',
 *     isDNP: true, (boolean),
 *     created: <Date string>,
 *     image: <Image Name>, (string)
 *     name: otpweb.dnp.dappnode.eth, (string)
 *     shortName: otpweb, (string)
 *     version: '0.0.4', (string)
 *     ports: <list of ports>, (string)
 *     state: 'exited', (string)
 *     running: true, (boolean),
 *     envs: <Env variables> (object)
 *   }, ... }
 */

export default function(state = {}, action) {
  switch (action.type) {
    case t.UPDATE_DNP_INSTALLED:
      // Patch to ensure action.dnps is an object, if it is an array
      action.dnps = Array.isArray(action.dnps)
        ? arrayToObj(action.dnps, dnp => `${dnp.name}-${dnp.id}`)
        : action.dnps;
      assertAction(action, { dnps: {} });
      return action.dnps;

    default:
      return state;
  }
}
