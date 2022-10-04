import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, upgrades } from "hardhat";

import type { AutoBodyShop } from "../../src/types/contracts/AutoBodyShop";
import { AutoBodyShop__factory } from "../../src/types/factories/contracts/AutoBodyShop__factory";
import {
  DEPLOY_ADDRESS,
  KITTY_KART_ASSET_ATTRIBUTE_TABLE_ID,
  KITTY_KART_GO_KART_TABLE_ID,
  REGISTRY_ADDRESS,
} from "../constants";

/**
 * @note AutoBodyShop contract will be deprecated once we build out backend service for it
 */

export async function deployAutoBodyShopFixture(): Promise<{ autoBodyShop: AutoBodyShop }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
  const gameSever: SignerWithAddress = signers[1];

  const autoBodbyShopFactory: AutoBodyShop__factory = await ethers.getContractFactory("AutoBodyShop", deployer);
  const autoBodyShop: AutoBodyShop = <AutoBodyShop>(
    await upgrades.deployProxy(autoBodbyShopFactory, [REGISTRY_ADDRESS, REGISTRY_ADDRESS, REGISTRY_ADDRESS])
  );
  await autoBodyShop.deployed();
  // set game server
  await autoBodyShop.connect(deployer).setGameServer(gameSever.address);
  // set kart table
  await autoBodyShop.connect(deployer).setKittyKartGoKartTableId(KITTY_KART_GO_KART_TABLE_ID);
  // set attribute table
  await autoBodyShop.connect(deployer).setKittyKartAssetAttributeTableId(KITTY_KART_ASSET_ATTRIBUTE_TABLE_ID);
  return { autoBodyShop };
}
