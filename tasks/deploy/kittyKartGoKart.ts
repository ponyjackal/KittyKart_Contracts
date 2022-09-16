import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyKartGoKart__factory } from "../../src/types/factories/contracts/KittyKartGoKart__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/kittyKartGoKart";

task("deploy:KittyKartGoKart").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const accounts: Signer[] = await ethers.getSigners();

  // deploy KittyKartGoKart
  const kittyKartGoKartFactory: KittyKartGoKart__factory = <KittyKartGoKart__factory>(
    await ethers.getContractFactory("KittyKartGoKart", accounts[0])
  );
  const kittyKartGoKartProxy = await upgrades.deployProxy(kittyKartGoKartFactory, [
    cArguments.BASE_URI,
    cArguments.DESCRIPTION,
    cArguments.IMAGE,
    cArguments.ANIMATION_URL,
    cArguments.EXTERNAL_URL,
    cArguments.ROYALTY_RECEIVER,
  ]);
  await kittyKartGoKartProxy.deployed();

  writeContractAddress("kittyKartGoKartProxy", kittyKartGoKartProxy.address);
  console.log("KittyKartGoKart proxy deployed to: ", kittyKartGoKartProxy.address);

  const kittyKartGoKart = await upgrades.erc1967.getImplementationAddress(kittyKartGoKartProxy.address);
  writeContractAddress("kittyKartGoKart", kittyKartGoKart);
  console.log("KittyKartGoKart deployed to: ", kittyKartGoKart);
});

task("upgrade:KittyKartGoKart").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  console.log("--- start upgrading the KittyKartGoKart Contract ---");
  const accounts: Signer[] = await ethers.getSigners();

  const kittyKartGoKartFactory: KittyKartGoKart__factory = <KittyKartGoKart__factory>(
    await ethers.getContractFactory("KittyKartGoKart", accounts[0])
  );

  const kittyKartGoKartProxyAddress = readContractAddress("kittyKartGoKartProxy");

  const upgraded = await upgrades.upgradeProxy(kittyKartGoKartProxyAddress, kittyKartGoKartFactory);

  console.log("KittyKartGoKart upgraded to: ", upgraded.address);

  const kittyKartGoKart = await upgrades.erc1967.getImplementationAddress(upgraded.address);
  writeContractAddress("kittyKartGoKart", kittyKartGoKart);
  console.log("Implementation :", kittyKartGoKart);
});

task("verify:KittyKartGoKart").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("kittyKartGoKart");

  try {
    await run("verify:verify", {
      address,
      constructorArguments: [],
    });
  } catch (err) {
    console.log(err);
  }
});
