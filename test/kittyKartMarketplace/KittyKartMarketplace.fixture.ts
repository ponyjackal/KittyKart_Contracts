import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, network, upgrades } from "hardhat";

import type { KittyInu } from "../../src/types/contracts/KittyInu";
import type { KittyKartAsset } from "../../src/types/contracts/KittyKartAsset";
import type { KittyKartGoKart } from "../../src/types/contracts/KittyKartGoKart";
import type { KittyKartMarketplace } from "../../src/types/contracts/KittyKartMarketplace";
import { KittyInu__factory } from "../../src/types/factories/contracts/KittyInu__factory";
import { KittyKartAsset__factory } from "../../src/types/factories/contracts/KittyKartAsset__factory";
import { KittyKartGoKart__factory } from "../../src/types/factories/contracts/KittyKartGoKart__factory";
import { KittyKartMarketplace__factory } from "../../src/types/factories/contracts/KittyKartMarketplace__factory";
import {
  ALICE_ADDRESS,
  ASSET_DESCRIPTION,
  ASSET_EXTERNAL_URL,
  BASE_URI,
  DEPLOY_ADDRESS,
  KART_ANIMATION_URL,
  KART_DESCRIPTION,
  KART_EXTERNAL_URL,
  KART_IMAGE,
  REGISTRY_ADDRESS,
  SIGNATURE_ASSET_MINT_TYPES,
  SIGNATURE_ASSET_MINT_VERSION,
  SIGNING_ASSET_MINT_DOMAIN,
} from "../constants";

export async function deployKittyKartMarketplaceFixture(): Promise<{
  kittyKartGoKart: KittyKartGoKart;
  kittyKartAsset: KittyKartAsset;
  kittyInu: KittyInu;
  kittyKartMarketplace: KittyKartMarketplace;
}> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const bell: SignerWithAddress = signers[0];
  const gameSever: SignerWithAddress = signers[1];
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
  // create kart table
  await kittyKartGoKart.connect(deployer).createMetadataTable(REGISTRY_ADDRESS);
  // mint 10 kart tokens to alice
  await kittyKartGoKart.connect(alice).publicMint(10);

  // deploy kittyKartAsset
  const kittyKartAssetFactory: KittyKartAsset__factory = await ethers.getContractFactory("KittyKartAsset", deployer);
  const kittyKartAsset: KittyKartAsset = <KittyKartAsset>(
    await upgrades.deployProxy(kittyKartAssetFactory, [BASE_URI, ASSET_DESCRIPTION, ASSET_EXTERNAL_URL, bell.address])
  );
  await kittyKartAsset.deployed();
  // create table
  await kittyKartAsset.connect(deployer).createMetadataTable(REGISTRY_ADDRESS);
  // set game server
  await kittyKartAsset.connect(deployer).setGameServer(bell.address);
  // sign a message for KittyKartAssetVoucher
  const data1 = {
    receiver: alice.address,
    displayTypes: [
      ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("string"), 0, 16),
      ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("string"), 0, 16),
      ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("string"), 0, 16),
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
    image: "",
    animationUrl: "",
    nonce: 0,
    expiry: 1663289367,
  };
  const typedDomain = {
    name: SIGNING_ASSET_MINT_DOMAIN,
    version: SIGNATURE_ASSET_MINT_VERSION,
    chainId: network.config.chainId,
    verifyingContract: kittyKartAsset.address,
  };
  const signature1 = await bell._signTypedData(typedDomain, SIGNATURE_ASSET_MINT_TYPES, data1);
  const voucher1 = {
    ...data1,
    signature: signature1,
  };
  // mint a token to alice
  await kittyKartAsset.connect(alice).safeMint(voucher1);
  // sign a message for KittyKartAssetVoucher
  const data2 = {
    receiver: alice.address,
    displayTypes: [ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("string"), 0, 16)],
    traitTypes: [ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("paint"), 0, 16)],
    values: [ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("pink"), 0, 16)],
    image: "",
    animationUrl: "",
    nonce: 1,
    expiry: 0,
  };
  const signature2 = await bell._signTypedData(typedDomain, SIGNATURE_ASSET_MINT_TYPES, data2);
  const voucher2 = {
    ...data2,
    signature: signature2,
  };
  // mint a token to alice
  await kittyKartAsset.connect(alice).safeMint(voucher2);

  // deploy KittyInu
  const kittyInuFactory: KittyInu__factory = await ethers.getContractFactory("KittyInu", deployer);
  const kittyInu: KittyInu = <KittyInu>await upgrades.deployProxy(kittyInuFactory, []);
  await kittyInu.deployed();
  // mint 10 tokens to bell
  await kittyInu.connect(deployer).mint(bell.address, ethers.utils.parseEther("1000"));

  // deploy KittyKartMarketplace
  const kittyKartMarketplaceFactory: KittyKartMarketplace__factory = await ethers.getContractFactory(
    "KittyKartMarketplace",
    deployer,
  );
  const kittyKartMarketplace: KittyKartMarketplace = <KittyKartMarketplace>(
    await upgrades.deployProxy(kittyKartMarketplaceFactory, [
      kittyKartGoKart.address,
      kittyKartAsset.address,
      kittyInu.address,
    ])
  );
  await kittyKartMarketplace.deployed();
  // set game server
  await kittyKartMarketplace.connect(deployer).setGameServer(gameSever.address);

  // add kittyKartMarketplace to approved marketplaces for kittyKartAsset
  await kittyKartAsset.connect(deployer).setApprovedMarketplace(kittyKartMarketplace.address, true);
  // add kittyKartMarketplace to approved marketplaces for kittyKartGoKart
  await kittyKartGoKart.connect(deployer).setApprovedMarketplace(kittyKartMarketplace.address, true);
  // alice has some karts and assets tokens
  // approve asset tokens to kittyKartMarketplace
  await kittyKartGoKart.connect(alice).setApprovalForAll(kittyKartMarketplace.address, true);
  await kittyKartAsset.connect(alice).setApprovalForAll(kittyKartMarketplace.address, true);

  return { kittyKartGoKart, kittyKartAsset, kittyInu, kittyKartMarketplace };
}
