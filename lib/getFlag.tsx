// src/lib/getFlag.ts

import config from "../lib/config.tsx";

const getFlag = (flag: string, defaultValue: boolean): boolean => {
  const v = config.publicRuntimeConfig.backend.flags[flag];
  if (typeof v === 'undefined') return defaultValue;
  return v;
}

export default getFlag;
