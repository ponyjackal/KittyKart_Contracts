import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, upgrades } from "hardhat";

import type { KittyAsset } from "../../src/types/contracts/KittyAsset";
import { KittyAsset__factory } from "../../src/types/factories/contracts/KittyAsset__factory";
import {
  ASSET_DESCRIPTION,
  ASSET_EXTERNAL_URL,
  ASSET_IMAGE,
  BASE_URI,
  DEPLOY_ADDRESS,
  REGISTRY_ADDRESS,
} from "../constants";

export async function deploykittyAssetFixture(): Promise<{ kittyAsset: KittyAsset }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
  // deploy kittyAsset
  const kittyAssetFactory: KittyAsset__factory = await ethers.getContractFactory("KittyAsset", deployer);
  const kittyAsset: KittyAsset = <KittyAsset>(
    await upgrades.deployProxy(kittyAssetFactory, [
      BASE_URI,
      ASSET_DESCRIPTION,
      ASSET_IMAGE,
      ASSET_EXTERNAL_URL,
      admin.address,
    ])
  );
  await kittyAsset.deployed();
  // create table
  await kittyAsset.createMetadataTable(REGISTRY_ADDRESS);
  // mint 10 tokens to admin
  await kittyAsset.connect(admin).safeMint(admin.address, "color", "color", "pint");
  return { kittyAsset };
}
