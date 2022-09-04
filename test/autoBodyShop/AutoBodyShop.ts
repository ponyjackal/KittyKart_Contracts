import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { createFixtureLoader } from "ethereum-waffle";
import { ethers } from "hardhat";

import { DEPLOY_ADDRESS, REGISTRY_ADDRESS } from "../constants";
import { deploykittyAssetFixture } from "../kittyAsset/KittyAsset.fixture";
import { deployKittyKartFixture } from "../kittyKart/KittyKart.fixture";
import type { Signers } from "../types";
import { shouldBehaveLikeAutoBodyShop } from "./AutoBodyShop.behavior";
import { deployAutoBodyShopFixture } from "./AutoBodyShop.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    // impersonate account on mainnet
    this.signers.deployer = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("AutoBodyShop", function () {
    beforeEach(async function () {
      const { kittyKart } = await this.loadFixture(deployKittyKartFixture);
      this.kittyKart = kittyKart;

      const { kittyAsset } = await this.loadFixture(deploykittyAssetFixture);
      this.kittyAsset = kittyAsset;

      const { autoBodyShop } = await this.loadFixture(deployAutoBodyShopFixture);
      this.autoBodyShop = autoBodyShop;
    });

    shouldBehaveLikeAutoBodyShop();
  });
});
