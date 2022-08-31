import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyKart } from "../../src/types/contracts/KittyKart";
import { KittyKart__factory } from "../../src/types/factories/contracts/KittyKart__factory";
import { readContractAddress } from "../deploy/addresses/utils";
import { readValue, writeValue } from "./values/utils";

task("KittyKart:createMetadataTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartProxyAddress = readContractAddress("kittyKartProxy");
  const registryAddress = readValue("registry");

  // attatch KittyKart
  const kittyKartFactory: KittyKart__factory = <KittyKart__factory>(
    await ethers.getContractFactory("KittyKart", accounts[0])
  );
  const kittyKart: KittyKart = await kittyKartFactory.attach(kittyKartProxyAddress);

  try {
    const kittyKartTableId = await kittyKart.createMetadataTable(registryAddress);
    console.log("kittyKartTableId", kittyKartTableId);
    writeValue("kittyKartTableId", kittyKartTableId);
    console.log("KittyKart:createMetadataTable success");
  } catch (err) {
    console.log("KittyKart:createMetadataTable error", err);
  }
});
