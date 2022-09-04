import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { AutoBodyShop } from "../src/types/contracts/AutoBodyShop";
import type { KittyAsset } from "../src/types/contracts/KittyAsset";
import type { KittyKart } from "../src/types/contracts/KittyKart";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    autoBodyShop: AutoBodyShop;
    kittyKart: KittyKart;
    kittyAsset: KittyAsset;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  deployer: SignerWithAddress;
  admin: SignerWithAddress;
  alice: SignerWithAddress;
  andy: SignerWithAddress;
  bell: SignerWithAddress;
  john: SignerWithAddress;
}
