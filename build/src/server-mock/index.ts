import autobahn from "autobahn";
import * as methods from "./methods";
import { registerRoutes } from "../src/common/transport/autobahn";
import { Routes } from "../src/common";

const url = "ws://localhost:8080/ws";
const realm = "realm1";

const connection = new autobahn.Connection({ url, realm });
connection.onopen = (session, details): void => {
  console.log(`Connected to DAppNode's WAMP
  url:     ${url}
  realm:   ${realm}
  session: ${(details || {}).authid}`);

  // Type assertion of calls <> Routes happen here
  registerRoutes<Routes>(session, methods, {}).then(registrationResults => {
    for (const { ok, message } of registrationResults) {
      if (ok) console.log(message);
      else console.log(message);
    }
  });
};

connection.onclose = (reason, details): boolean => {
  console.error(`WAMP connection closed: ${reason} ${(details || {}).message}`);
  return false;
};

connection.open();
console.log(`Attempting WAMP connection to ${url}, realm: ${realm}`);
