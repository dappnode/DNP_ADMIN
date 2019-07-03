import { stringSplit } from "utils/strings";

export const stripVersion = s => stringSplit(s, "@")[0];
