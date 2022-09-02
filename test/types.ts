import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { AutoBodyShop } from "../src/types/contracts/AutoBodyShop";
import type { KittyKart } from "../src/types/contracts/KittyKart";
import type { KittyPaint } from "../src/types/contracts/KittyPaint";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    autoBodyShop: AutoBodyShop;
    kittyKart: KittyKart;
    kittyPaint: KittyPaint;
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
