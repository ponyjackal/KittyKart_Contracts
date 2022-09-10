import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, upgrades } from "hardhat";

import type { KittyKartAsset } from "../../src/types/contracts/KittyKartAsset";
import { KittyKartAsset__factory } from "../../src/types/factories/contracts/KittyKartAsset__factory";
import {
  ALICE_ADDRESS,
  ASSET_ANIMATION_URL,
  ASSET_DESCRIPTION,
  ASSET_EXTERNAL_URL,
  ASSET_IMAGE,
  BASE_URI,
  DEPLOY_ADDRESS,
  GAME_SERVER_ADDRESS,
  REGISTRY_ADDRESS,
  SIGNATURE_TYPES,
  SIGNATURE_VERSION,
  SIGNING_DOMAIN,
} from "../constants";

export async function deploykittyKartAssetFixture(): Promise<{ kittyKartAsset: KittyKartAsset }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];
  const deployer: SignerWithAddress = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
  const gameServer: SignerWithAddress = await ethers.getImpersonatedSigner(GAME_SERVER_ADDRESS);
  const alice: SignerWithAddress = await ethers.getImpersonatedSigner(ALICE_ADDRESS);
  // deploy kittyKartAsset
  const kittyKartAssetFactory: KittyKartAsset__factory = await ethers.getContractFactory("KittyKartAsset", deployer);
  const kittyKartAsset: KittyKartAsset = <KittyKartAsset>(
    await upgrades.deployProxy(kittyKartAssetFactory, [
      BASE_URI,
      ASSET_DESCRIPTION,
      ASSET_IMAGE,
      ASSET_ANIMATION_URL,
      ASSET_EXTERNAL_URL,
      admin.address,
    ])
  );
  await kittyKartAsset.deployed();
  // create table
  await kittyKartAsset.connect(deployer).createMetadataTable(REGISTRY_ADDRESS);
  // set game server
  await kittyKartAsset.connect(deployer).setGameServer(admin.address);
  // sign a message for KittyAssetVoucher
  let voucher = {
    receiver: alice.address,
    displayTypes: [
      ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("paint"), 0, 16),
      ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("wheel"), 0, 16),
      ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("engine"), 0, 16),
    ],
    traitTypes: [
      ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("paint"), 0, 16),
      ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("wheel"), 0, 16),
      ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("engine"), 0, 16),
    ],
    values: [
      ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("blue"), 0, 16),
      ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("Alloy"), 0, 16),
      ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("v8"), 0, 16),
    ],
    signature: "",
  };
  const typedDomain = {
    name: SIGNING_DOMAIN,
    version: SIGNATURE_VERSION,
    chainId: 1,
    verifyingContract: kittyKartAsset.address,
  };
  const signature = await admin._signTypedData(typedDomain, SIGNATURE_TYPES, voucher);
  voucher.signature = signature;

  // mint 3 tokens to alice
  await kittyKartAsset.connect(alice).safeMint(voucher);
  return { kittyKartAsset };
}
