import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, upgrades } from "hardhat";

import type { KittyKart } from "../../src/types/contracts/KittyKart";
import { KittyKart__factory } from "../../src/types/factories/contracts/KittyKart__factory";
import { DEPLOY_ADDRESS } from "../constants";

export async function deployKittyKartFixture(): Promise<{ kittyKart: KittyKart }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);

  const kittyKartFactory: KittyKart__factory = await ethers.getContractFactory("KittyKart", deployer);
  const kittyKart: KittyKart = <KittyKart>await upgrades.deployProxy(kittyKartFactory, ["", "", admin.address]);
  await kittyKart.deployed();
  return { kittyKart };
}
