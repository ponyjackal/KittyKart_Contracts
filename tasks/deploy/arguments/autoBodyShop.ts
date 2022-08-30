import { readContractAddress } from "../addresses/utils";

const KITYT_KART_ADDRESS = readContractAddress("kittyKart");
const KITYT_PAINT_ADDRESS = readContractAddress("kittyPaint");
const REGISTRY_ADDRESS = "";
const KITTY_KART_TABLE_ID = 190;
const KITTY_KART_TABLE = "";
const KITTY_PAINT_TABLE_ID = 1000;
const KITTY_PAINT_TABLE = "";

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
