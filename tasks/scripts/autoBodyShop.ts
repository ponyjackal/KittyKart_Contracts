import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { AutoBodyShop } from "../../src/types/contracts/AutoBodyShop";
import { AutoBodyShop__factory } from "../../src/types/factories/contracts/AutoBodyShop__factory";
import { readContractAddress } from "../deploy/addresses/utils";
import { readValue, writeValue } from "./values/utils";

task("AutoBodyShop:paint").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");

  // attatch AutoBodyShop
  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );
  const autoBodyShop: AutoBodyShop = await autoBodyShopFactory.attach(autoBodyShopProxyAddress);

  try {
    await autoBodyShop.paint(0, 0);
    console.log("AutoBodyShop:paint success");
  } catch (err) {
    console.log("AutoBodyShop:paint error", err);
  }
});
