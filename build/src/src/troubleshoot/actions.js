// INSTALLER
import t from "./actionTypes";

// Used in package root

export const diagnose = () => ({
  type: t.DIAGNOSE
});

export const updateDiagnose = diagnose => ({
  type: t.UPDATE_DIAGNOSE,
  diagnose
});

export const clearDiagnose = () => ({
  type: t.CLEAR_DIAGNOSE
});

export const updateInfo = (topic, info) => ({
  type: t.UPDATE_INFO,
  topic,
  info
});
