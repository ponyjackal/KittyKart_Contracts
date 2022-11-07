import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, upgrades } from "hardhat";

import type { KittyInu } from "../../src/types/contracts/KittyInu";
import { KittyInu__factory } from "../../src/types/factories/contracts/KittyInu__factory";
import { DEPLOY_ADDRESS } from "../constants";

export async function deployKittyInuFixture(): Promise<{ kittyInu: KittyInu }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const bell: SignerWithAddress = signers[0];
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
  // deploy KittyInu
  const kittyInuFactory: KittyInu__factory = await ethers.getContractFactory("KittyInu", deployer);
  const kittyInu: KittyInu = <KittyInu>await upgrades.deployProxy(kittyInuFactory, []);
  await kittyInu.deployed();
  // mint 10 tokens to bell
  await kittyInu.connect(deployer).mint(bell.address, ethers.utils.parseEther("1000"));
  return { kittyInu };
}
