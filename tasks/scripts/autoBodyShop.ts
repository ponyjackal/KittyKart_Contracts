import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { AutoBodyShop } from "../../src/types/contracts/AutoBodyShop";
import { AutoBodyShop__factory } from "../../src/types/factories/contracts/AutoBodyShop__factory";
import { readContractAddress } from "../deploy/addresses/utils";
import { readValue } from "../scripts/values/utils";

/**
 * @note AutoBodyShop contract will be deprecated once we build out backend service for it
 */

task("AutoBodyShop:setRegistry").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");
  const registryAddress = readValue("registry");

  // attach AutoBodyShop
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

task("AutoBodyShop:setGameServer").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");
  const gameServerAddress = readValue("gameServer");

  // attach AutoBodyShop
  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );
  const autoBodyShop: AutoBodyShop = await autoBodyShopFactory.attach(autoBodyShopProxyAddress);

  try {
    await autoBodyShop.setGameServer(gameServerAddress);
    console.log("AutoBodyShop:setGameServer success", gameServerAddress);
  } catch (err) {
    console.log("AutoBodyShop:setGameServer error", err);
  }
});

task("AutoBodyShop:setKittyKartGoKart").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");
  const kittyKartGoKartProxyAddress = readContractAddress("kittyKartGoKartProxy");

  // attach AutoBodyShop
  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );
  const autoBodyShop: AutoBodyShop = await autoBodyShopFactory.attach(autoBodyShopProxyAddress);

  try {
    await autoBodyShop.setKittyKartGoKart(kittyKartGoKartProxyAddress);
    console.log("AutoBodyShop:setKittyKartGoKart success", kittyKartGoKartProxyAddress);
  } catch (err) {
    console.log("AutoBodyShop:setKittyKartGoKart error", err);
  }
});

task("AutoBodyShop:setKittyKartAsset").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");
  const kittyKartAssetProxyAddress = readContractAddress("kittyKartAssetProxy");

  // attach AutoBodyShop
  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );
  const autoBodyShop: AutoBodyShop = await autoBodyShopFactory.attach(autoBodyShopProxyAddress);

  try {
    await autoBodyShop.setKittyKartAsset(kittyKartAssetProxyAddress);
    console.log("AutoBodyShop:setKittyKartAsset success", kittyKartAssetProxyAddress);
  } catch (err) {
    console.log("AutoBodyShop:setKittyKartAsset error", err);
  }
});

task("AutoBodyShop:setKittyKartGoKartTableId").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");
  const kittyKartGoKartTableId = readValue("kittyKartGoKartTableId");

  // attach AutoBodyShop
  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );
  const autoBodyShop: AutoBodyShop = await autoBodyShopFactory.attach(autoBodyShopProxyAddress);

  try {
    await autoBodyShop.setKittyKartGoKartTableId(kittyKartGoKartTableId);
    console.log("AutoBodyShop:setKittyKartGoKartTableId success", kittyKartGoKartTableId);
  } catch (err) {
    console.log("AutoBodyShop:setKittyKartGoKartTableId error", err);
  }
});

task("AutoBodyShop:setKittyKartAssetAttributeTableId").setAction(async function (
  taskArguments: TaskArguments,
  { ethers },
) {
  const accounts: Signer[] = await ethers.getSigners();
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");
  const kittyKartAssetAttributeTableId = readValue("kittyKartAssetAttributeTableId");

  // attach AutoBodyShop
  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );
  const autoBodyShop: AutoBodyShop = await autoBodyShopFactory.attach(autoBodyShopProxyAddress);

  try {
    await autoBodyShop.setKittyKartAssetAttributeTableId(kittyKartAssetAttributeTableId);
    console.log("AutoBodyShop:setKittyKartAssetAttributeTableId success", kittyKartAssetAttributeTableId);
  } catch (err) {
    console.log("AutoBodyShop:setKittyKartAssetAttributeTableId error", err);
  }
});

// task("AutoBodyShop:applyAsset").setAction(async function (taskArguments: TaskArguments, { ethers }) {
//   const accounts: Signer[] = await ethers.getSigners();
//   const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");

//   // attach AutoBodyShop
//   const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
//     await ethers.getContractFactory("AutoBodyShop", accounts[0])
//   );
//   const autoBodyShop: AutoBodyShop = await autoBodyShopFactory.attach(autoBodyShopProxyAddress);

//   try {
//     await autoBodyShop.applyAssets(0, [0]);
//     console.log("AutoBodyShop:applyAsset success");
//   } catch (err) {
//     console.log("AutoBodyShop:applyAsset error", err);
//   }
// });
