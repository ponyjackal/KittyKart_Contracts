import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyAsset__factory } from "../../src/types/factories/contracts/KittyAsset__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/kittyAsset";

task("deploy:KittyAsset").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const accounts: Signer[] = await ethers.getSigners();

  // deploy kittyAsset
  const kittyAssetFactory: KittyAsset__factory = <KittyAsset__factory>(
    await ethers.getContractFactory("KittyAsset", accounts[0])
  );
  const kittyAssetProxy = await upgrades.deployProxy(kittyAssetFactory, [
    cArguments.BASE_URI,
    cArguments.DESCRIPTION,
    cArguments.IMAGE,
    cArguments.EXTERNAL_URL,
    cArguments.ROYALTY_RECEIVER,
  ]);
  await kittyAssetProxy.deployed();

  writeContractAddress("kittyAssetProxy", kittyAssetProxy.address);
  console.log("KittyAsset proxy deployed to: ", kittyAssetProxy.address);

  const kittyAsset = await upgrades.erc1967.getImplementationAddress(kittyAssetProxy.address);
  writeContractAddress("kittyAsset", kittyAsset);
  console.log("KittyAsset deployed to: ", kittyAsset);
});

task("upgrade:KittyAsset").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  console.log("--- start upgrading the kittyAsset Contract ---");
  const accounts: Signer[] = await ethers.getSigners();

  const kittyAssetFactory: KittyAsset__factory = <KittyAsset__factory>(
    await ethers.getContractFactory("KittyAsset", accounts[0])
  );

  const kittyAssetProxyAddress = readContractAddress("kittyAssetProxy");

  const upgraded = await upgrades.upgradeProxy(kittyAssetProxyAddress, kittyAssetFactory);

  console.log("KittyAsset upgraded to: ", upgraded.address);

  const kittyAsset = await upgrades.erc1967.getImplementationAddress(upgraded.address);
  writeContractAddress("kittyAsset", kittyAsset);
  console.log("Implementation :", kittyAsset);
});

task("verify:KittyAsset").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("kittyAsset");

  try {
    await run("verify:verify", {
      address,
      constructorArguments: [],
    });
  } catch (err) {
    console.log(err);
  }
});
