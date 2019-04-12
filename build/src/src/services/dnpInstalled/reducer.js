import * as t from "./actionTypes";
import { assertAction } from "utils/redux";

// Service > dnpInstalled

/**
 * The list of dnpInstalled is fetched from the docker containers available.
 * Because:
 * - DNPs are not guranteed to be unique.
 * - The whole list is always updated entirely
 * The dnps state should be an array
 *
 * @param {array} state = dnps = [
 *   {
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
 *   }, ... ]
 */

export default function(state = [], action) {
  switch (action.type) {
    case t.UPDATE_DNP_INSTALLED:
      assertAction(action, { dnps: [] });
      return action.dnps;

    default:
      return state;
  }
}
