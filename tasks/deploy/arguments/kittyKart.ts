import { readValue } from "../../scripts/values/utils";

const BASE_URI = readValue("baseURI");
const DESCRIPTION = readValue("assetDescription");
const IMAGE = readValue("assetImage");
const EXTERNAL_URL = readValue("assetExternalURL");
const ROYALTY_RECEIVER = "0xE078c3BDEe620829135e1ab526bE860498B06339";

const values = {
  BASE_URI,
  DESCRIPTION,
  IMAGE,
  EXTERNAL_URL,
  ROYALTY_RECEIVER,
} as const;

export default values;
