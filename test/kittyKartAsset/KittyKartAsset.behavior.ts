import { expect } from "chai";

import { MARKET_PLACE_1, REGISTRY_ADDRESS } from "../constants";

export function shouldBehaveLikekittyKartAsset(): void {
  describe("CreateMetadataTable", async function () {
    it("should create metadata table", async function () {
      // create table
      await this.kittyKartAsset.createMetadataTable(REGISTRY_ADDRESS);
      // check table name
      const tableName = await this.kittyKartAsset.metadataTable();
      expect(tableName).to.not.equal("");
    });

    it("should emit an event on metadata table creation", async function () {
      // create table
      const tx = this.kittyKartAsset.createMetadataTable(REGISTRY_ADDRESS);
      // check events
      await expect(tx).to.be.emit(this.kittyKartAsset, "CreateMetadataTable");
    });
  });

  describe("MarketplaceRestriction", async function () {
    it("should not allow approve if marketplace is not set", async function () {
      // approve
      const tx = this.kittyKartAsset.connect(this.signers.alice).approve(MARKET_PLACE_1, 0);
      // check revert error
      await expect(tx).to.be.revertedWith("KittyKartAsset: invalid Marketplace");
    });

    it("should not allow setApproveForAll if marketplace is not set", async function () {
      // approve
      const tx = this.kittyKartAsset.connect(this.signers.alice).setApprovalForAll(MARKET_PLACE_1, true);
      // check revert error
      await expect(tx).to.be.revertedWith("KittyKartAsset: invalid Marketplace");
    });

    it("should allow approve if restriction is not set", async function () {
      // remove restriction
      await this.kittyKartAsset.connect(this.signers.deployer).setProtectionSettings(false);
      // approve
      await this.kittyKartAsset.connect(this.signers.alice).approve(MARKET_PLACE_1, 0);
    });

    it("should not allow setApproveForAll if marketplace is not set and restriction is not set", async function () {
      // remove restriction
      await this.kittyKartAsset.connect(this.signers.deployer).setProtectionSettings(false);
      // setApprovalForAll
      const tx = this.kittyKartAsset.connect(this.signers.alice).setApprovalForAll(MARKET_PLACE_1, true);
      // check revert error
      await expect(tx).to.be.revertedWith("KittyKartAsset: invalid Marketplace");
    });

    it("should allow approve if marketplace is set", async function () {
      // set restriction
      await this.kittyKartAsset.connect(this.signers.deployer).setProtectionSettings(true);
      // set marketplace
      await this.kittyKartAsset.connect(this.signers.deployer).setApprovedMarketplace(MARKET_PLACE_1, true);
      // approve
      await this.kittyKartAsset.connect(this.signers.alice).approve(MARKET_PLACE_1, 0);
    });

    it("should allow setApproveForAll if marketplace is set", async function () {
      // set restriction
      await this.kittyKartAsset.connect(this.signers.deployer).setProtectionSettings(true);
      // set marketplace
      await this.kittyKartAsset.connect(this.signers.deployer).setApprovedMarketplace(MARKET_PLACE_1, true);
      // setApprovalForAll
      await this.kittyKartAsset.connect(this.signers.alice).setApprovalForAll(MARKET_PLACE_1, true);
    });
  });
}
