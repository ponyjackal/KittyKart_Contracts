import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { AutoBodyShop } from "../src/types/contracts/AutoBodyShop";
import type { KittyInu } from "../src/types/contracts/KittyInu";
import type { KittyKartAsset } from "../src/types/contracts/KittyKartAsset";
import type { KittyKartGoKart } from "../src/types/contracts/KittyKartGoKart";
import type { KittyKartMarketplace } from "../src/types/contracts/KittyKartMarketplace";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    autoBodyShop: AutoBodyShop;
    kittyKartGoKart: KittyKartGoKart;
    kittyKartAsset: KittyKartAsset;
    kittyInu: KittyInu;
    kittyKartMarketplace: KittyKartMarketplace;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  deployer: SignerWithAddress;
  gameServer: SignerWithAddress;
  alice: SignerWithAddress;
  andy: SignerWithAddress;
  bell: SignerWithAddress;
  john: SignerWithAddress;
}
