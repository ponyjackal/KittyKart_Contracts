import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";

import type { KittyKart } from "../../src/types/contracts/KittyKart";
import { DEPLOY_ADDRESS } from "../constants";

export async function deployKittyKartFixture(): Promise<{ kittyKart: KittyKart }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);

  const kittyKartArtifact: Artifact = await artifacts.readArtifact("KittyKart");
  const kittyKart: KittyKart = <KittyKart>await waffle.deployContract(deployer, kittyKartArtifact, []);
  await kittyKart.deployed();
  // initialize kittyKart
  await kittyKart.initialize("", "", admin.address);
  return { kittyKart };
}
