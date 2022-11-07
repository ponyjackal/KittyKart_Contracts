import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, upgrades } from "hardhat";

import type { KittyKartMarketplace } from "../../src/types/contracts/KittyKartMarketplace";
import { KittyKartMarketplace__factory } from "../../src/types/factories/contracts/KittyKartMarketplace__factory";
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

export async function deployKittyKartMarketplaceFixture(): Promise<{ kittyKartMarketplace: KittyKartMarketplace }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
  const alice: SignerWithAddress = await ethers.getImpersonatedSigner(ALICE_ADDRESS);
  // deploy KittyKartMarketplace
  const kittyKartMarketplaceFactory: KittyKartMarketplace__factory = await ethers.getContractFactory(
    "KittyKartMarketplace",
    deployer,
  );
  const kittyKartMarketplace: KittyKartMarketplace = <KittyKartMarketplace>(
    await upgrades.deployProxy(kittyKartMarketplaceFactory, [
      BASE_URI,
      KART_DESCRIPTION,
      KART_IMAGE,
      KART_ANIMATION_URL,
      KART_EXTERNAL_URL,
      admin.address,
    ])
  );
  await kittyKartMarketplace.deployed();
  return { kittyKartMarketplace };
}
