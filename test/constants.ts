export const TABLELAND_NETWORK = "testnet";
export const TABLELAND_CHAIN = "ethereum";

export const DEPLOY_ADDRESS = "0x2DaA35962A6D43EB54C48367b33d0B379C930E5e";
<<<<<<< HEAD
export const GAME_SERVER_ADDRESS = "0x829BD824B016326A401d083B33D092293333A830";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
=======
export const GAME_SERVER_ADDRESS = "0xE078c3BDEe620829135e1ab526bE860498B06339";
>>>>>>> caadfea (feat: update KittyKartAssetNFTVoucher)
export const ALICE_ADDRESS = "0x7F101fE45e6649A6fB8F3F8B43ed03D353f2B90c";
export const MARKET_PLACE_1 = "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b";
export const REGISTRY_ADDRESS = "0x012969f7e3439a9B04025b5a049EB9BAD82A8C12";
export const BASE_URI = "https://testnet.tableland.network/query?s=";
export const KART_DESCRIPTION = "Kitty Kart";
export const KART_IMAGE = "https://testnet.tableland.network/kart.png";
export const KART_ANIMATION_URL = "";
export const KART_EXTERNAL_URL = "https://testnet.tableland.network";
export const ASSET_DESCRIPTION = "Kitty Asset";
export const ASSET_IMAGE = "https://testnet.tableland.network/asset.png";
export const ASSET_ANIMATION_URL = "https://testnet.tableland.network";
export const ASSET_EXTERNAL_URL = "https://testnet.tableland.network";
export const SIGNING_AUTOBODY_SHOP_DOMAIN = "AutoBodyShopVoucher";
export const SIGNING_AUTOBODY_SHOP_VERSION = "1";
export const SIGNING_AUTOBODY_SHOP_TYPES = {
  AutoBodyShopVoucher: [
    { name: "owner", type: "address" },
    { name: "kartId", type: "uint256" },
    { name: "assetIds", type: "uint256[]" },
    { name: "resetQuery", type: "string" },
    { name: "applyQuery", type: "string" },
    { name: "updateImageQuery", type: "string" },
    { name: "nonce", type: "uint256" },
    { name: "expiry", type: "uint256" },
  ],
};
export const KITTY_KART_GO_KART_TABLE_ID = 1;
export const KITTY_KART_ASSET_ATTRIBUTE_TABLE_ID = 2;
export const SIGNING_ASSET_MINT_DOMAIN = "KittyKartAssetVoucher";
export const SIGNATURE_ASSET_MINT_VERSION = "1";
export const SIGNATURE_ASSET_MINT_TYPES = {
  KittyKartAssetVoucher: [
    { name: "receiver", type: "address" },
    { name: "displayTypes", type: "bytes16[]" },
    { name: "traitTypes", type: "bytes16[]" },
    { name: "values", type: "bytes16[]" },
    { name: "nonce", type: "uint256" },
    { name: "expiry", type: "uint256" },
  ],
};
