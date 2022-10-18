import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { ALICE_ADDRESS, DEPLOY_ADDRESS, GAME_SERVER_ADDRESS } from "../constants";
import type { Signers } from "../types";
import { shouldBehaveLikeKittyKartAsset } from "./KittyKartAsset.behavior";
import { deployKittyKartAssetFixture } from "./KittyKartAsset.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    // impersonate account on goerli
    this.signers.deployer = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
    this.signers.gameServer = await ethers.getImpersonatedSigner(GAME_SERVER_ADDRESS);
    this.signers.alice = await ethers.getImpersonatedSigner(ALICE_ADDRESS);
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("kittyKartAsset", function () {
    beforeEach(async function () {
      const { kittyKartAsset } = await this.loadFixture(deployKittyKartAssetFixture);
      this.kittyKartAsset = kittyKartAsset;
    });

    shouldBehaveLikeKittyKartAsset();
  });
});
