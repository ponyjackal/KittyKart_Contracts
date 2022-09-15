import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { utils } from "ethers";
import { ethers, upgrades } from "hardhat";

import type { KittyAsset } from "../../src/types/contracts/KittyAsset";
import { KittyAsset__factory } from "../../src/types/factories/contracts/KittyAsset__factory";
import {
  ALICE_ADDRESS,
  ASSET_DESCRIPTION,
  ASSET_EXTERNAL_URL,
  ASSET_IMAGE,
  BASE_URI,
  DEPLOY_ADDRESS,
  GAME_SERVER_ADDRESS,
  REGISTRY_ADDRESS,
} from "../constants";

export async function deploykittyAssetFixture(): Promise<{ kittyAsset: KittyAsset }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
  const gameServer: SignerWithAddress = await ethers.getImpersonatedSigner(GAME_SERVER_ADDRESS);
  const alice: SignerWithAddress = await ethers.getImpersonatedSigner(ALICE_ADDRESS);
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
  await kittyAsset.connect(deployer).createMetadataTable(REGISTRY_ADDRESS);
  // set game server
  await kittyAsset.connect(deployer).setGameServer(gameServer.address);
  // mint 4 tokens to alice
  await kittyAsset
    .connect(gameServer)
    .safeMint(
      alice.address,
      [
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("paint"), 0, 16),
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("wheel"), 0, 16),
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("engine"), 0, 16),
      ],
      [
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("paint"), 0, 16),
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("wheel"), 0, 16),
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("engine"), 0, 16),
      ],
      [
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("blue"), 0, 16),
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("Alloy"), 0, 16),
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("v8"), 0, 16),
      ],
    );
  await kittyAsset
    .connect(gameServer)
    .safeMint(
      alice.address,
      [ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("paint"), 0, 16)],
      [ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("paint"), 0, 16)],
      [ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("pink"), 0, 16)],
    );
  await kittyAsset
    .connect(gameServer)
    .safeMint(
      alice.address,
      [
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("wheel"), 0, 16),
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("engine"), 0, 16),
      ],
      [
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("wheel"), 0, 16),
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("engine"), 0, 16),
      ],
      [
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("Alloy"), 0, 16),
        ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("v8"), 0, 16),
      ],
    );
  return { kittyAsset };
}
