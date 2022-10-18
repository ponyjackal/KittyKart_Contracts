import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { createFixtureLoader } from "ethereum-waffle";
import { ethers } from "hardhat";

import { ALICE_ADDRESS, DEPLOY_ADDRESS, REGISTRY_ADDRESS } from "../constants";
import { deployKittyKartAssetFixture } from "../kittyKartAsset/KittyKartAsset.fixture";
import { deployKittyKartGoKartFixture } from "../kittyKartGoKart/KittyKartGoKart.fixture";
import type { Signers } from "../types";
import { shouldBehaveLikeAutoBodyShop } from "./AutoBodyShop.behavior";
import { deployAutoBodyShopFixture } from "./AutoBodyShop.fixture";

/**
 * @note AutoBodyShop contract will be deprecated once we build out backend service for it
 */

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    // impersonate account on mainnet
    this.signers.deployer = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
    this.signers.alice = await ethers.getImpersonatedSigner(ALICE_ADDRESS);
    this.signers.admin = signers[0];
    this.signers.gameServer = signers[1];

    this.loadFixture = loadFixture;
  });

  describe("AutoBodyShop", function () {
    before(async function () {
      const { kittyKartGoKart } = await this.loadFixture(deployKittyKartGoKartFixture);
      this.kittyKartGoKart = kittyKartGoKart;

      const { kittyKartAsset } = await this.loadFixture(deployKittyKartAssetFixture);
      this.kittyKartAsset = kittyKartAsset;

      const { autoBodyShop } = await this.loadFixture(deployAutoBodyShopFixture);
      this.autoBodyShop = autoBodyShop;
      // set KittyKartGoKart address
      await this.autoBodyShop.connect(this.signers.deployer).setKittyKartGoKart(this.kittyKartGoKart.address);
      // set KittyKartAsset address
      await this.autoBodyShop.connect(this.signers.deployer).setKittyKartAsset(this.kittyKartAsset.address);
      // set assetAttribute table in KittyKartGoKart
      const assetAttributeTable = await this.kittyKartAsset.attributeTable();
      await this.kittyKartGoKart.connect(this.signers.deployer).setAssetAttributeTable(assetAttributeTable);
      // add AutoBodyShop to approved marketplaces
      await this.kittyKartAsset.connect(this.signers.deployer).setApprovedMarketplace(this.autoBodyShop.address, true);
      // approve asset tokens to AutoBodyShop
      await this.kittyKartAsset.connect(this.signers.alice).setApprovalForAll(this.autoBodyShop.address, true);
    });

    shouldBehaveLikeAutoBodyShop();
  });
});
