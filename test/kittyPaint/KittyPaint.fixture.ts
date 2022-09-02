import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";

import type { KittyPaint } from "../../src/types/contracts/KittyPaint";
import { DEPLOY_ADDRESS } from "../constants";

export async function deployKittyPaintFixture(): Promise<{ kittyPaint: KittyPaint }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);

  const kittyPaintArtifact: Artifact = await artifacts.readArtifact("KittyPaint");
  const kittyPaint: KittyPaint = <KittyPaint>await waffle.deployContract(deployer, kittyPaintArtifact, []);
  await kittyPaint.deployed();
  // initialize kittyPaint
  await kittyPaint.initialize("", "", admin.address);
  return { kittyPaint };
}
