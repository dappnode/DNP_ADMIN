import * as t from "./actionTypes";
import { assertAction } from "utils/redux";
import * as schemas from "schemas";
import Joi from "joi";

// Service > dnpInstalled

/**
 * The list of dnpInstalled is fetched from the docker containers available.
 * Because:
 * - DNPs are not guranteed to be unique.
 * - The whole list is always updated entirely
 * The dnps state should be an array
 *
 * @param {array} state = dnps = [{
 *   id: "923852...", {string}
 *   packageName: "DAppNodePackage-admin...", {string}
 *   version: "0.1.8", {string}
 *   isDnp: true, {bool}
 *   isCore: false, {bool}
 *   created: <data string>, {string}
 *   image: "admin.dnp.dappnode.eth-0.1.8", {string}
 *   name: "admin.dnp.dappnode.eth", {string}
 *   shortName: "admin", {string}
 *   ports: [{
 *     PrivatePort: 2222, {number}
 *     PublicPort: 3333, {number}
 *     Type: "tcp" {string}
 *   }, ... ], {array}
 *   volumes: [{
 *     type: "bind", {string}
 *     name: "admin_data", {string}
 *     path: "source path" {string}
 *   }, ... ] {array}
 *   state: "running", {string}
 *   running: true, {bool}
 *
 *   // From labels
 *   origin: "/ipfs/Qmabcd...", {string}
 *   chain: "ethereum", {string}
 *   dependencies: { dependency.dnp.dappnode.eth: "0.1.8" }, {object}
 *   portsToClose: [ {number: 30303, type: 'UDP'}, ...], {array}
 *
 *   // Appended on RPC call
 *   envs: { ENV_NAME: "ENV_VALUE" }, {object}
 *   manifest: <manifest object> {object}
 * }, ... ]
 */

export default function(state = [], action) {
  switch (action.type) {
    case t.UPDATE_DNP_INSTALLED:
      assertAction(
        action,
        Joi.object({
          dnps: schemas.dnpInstalled.required()
        })
      );
      return action.dnps;

    default:
      return state;
  }
}
