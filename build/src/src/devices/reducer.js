// DEVICES
import * as t from "./actionTypes";

const mockData = [
  {
    name: "dappnode_admin",
    password: "oLfWLHwcqFATVEuu5GG7",
    ip: "172.33.10.1",
    otp:
      "https://dappnode.github.io/DAppNode_OTP/#otp=eyJzZXJ2ZXIiOiI4My41OS4yMTIuMjQ0IiwibmFtZSI6IkROZ2l2ZXRoSG91c2UiLCJ1c2VyIjoiZGFwcG5vZGVfYWRtaW4iLCJwYXNzIjoib0xmV0xId2NxRkFUVkV1dTVHRzciLCJwc2siOiJTOHRaVU5oMkJmR3didGRMTXhqZyJ9"
  },
  {
    name: "Edu",
    password: "hu8SwkQ0w7Gr7PMdWsTp",
    ip: "172.33.10.2",
    otp:
      "https://dappnode.github.io/DAppNode_OTP/#otp=eyJzZXJ2ZXIiOiI4My41OS4yMTIuMjQ0IiwibmFtZSI6IkROZ2l2ZXRoSG91c2UiLCJ1c2VyIjoiRWR1IiwicGFzcyI6Imh1OFN3a1EwdzdHcjdQTWRXc1RwIiwicHNrIjoiUzh0WlVOaDJCZkd3YnRkTE14amcifQ"
  },
  {
    name: "Yalor",
    password: "p90P3HvFgKBsJCUR8gzD",
    ip: "172.33.100.3",
    otp:
      "https://dappnode.github.io/DAppNode_OTP/#otp=eyJzZXJ2ZXIiOiI4My41OS4yMTIuMjQ0IiwibmFtZSI6IkROZ2l2ZXRoSG91c2UiLCJ1c2VyIjoiWWFsb3IiLCJwYXNzIjoicDkwUDNIdkZnS0JzSkNVUjhnekQiLCJwc2siOiJTOHRaVU5oMkJmR3didGRMTXhqZyJ9"
  },
  {
    name: "lionNonAdmin",
    password: "jDzchetkzLd8KTG2InGl",
    ip: "172.33.100.4",
    otp:
      "https://dappnode.github.io/DAppNode_OTP/#otp=eyJzZXJ2ZXIiOiI4My41OS4yMTIuMjQ0IiwibmFtZSI6IkROZ2l2ZXRoSG91c2UiLCJ1c2VyIjoibGlvbk5vbkFkbWluIiwicGFzcyI6ImpEemNoZXRrekxkOEtURzJJbkdsIiwicHNrIjoiUzh0WlVOaDJCZkd3YnRkTE14amcifQ"
  }
];

// const initialState = []; // PRODUCTION
const initialState = mockData; // DEV-OFFLINE

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE:
      return action.payload;
    default:
      return state;
  }
}
