import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { AutoBodyShop } from "../../src/types/contracts/AutoBodyShop";
import { AutoBodyShop__factory } from "../../src/types/factories/contracts/AutoBodyShop__factory";
import { readContractAddress } from "../deploy/addresses/utils";
import { readValue } from "../scripts/values/utils";

task("AutoBodyShop:setRegistry").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");
  const registryAddress = readValue("registry");

  // attatch AutoBodyShop
  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );
  const autoBodyShop: AutoBodyShop = await autoBodyShopFactory.attach(autoBodyShopProxyAddress);

  try {
    await autoBodyShop.setRegistry(registryAddress);
    console.log("AutoBodyShop:setRegistry success", registryAddress);
  } catch (err) {
    console.log("AutoBodyShop:setRegistry error", err);
  }
});

task("AutoBodyShop:setKittyKart").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");
  const kittyKartProxyAddress = readContractAddress("kittyKartProxy");

  // attatch AutoBodyShop
  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );
  const autoBodyShop: AutoBodyShop = await autoBodyShopFactory.attach(autoBodyShopProxyAddress);

  try {
    await autoBodyShop.setKittyKart(kittyKartProxyAddress);
    console.log("AutoBodyShop:setKittyKart success", kittyKartProxyAddress);
  } catch (err) {
    console.log("AutoBodyShop:setKittyKart error", err);
  }
});

task("AutoBodyShop:setKittyAsset").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");
  const kittyAssetProxyAddress = readContractAddress("kittyAssetProxy");

  // attatch AutoBodyShop
  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );
  const autoBodyShop: AutoBodyShop = await autoBodyShopFactory.attach(autoBodyShopProxyAddress);

  try {
    await autoBodyShop.setKittyAsset(kittyAssetProxyAddress);
    console.log("AutoBodyShop:setKittyAsset success", kittyAssetProxyAddress);
  } catch (err) {
    console.log("AutoBodyShop:setKittyAsset error", err);
  }
});

task("AutoBodyShop:applyAsset").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");

  // attatch AutoBodyShop
  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );
  const autoBodyShop: AutoBodyShop = await autoBodyShopFactory.attach(autoBodyShopProxyAddress);

  try {
    await autoBodyShop.applyAssets(0, [0]);
    console.log("AutoBodyShop:applyAsset success");
  } catch (err) {
    console.log("AutoBodyShop:applyAsset error", err);
  }
});
