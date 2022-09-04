import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { AutoBodyShop__factory } from "../../src/types/factories/contracts/AutoBodyShop__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/autoBodyShop";

task("deploy:AutoBodyShop").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const accounts: Signer[] = await ethers.getSigners();

  // deploy AutoBodyShop
  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );
  const autoBodyShopProxy = await upgrades.deployProxy(autoBodyShopFactory, [
    cArguments.KITYT_KART_ADDRESS,
    cArguments.KITYT_PAINT_ADDRESS,
    cArguments.REGISTRY_ADDRESS,
  ]);
  await autoBodyShopProxy.deployed();

  writeContractAddress("autoBodyShopProxy", autoBodyShopProxy.address);
  console.log("AutoBodyShop proxy deployed to: ", autoBodyShopProxy.address);

  const autoBodyShop = await upgrades.erc1967.getImplementationAddress(autoBodyShopProxy.address);
  writeContractAddress("autoBodyShop", autoBodyShop);
  console.log("AutoBodyShop deployed to: ", autoBodyShop);
});

task("upgrade:AutoBodyShop").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  console.log("--- start upgrading the AutoBodyShop Contract ---");
  const accounts: Signer[] = await ethers.getSigners();

  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );

  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");

  const upgraded = await upgrades.upgradeProxy(autoBodyShopProxyAddress, autoBodyShopFactory);

  console.log("AutoBodyShop upgraded to: ", upgraded.address);

  const autoBodyShop = await upgrades.erc1967.getImplementationAddress(upgraded.address);
  writeContractAddress("autoBodyShop", autoBodyShop);
  console.log("Implementation :", autoBodyShop);
});

task("verify:AutoBodyShop").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("autoBodyShop");

  await run("verify:verify", {
    address,
    constructorArguments: [],
  });
});
