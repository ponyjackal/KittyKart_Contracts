import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyKart__factory } from "../../src/types/factories/contracts/KittyKart__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/kittyKart";

task("deploy:KittyKart").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const accounts: Signer[] = await ethers.getSigners();

  // deploy KittyKart
  const kittyKartFactory: KittyKart__factory = <KittyKart__factory>(
    await ethers.getContractFactory("KittyKart", accounts[0])
  );
  const kittyKartProxy = await upgrades.deployProxy(kittyKartFactory, [
    cArguments.BASE_URI,
    cArguments.EXTERNAL_URL,
    cArguments.ROYALTY_RECEIVER,
  ]);
  await kittyKartProxy.deployed();

  writeContractAddress("kittyKartProxy", kittyKartProxy.address);
  console.log("KittyKart proxy deployed to: ", kittyKartProxy.address);

  const kittyKart = await upgrades.erc1967.getImplementationAddress(kittyKartProxy.address);
  writeContractAddress("kittyKart", kittyKart);
  console.log("KittyKart deployed to: ", kittyKart);
});

task("upgrade:KittyKart").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  console.log("--- start upgrading the KittyKart Contract ---");
  const accounts: Signer[] = await ethers.getSigners();

  const kittyKartFactory: KittyKart__factory = <KittyKart__factory>(
    await ethers.getContractFactory("KittyKart", accounts[0])
  );

  const kittyKartProxyAddress = readContractAddress("kittyKartProxy");

  const upgraded = await upgrades.upgradeProxy(kittyKartProxyAddress, kittyKartFactory);

  console.log("KittyKart upgraded to: ", upgraded.address);

  const impl = await upgrades.erc1967.getImplementationAddress(upgraded.address);
  console.log("Implementation :", impl);
});

task("verify:KittyKart").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("kittyKart");

  try {
    await run("verify:verify", {
      address,
      constructorArguments: [],
    });
  } catch (err) {
    console.log(err);
  }
});
