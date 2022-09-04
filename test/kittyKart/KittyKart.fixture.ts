import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, upgrades } from "hardhat";

import type { KittyKart } from "../../src/types/contracts/KittyKart";
import { KittyKart__factory } from "../../src/types/factories/contracts/KittyKart__factory";
import {
  BASE_URI,
  DEPLOY_ADDRESS,
  KART_DESCRIPTION,
  KART_EXTERNAL_URL,
  KART_IMAGE,
  REGISTRY_ADDRESS,
} from "../constants";

export async function deployKittyKartFixture(): Promise<{ kittyKart: KittyKart }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
  console.log("deployer", await deployer.getBalance());
  // deploy KittyKart
  const kittyKartFactory: KittyKart__factory = await ethers.getContractFactory("KittyKart", deployer);
  const kittyKart: KittyKart = <KittyKart>(
    await upgrades.deployProxy(kittyKartFactory, [
      BASE_URI,
      KART_DESCRIPTION,
      KART_IMAGE,
      KART_EXTERNAL_URL,
      admin.address,
    ])
  );
  await kittyKart.deployed();
  // create table
  await kittyKart.createMetadataTable(REGISTRY_ADDRESS);
  // mint 10 tokens to admin
  await kittyKart.connect(admin).publicMint(10);
  return { kittyKart };
}
