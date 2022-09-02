import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, upgrades } from "hardhat";

import type { KittyPaint } from "../../src/types/contracts/KittyPaint";
import { KittyPaint__factory } from "../../src/types/factories/contracts/KittyPaint__factory";
import { DEPLOY_ADDRESS } from "../constants";

export async function deployKittyPaintFixture(): Promise<{ kittyPaint: KittyPaint }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);

  const kittyPaintFactory: KittyPaint__factory = await ethers.getContractFactory("KittyPaint", deployer);
  const kittyPaint: KittyPaint = <KittyPaint>await upgrades.deployProxy(kittyPaintFactory, ["", "", admin.address]);
  await kittyPaint.deployed();
  return { kittyPaint };
}
