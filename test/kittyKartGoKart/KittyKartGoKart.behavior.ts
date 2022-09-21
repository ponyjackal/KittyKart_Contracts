import { expect } from "chai";

import { KART_EXTERNAL_URL, MARKET_PLACE_1, REGISTRY_ADDRESS } from "../constants";

export function shouldBehaveLikeKittyKartGoKart(): void {
  describe("CreateMetadataTable", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartGoKart.connect(this.signers.alice).createMetadataTable(REGISTRY_ADDRESS);
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update metadataTable and emit an event on metadata table creation", async function () {
      // create table
      const tx = this.kittyKartGoKart.createMetadataTable(REGISTRY_ADDRESS);
      // check events
      await expect(tx).to.be.emit(this.kittyKartGoKart, "CreateMetadataTable");
      const tableName = await this.kittyKartGoKart.metadataTable();
      expect(tableName).to.not.equal("");
    });
  });

  describe("setExternalURL", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartGoKart.connect(this.signers.alice).setExternalURL("test_external_url");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update externalUrl and emit an event on setExternalURL", async function () {
      const tx = this.kittyKartGoKart.setExternalURL("test_external_url");
      await expect(tx).to.be.emit(this.kittyKartGoKart, "SetExternalURL");
      expect(await this.kittyKartGoKart.externalURL()).to.equal("test_external_url");
    });
  });

  describe("setDescription", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartGoKart.connect(this.signers.alice).setDescription("test_description");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update externalUrl and emit an event", async function () {
      const tx = this.kittyKartGoKart.setDescription("test_description");
      await expect(tx).to.be.emit(this.kittyKartGoKart, "SetDescription");
      expect(await this.kittyKartGoKart.description()).to.equal("test_description");
    });
  });

  describe("setAssetAttributeTable", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartGoKart.connect(this.signers.alice).setAssetAttributeTable("test_asset_attribute_table");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update assetAttributeTable and emit an event", async function () {
      const tx = this.kittyKartGoKart.setAssetAttributeTable("test_asset_attribute_table");
      await expect(tx).to.be.emit(this.kittyKartGoKart, "SetAssetAttributeTable");
      expect(await this.kittyKartGoKart.assetAttributeTable()).to.equal("test_asset_attribute_table");
    });
  });

  describe("setBaseURI", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartGoKart.connect(this.signers.alice).setBaseURI("test_base_uri");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update baseURIString and emit an event", async function () {
      const tx = this.kittyKartGoKart.setBaseURI("test_base_uri");
      await expect(tx).to.be.emit(this.kittyKartGoKart, "SetBaseURI");
      expect(await this.kittyKartGoKart.baseURIString()).to.equal("test_base_uri");
    });
  });

  describe("setDefaultImage", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartGoKart.connect(this.signers.alice).setDefaultImage("test_default_image");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update defaultImage and emit an event", async function () {
      const tx = this.kittyKartGoKart.setDefaultImage("test_default_image");
      await expect(tx).to.be.emit(this.kittyKartGoKart, "SetDefaultImage");
      expect(await this.kittyKartGoKart.defaultImage()).to.equal("test_default_image");
    });
  });

  describe("setDefaultAnimationURL", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartGoKart.connect(this.signers.alice).setDefaultAnimationURL("test_default_animation_url");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update defaultAnimationURL and emit an event", async function () {
      const tx = this.kittyKartGoKart.setDefaultAnimationURL("test_default_animation_url");
      await expect(tx).to.be.emit(this.kittyKartGoKart, "SetDefaultAnimationURL");
      expect(await this.kittyKartGoKart.defaultAnimationURL()).to.equal("test_default_animation_url");
    });
  });

  describe("setImage", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartGoKart.connect(this.signers.alice).setImage(0, "test_image", "test_animation_url");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should be reverted for nonexistent tokenId", async function () {
      const tx = this.kittyKartGoKart.setImage(1000, "test_image", "test_animation_url");
      await expect(tx).to.be.revertedWith("Nonexistent token id");
    });

    it("should update emit an event for setImage", async function () {
      const tx = this.kittyKartGoKart.setImage(0, "test_image", "test_animation_url");
      await expect(tx).to.be.emit(this.kittyKartGoKart, "SetImage");
    });
  });

  describe("setBackgroundColor", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartGoKart.connect(this.signers.alice).setBackgroundColor(0, "ff0000");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should be reverted for nonexistent tokenId", async function () {
      const tx = this.kittyKartGoKart.setBackgroundColor(1000, "ff0000");
      await expect(tx).to.be.revertedWith("Nonexistent token id");
    });

    it("should emit an event for setBackgroundColor", async function () {
      const tx = this.kittyKartGoKart.setBackgroundColor(0, "ff0000");
      await expect(tx).to.be.emit(this.kittyKartGoKart, "SetBackgroundColor");
    });
  });

  describe("MarketplaceRestriction", async function () {
    it("should not allow approve if marketplace is not set", async function () {
      // approve
      const tx = this.kittyKartGoKart.connect(this.signers.alice).approve(MARKET_PLACE_1, 0);
      // check revert error
      await expect(tx).to.be.revertedWith("KittyKartGoKart: invalid Marketplace");
    });

    it("should not allow setApproveForAll if marketplace is not set", async function () {
      // approve
      const tx = this.kittyKartGoKart.connect(this.signers.alice).setApprovalForAll(MARKET_PLACE_1, true);
      // check revert error
      await expect(tx).to.be.revertedWith("KittyKartGoKart: invalid Marketplace");
    });

    it("should allow approve if restriction is not set", async function () {
      // remove restriction
      await this.kittyKartGoKart.connect(this.signers.deployer).setProtectionSettings(false);
      // approve
      await this.kittyKartGoKart.connect(this.signers.alice).approve(MARKET_PLACE_1, 0);
    });

    it("should not allow setApproveForAll if marketplace is not set and restriction is not set", async function () {
      // remove restriction
      await this.kittyKartGoKart.connect(this.signers.deployer).setProtectionSettings(false);
      // setApprovalForAll
      const tx = this.kittyKartGoKart.connect(this.signers.alice).setApprovalForAll(MARKET_PLACE_1, true);
      // check revert error
      await expect(tx).to.be.revertedWith("KittyKartGoKart: invalid Marketplace");
    });

    it("should allow approve if marketplace is set", async function () {
      // set restriction
      await this.kittyKartGoKart.connect(this.signers.deployer).setProtectionSettings(true);
      // set marketplace
      await this.kittyKartGoKart.connect(this.signers.deployer).setApprovedMarketplace(MARKET_PLACE_1, true);
      // approve
      await this.kittyKartGoKart.connect(this.signers.alice).approve(MARKET_PLACE_1, 0);
    });

    it("should allow setApproveForAll if marketplace is set", async function () {
      // set restriction
      await this.kittyKartGoKart.connect(this.signers.deployer).setProtectionSettings(true);
      // set marketplace
      await this.kittyKartGoKart.connect(this.signers.deployer).setApprovedMarketplace(MARKET_PLACE_1, true);
      // setApprovalForAll
      await this.kittyKartGoKart.connect(this.signers.alice).setApprovalForAll(MARKET_PLACE_1, true);
    });
  });
}
