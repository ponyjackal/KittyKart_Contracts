import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, upgrades } from "hardhat";

import type { AutoBodyShop } from "../../src/types/contracts/AutoBodyShop";
import { AutoBodyShop__factory } from "../../src/types/factories/contracts/AutoBodyShop__factory";
import {
  DEPLOY_ADDRESS,
  KITTY_KART_TABLE,
  KITTY_KART_TABLE_ID,
  KITTY_PAINT_TABLE,
  KITTY_PAINT_TABLE_ID,
  REGISTRY_ADDRESS,
} from "../constants";

export async function deployAutoBodyShopFixture(): Promise<{ autoBodyShop: AutoBodyShop }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);

  const autoBodbyShopFactory: AutoBodyShop__factory = await ethers.getContractFactory("AutoBodyShop", deployer);
  const autoBodyShop: AutoBodyShop = <AutoBodyShop>(
    await upgrades.deployProxy(autoBodbyShopFactory, [
      REGISTRY_ADDRESS,
      REGISTRY_ADDRESS,
      REGISTRY_ADDRESS,
      KITTY_KART_TABLE_ID,
      KITTY_KART_TABLE,
      KITTY_PAINT_TABLE_ID,
      KITTY_PAINT_TABLE,
    ])
  );
  await autoBodyShop.deployed();
  return { autoBodyShop };
}