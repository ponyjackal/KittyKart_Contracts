import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { ALICE_ADDRESS, DEPLOY_ADDRESS } from "../constants";
import type { Signers } from "../types";
import { shouldBehaveLikeKittyKartGoKart } from "./KittyKartGoKart.behavior";
import { deployKittyKartGoKartFixture } from "./KittyKartGoKart.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    // impersonate account on goerli
    this.signers.deployer = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
    this.signers.alice = await ethers.getImpersonatedSigner(ALICE_ADDRESS);
    this.signers.admin = signers[0];
    this.signers.andy = signers[1];

    this.loadFixture = loadFixture;
  });

  describe("KittyKartGoKart", function () {
    beforeEach(async function () {
      const { kittyKartGoKart } = await this.loadFixture(deployKittyKartGoKartFixture);
      this.kittyKartGoKart = kittyKartGoKart;
    });

    shouldBehaveLikeKittyKartGoKart();
  });
});
