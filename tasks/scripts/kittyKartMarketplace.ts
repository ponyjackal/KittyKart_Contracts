import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyKartMarketplace } from "../../src/types/contracts/KittyKartMarketplace";
import { KittyKartMarketplace__factory } from "../../src/types/factories/contracts/KittyKartMarketplace__factory";
import { readContractAddress } from "../deploy/addresses/utils";
import { readValue } from "./values/utils";

task("KittyKartMarketplace:setGameServer").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartMarketplaceProxyAddress = readContractAddress("kittyKartMarketplaceProxy");
  const gameServerAddress = readValue("gameServer");

  // attach KittyKartMarketplace
  const kittyKartMarketplaceFactory: KittyKartMarketplace__factory = <KittyKartMarketplace__factory>(
    await ethers.getContractFactory("KittyKartMarketplace", accounts[0])
  );
  const kittyKartMarketplace: KittyKartMarketplace = await kittyKartMarketplaceFactory.attach(
    kittyKartMarketplaceProxyAddress,
  );

  try {
    await kittyKartMarketplace.setGameServer(gameServerAddress);
    console.log("KittyKartMarketplace:setGameServer success");
  } catch (err) {
    console.log("KittyKartMarketplace:setGameServer error", err);
  }
});

task("KittyKartMarketplace:setKittyKartGoKart").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartMarketplaceProxyAddress = readContractAddress("kittyKartMarketplaceProxy");
  const kittyKartGoKartProxyAddress = readContractAddress("kittyKartGoKartProxy");

  // attach KittyKartMarketplace
  const kittyKartMarketplaceFactory: KittyKartMarketplace__factory = <KittyKartMarketplace__factory>(
    await ethers.getContractFactory("KittyKartMarketplace", accounts[0])
  );
  const kittyKartMarketplace: KittyKartMarketplace = await kittyKartMarketplaceFactory.attach(
    kittyKartMarketplaceProxyAddress,
  );

  try {
    await kittyKartMarketplace.setKittyKartGoKart(kittyKartGoKartProxyAddress);
    console.log("KittyKartMarketplace:setKittyKartGoKart success");
  } catch (err) {
    console.log("KittyKartMarketplace:setKittyKartGoKart error", err);
  }
});

task("KittyKartMarketplace:setKittyKartAsset").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartMarketplaceProxyAddress = readContractAddress("kittyKartMarketplaceProxy");
  const kittyKartAssetProxyAddress = readContractAddress("kittyKartAssetProxy");

  // attach KittyKartMarketplace
  const kittyKartMarketplaceFactory: KittyKartMarketplace__factory = <KittyKartMarketplace__factory>(
    await ethers.getContractFactory("KittyKartMarketplace", accounts[0])
  );
  const kittyKartMarketplace: KittyKartMarketplace = await kittyKartMarketplaceFactory.attach(
    kittyKartMarketplaceProxyAddress,
  );

  try {
    await kittyKartMarketplace.setKittyKartAsset(kittyKartAssetProxyAddress);
    console.log("KittyKartMarketplace:setKittyKartAsset success");
  } catch (err) {
    console.log("KittyKartMarketplace:setKittyKartAsset error", err);
  }
});
