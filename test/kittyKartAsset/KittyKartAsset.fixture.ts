import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { utils } from "ethers";
import { ethers, network, upgrades } from "hardhat";

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
  SIGNATURE_ASSET_MINT_TYPES,
  SIGNATURE_ASSET_MINT_VERSION,
  SIGNING_ASSET_MINT_DOMAIN,
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
  const data1 = {
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
  };
  const typedDomain = {
    name: SIGNING_ASSET_MINT_DOMAIN,
    version: SIGNATURE_ASSET_MINT_VERSION,
    chainId: network.config.chainId,
    verifyingContract: kittyKartAsset.address,
  };
  const signature1 = await admin._signTypedData(typedDomain, SIGNATURE_ASSET_MINT_TYPES, data1);
  const voucher1 = {
    ...data1,
    signature: signature1,
  };
  // mint a token to alice
  await kittyKartAsset.connect(alice).safeMint(voucher1);
  // sign a message for KittyAssetVoucher
  const data2 = {
    receiver: alice.address,
    displayTypes: [ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("paint"), 0, 16)],
    traitTypes: [ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("paint"), 0, 16)],
    values: [ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("pink"), 0, 16)],
  };
  const signature2 = await admin._signTypedData(typedDomain, SIGNATURE_ASSET_MINT_TYPES, data2);
  const voucher2 = {
    ...data2,
    signature: signature2,
  };
  // mint a token to alice
  await kittyKartAsset.connect(alice).safeMint(voucher2);

  return { kittyKartAsset };
}
