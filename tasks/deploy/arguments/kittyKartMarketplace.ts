import { readValue } from "../../scripts/values/utils";
import { readContractAddress } from "../addresses/utils";

const KITTY_KART_GO_KART_ADDRESS = readContractAddress("kittyKartGoKartProxy");
const KITTY_KART_ASSET_ADDRESS = readContractAddress("kittyKartAssetProxy");
const KITTY_INU_ADDRESS = readContractAddress("kittyInu");
const REGISTRY_ADDRESS = readValue("registry");

const values = {
  KITTY_KART_GO_KART_ADDRESS,
  KITTY_KART_ASSET_ADDRESS,
  KITTY_INU_ADDRESS,
  REGISTRY_ADDRESS,
} as const;

export default values;
