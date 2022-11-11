import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyKartMarketplace__factory } from "../../src/types/factories/contracts/KittyKartMarketplace__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/kittyKartMarketplace";

task("deploy:KittyKartMarketplace").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const accounts: Signer[] = await ethers.getSigners();

  // deploy KittyKartMarketplace
  const kittyKartMarketplaceFactory: KittyKartMarketplace__factory = <KittyKartMarketplace__factory>(
    await ethers.getContractFactory("KittyKartMarketplace", accounts[0])
  );
  const kittyKartMarketplaceProxy = await upgrades.deployProxy(kittyKartMarketplaceFactory, [
    cArguments.KITTY_KART_GO_KART_ADDRESS,
    cArguments.KITTY_KART_ASSET_ADDRESS,
    cArguments.KITTY_INU_ADDRESS,
  ]);
  await kittyKartMarketplaceProxy.deployed();

  writeContractAddress("kittyKartMarketplaceProxy", kittyKartMarketplaceProxy.address);
  console.log("KittyKartMarketplace proxy deployed to: ", kittyKartMarketplaceProxy.address);

  const kittyKartMarketplace = await upgrades.erc1967.getImplementationAddress(kittyKartMarketplaceProxy.address);
  writeContractAddress("kittyKartMarketplace", kittyKartMarketplace);
  console.log("KittyKartMarketplace deployed to: ", kittyKartMarketplace);
});

task("upgrade:KittyKartMarketplace").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  console.log("--- start upgrading the KittyKartMarketplace Contract ---");
  const accounts: Signer[] = await ethers.getSigners();

  const kittyKartMarketplaceFactory: KittyKartMarketplace__factory = <KittyKartMarketplace__factory>(
    await ethers.getContractFactory("KittyKartMarketplace", accounts[0])
  );

  const kittyKartMarketplaceProxyAddress = readContractAddress("kittyKartMarketplaceProxy");

  const upgraded = await upgrades.upgradeProxy(kittyKartMarketplaceProxyAddress, kittyKartMarketplaceFactory);

  console.log("KittyKartMarketplace upgraded to: ", upgraded.address);

  const kittyKartMarketplace = await upgrades.erc1967.getImplementationAddress(upgraded.address);
  writeContractAddress("kittyKartMarketplace", kittyKartMarketplace);
  console.log("Implementation :", kittyKartMarketplace);
});

task("verify:KittyKartMarketplace").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("kittyKartMarketplace");

  try {
    await run("verify:verify", {
      address,
      constructorArguments: [],
    });
  } catch (err) {
    console.log(err);
  }
});
