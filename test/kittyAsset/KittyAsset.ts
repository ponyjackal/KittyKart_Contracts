import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { DEPLOY_ADDRESS } from "../constants";
import type { Signers } from "../types";
import { deploykittyAssetFixture } from "./KittyAsset.fixture";
import { shouldBehaveLikekittyAsset } from "./kittyAsset.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    // impersonate account on goerli
    this.signers.deployer = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("kittyAsset", function () {
    beforeEach(async function () {
      const { kittyAsset } = await this.loadFixture(deploykittyAssetFixture);
      this.kittyAsset = kittyAsset;
    });

    shouldBehaveLikekittyAsset();
  });
});
