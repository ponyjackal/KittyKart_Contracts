import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { ALICE_ADDRESS, DEPLOY_ADDRESS } from "../constants";
import { deployKittyKartAssetFixture } from "../kittyKartAsset/KittyKartAsset.fixture";
import { deployKittyKartGoKartFixture } from "../kittyKartGoKart/KittyKartGoKart.fixture";
import type { Signers } from "../types";
import { shouldBehaveLikeKittyKartMarketplace } from "./KittyKartMarketplace.behavior";
import { deployKittyKartMarketplaceFixture } from "./KittyKartMarketplace.fixture";

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

  describe("KittyKartMarketplace", function () {
    beforeEach(async function () {
      const { kittyKartGoKart } = await this.loadFixture(deployKittyKartGoKartFixture);
      this.kittyKartGoKart = kittyKartGoKart;

      const { kittyKartAsset } = await this.loadFixture(deployKittyKartAssetFixture);
      this.kittyKartAsset = kittyKartAsset;

      const { kittyKartMarketplace } = await this.loadFixture(deployKittyKartMarketplaceFixture);
      this.kittyKartMarketplace = kittyKartMarketplace;

      // set KittyKartGoKart address
      await this.kittyKartMarketplace.connect(this.signers.deployer).setKittyKartGoKart(this.kittyKartGoKart.address);
      // set KittyKartAsset address
      await this.kittyKartMarketplace.connect(this.signers.deployer).setKittyKartAsset(this.kittyKartAsset.address);
      // set assetAttribute table in KittyKartGoKart
      const assetAttributeTable = await this.kittyKartAsset.attributeTable();
      await this.kittyKartGoKart.connect(this.signers.deployer).setAssetAttributeTable(assetAttributeTable);
      // add kittyKartMarketplace to approved marketplaces
      await this.kittyKartAsset
        .connect(this.signers.deployer)
        .setApprovedMarketplace(this.kittyKartMarketplace.address, true);
      // alice has some karts and assets tokens
      // approve asset tokens to kittyKartMarketplace
      await this.kittyKartGoKart.connect(this.signers.alice).setApprovalForAll(this.kittyKartMarketplace.address, true);
      await this.kittyKartAsset.connect(this.signers.alice).setApprovalForAll(this.kittyKartMarketplace.address, true);
    });

    shouldBehaveLikeKittyKartMarketplace();
  });
});
