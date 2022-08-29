import { readContractAddress } from "../addresses/utils";

const EXTERNAL_URL = "";
const BASE_URI = "";
const ROYALTY_RECEIVER = "0xE078c3BDEe620829135e1ab526bE860498B06339";

const values = {
  BASE_URI,
  EXTERNAL_URL,
  ROYALTY_RECEIVER,
} as const;

export default values;
