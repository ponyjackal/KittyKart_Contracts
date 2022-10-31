import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyInu__factory } from "../../src/types/factories/contracts/KittyInu__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";

task("deploy:KittyInu").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const accounts: Signer[] = await ethers.getSigners();

  // deploy KittyInu
  const kittyInuFactory: KittyInu__factory = <KittyInu__factory>(
    await ethers.getContractFactory("KittyInu", accounts[0])
  );
  const kittyInuProxy = await upgrades.deployProxy(kittyInuFactory, []);
  await kittyInuProxy.deployed();

  writeContractAddress("kittyInuProxy", kittyInuProxy.address);
  console.log("KittyInu proxy deployed to: ", kittyInuProxy.address);

  const kittyInu = await upgrades.erc1967.getImplementationAddress(kittyInuProxy.address);
  writeContractAddress("kittyInu", kittyInu);
  console.log("KittyInu deployed to: ", kittyInu);
});

task("upgrade:KittyInu").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  console.log("--- start upgrading the KittyInu Contract ---");
  const accounts: Signer[] = await ethers.getSigners();

  const kittyInuFactory: KittyInu__factory = <KittyInu__factory>(
    await ethers.getContractFactory("KittyInu", accounts[0])
  );

  const kittyInuProxyAddress = readContractAddress("kittyInuProxy");

  const upgraded = await upgrades.upgradeProxy(kittyInuProxyAddress, kittyInuFactory);

  console.log("KittyInu upgraded to: ", upgraded.address);

  const kittyInu = await upgrades.erc1967.getImplementationAddress(upgraded.address);
  writeContractAddress("kittyInu", kittyInu);
  console.log("Implementation :", kittyInu);
});

task("verify:KittyInu").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("kittyInu");

  try {
    await run("verify:verify", {
      address,
      constructorArguments: [],
    });
  } catch (err) {
    console.log(err);
  }
});
