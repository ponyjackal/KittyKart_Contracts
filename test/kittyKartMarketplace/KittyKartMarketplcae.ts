import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { ALICE_ADDRESS, DEPLOY_ADDRESS } from "../constants";
import type { Signers } from "../types";
import { shouldBehaveLikeKittyKartMarketplace } from "./KittyKartMarketplace.behavior";
import { deployKittyKartMarketplaceFixture } from "./KittyKartMarketplace.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    // impersonate account on goerli
    this.signers.deployer = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
    this.signers.alice = await ethers.getImpersonatedSigner(ALICE_ADDRESS); // alice has many KittyKarts and KittyAssets
    this.signers.bell = signers[0]; // bell has many KittyInu tokens
    this.signers.andy = signers[1];

    this.loadFixture = loadFixture;
  });

  describe("KittyKartMarketplace", function () {
    before(async function () {
      const { kittyKartGoKart, kittyKartAsset, kittyInu, kittyKartMarketplace } = await this.loadFixture(
        deployKittyKartMarketplaceFixture,
      );
      this.kittyKartGoKart = kittyKartGoKart;
      this.kittyKartAsset = kittyKartAsset;
      this.kittyInu = kittyInu;
      this.kittyKartMarketplace = kittyKartMarketplace;
    });

    shouldBehaveLikeKittyKartMarketplace();
  });
});
