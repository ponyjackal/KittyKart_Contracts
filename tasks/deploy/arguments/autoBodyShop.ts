import { readValue } from "../../scripts/values/utils";
import { readContractAddress } from "../addresses/utils";

const KITYT_KART_ADDRESS = readContractAddress("kittyKartProxy");
const KITYT_PAINT_ADDRESS = readContractAddress("kittyAssetProxy");
const REGISTRY_ADDRESS = readValue("registry");
const KITTY_KART_TABLE_ID = readValue("kittyKartTableId");
const KITTY_KART_TABLE = readValue("kittyKartTable");
const KITTY_PAINT_TABLE_ID = readValue("kittyAssetTableId");
const KITTY_PAINT_TABLE = readValue("kittyAssetTable");

const values = {
  KITYT_KART_ADDRESS,
  KITYT_PAINT_ADDRESS,
  REGISTRY_ADDRESS,
  KITTY_KART_TABLE_ID,
  KITTY_KART_TABLE,
  KITTY_PAINT_TABLE_ID,
  KITTY_PAINT_TABLE,
} as const;

export default values;
