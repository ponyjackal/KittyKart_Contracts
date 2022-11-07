import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, upgrades } from "hardhat";

import type { KittyKartGoKart } from "../../src/types/contracts/KittyKartGoKart";
import { KittyKartGoKart__factory } from "../../src/types/factories/contracts/KittyKartGoKart__factory";
import {
  ALICE_ADDRESS,
  BASE_URI,
  DEPLOY_ADDRESS,
  KART_ANIMATION_URL,
  KART_DESCRIPTION,
  KART_EXTERNAL_URL,
  KART_IMAGE,
  REGISTRY_ADDRESS,
} from "../constants";

export async function deployKittyKartGoKartFixture(): Promise<{ kittyKartGoKart: KittyKartGoKart }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const bell: SignerWithAddress = signers[0];
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
  const alice: SignerWithAddress = await ethers.getImpersonatedSigner(ALICE_ADDRESS);
  // deploy KittyKartGoKart
  const kittyKartGoKartFactory: KittyKartGoKart__factory = await ethers.getContractFactory("KittyKartGoKart", deployer);
  const kittyKartGoKart: KittyKartGoKart = <KittyKartGoKart>(
    await upgrades.deployProxy(kittyKartGoKartFactory, [
      BASE_URI,
      KART_DESCRIPTION,
      KART_IMAGE,
      KART_ANIMATION_URL,
      KART_EXTERNAL_URL,
      bell.address,
    ])
  );
  await kittyKartGoKart.deployed();
  // create table
  await kittyKartGoKart.connect(deployer).createMetadataTable(REGISTRY_ADDRESS);
  // mint 10 tokens to alice
  await kittyKartGoKart.connect(alice).publicMint(10);
  return { kittyKartGoKart };
}
