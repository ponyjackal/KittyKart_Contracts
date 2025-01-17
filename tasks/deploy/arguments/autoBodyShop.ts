import { readValue } from "../../scripts/values/utils";
import { readContractAddress } from "../addresses/utils";

const KITYT_KART_ADDRESS = readContractAddress("kittyKartProxy");
const KITYT_PAINT_ADDRESS = readContractAddress("kittyAssetProxy");
const REGISTRY_ADDRESS = readValue("registry");

const values = {
  KITYT_KART_ADDRESS,
  KITYT_PAINT_ADDRESS,
  REGISTRY_ADDRESS,
} as const;

export default values;
