import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyPaint__factory } from "../../src/types/factories/contracts/KittyPaint__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/kittyPaint";

task("deploy:KittyPaint").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const accounts: Signer[] = await ethers.getSigners();

  // deploy KittyPaint
  const kittyPaintFactory: KittyPaint__factory = <KittyPaint__factory>(
    await ethers.getContractFactory("KittyPaint", accounts[0])
  );
  const kittyPaintProxy = await upgrades.deployProxy(kittyPaintFactory, [
    cArguments.BASE_URI,
    cArguments.EXTERNAL_URL,
    cArguments.ROYALTY_RECEIVER,
  ]);
  await kittyPaintProxy.deployed();

  writeContractAddress("kittyPaintProxy", kittyPaintProxy.address);
  console.log("KittyPaint proxy deployed to: ", kittyPaintProxy.address);

  const kittyPaint = await upgrades.erc1967.getImplementationAddress(kittyPaintProxy.address);
  writeContractAddress("kittyPaint", kittyPaint);
  console.log("KittyPaint deployed to: ", kittyPaint);
});

task("upgrade:KittyPaint").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  console.log("--- start upgrading the KittyPaint Contract ---");
  const accounts: Signer[] = await ethers.getSigners();

  const kittyPaintFactory: KittyPaint__factory = <KittyPaint__factory>(
    await ethers.getContractFactory("KittyPaint", accounts[0])
  );

  const kittyPaintProxyAddress = readContractAddress("kittyPaintProxy");

  const upgraded = await upgrades.upgradeProxy(kittyPaintProxyAddress, kittyPaintFactory);

  console.log("KittyPaint upgraded to: ", upgraded.address);

  const impl = await upgrades.erc1967.getImplementationAddress(upgraded.address);
  console.log("Implementation :", impl);
});

task("verify:KittyPaint").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("kittyPaint");

  try {
    await run("verify:verify", {
      address,
      constructorArguments: [],
    });
  } catch (err) {
    console.log(err);
  }
});
