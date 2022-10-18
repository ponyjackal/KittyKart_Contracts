import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyKartAsset__factory } from "../../src/types/factories/contracts/KittyKartAsset__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/kittyKartAsset";

task("deploy:KittyKartAsset").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const accounts: Signer[] = await ethers.getSigners();

  // deploy kittyKartAsset
  const kittyKartAssetFactory: KittyKartAsset__factory = <KittyKartAsset__factory>(
    await ethers.getContractFactory("KittyKartAsset", accounts[0])
  );
  const kittyKartAssetProxy = await upgrades.deployProxy(kittyKartAssetFactory, [
    cArguments.BASE_URI,
    cArguments.DESCRIPTION,
    cArguments.EXTERNAL_URL,
    cArguments.ROYALTY_RECEIVER,
  ]);
  await kittyKartAssetProxy.deployed();

  writeContractAddress("kittyKartAssetProxy", kittyKartAssetProxy.address);
  console.log("KittyKartAsset proxy deployed to: ", kittyKartAssetProxy.address);

  const kittyKartAsset = await upgrades.erc1967.getImplementationAddress(kittyKartAssetProxy.address);
  writeContractAddress("kittyKartAsset", kittyKartAsset);
  console.log("KittyKartAsset deployed to: ", kittyKartAsset);
});

task("upgrade:KittyKartAsset").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  console.log("--- start upgrading the kittyKartAsset Contract ---");
  const accounts: Signer[] = await ethers.getSigners();

  const kittyKartAssetFactory: KittyKartAsset__factory = <KittyKartAsset__factory>(
    await ethers.getContractFactory("KittyKartAsset", accounts[0])
  );

  const kittyKartAssetProxyAddress = readContractAddress("kittyKartAssetProxy");

  const upgraded = await upgrades.upgradeProxy(kittyKartAssetProxyAddress, kittyKartAssetFactory);

  console.log("KittyKartAsset upgraded to: ", upgraded.address);

  const kittyKartAsset = await upgrades.erc1967.getImplementationAddress(upgraded.address);
  writeContractAddress("kittyKartAsset", kittyKartAsset);
  console.log("Implementation :", kittyKartAsset);
});

task("verify:KittyKartAsset").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("kittyKartAsset");

  try {
    await run("verify:verify", {
      address,
      constructorArguments: [],
    });
  } catch (err) {
    console.log(err);
  }
});
