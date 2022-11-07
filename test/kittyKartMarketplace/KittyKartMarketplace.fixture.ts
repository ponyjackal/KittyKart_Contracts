import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, upgrades } from "hardhat";

import type { KittyKartMarketplace } from "../../src/types/contracts/KittyKartMarketplace";
import { KittyKartMarketplace__factory } from "../../src/types/factories/contracts/KittyKartMarketplace__factory";
import { DEPLOY_ADDRESS, REGISTRY_ADDRESS } from "../constants";

export async function deployKittyKartMarketplaceFixture(): Promise<{ kittyKartMarketplace: KittyKartMarketplace }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
  const gameSever: SignerWithAddress = signers[1];
  // deploy KittyKartMarketplace
  const kittyKartMarketplaceFactory: KittyKartMarketplace__factory = await ethers.getContractFactory(
    "KittyKartMarketplace",
    deployer,
  );
  const kittyKartMarketplace: KittyKartMarketplace = <KittyKartMarketplace>(
    await upgrades.deployProxy(kittyKartMarketplaceFactory, [REGISTRY_ADDRESS, REGISTRY_ADDRESS, REGISTRY_ADDRESS])
  );
  await kittyKartMarketplace.deployed();

  // set game server
  await kittyKartMarketplace.connect(deployer).setGameServer(gameSever.address);

  return { kittyKartMarketplace };
}
