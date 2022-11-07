import { expect } from "chai";

import { KART_EXTERNAL_URL, MARKET_PLACE_1, REGISTRY_ADDRESS } from "../constants";

export function shouldBehaveLikeKittyKartMarketplace(): void {
  describe("CreateMetadataTable", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).createMetadataTable(REGISTRY_ADDRESS);
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update metadataTable and emit an event on metadata table creation", async function () {
      // create table
      const tx = this.kittyKartMarketplace.createMetadataTable(REGISTRY_ADDRESS);
      // check events
      await expect(tx).to.be.emit(this.kittyKartMarketplace, "CreateMetadataTable");
      const tableName = await this.kittyKartMarketplace.metadataTable();
      expect(tableName).to.not.equal("");
    });
  });

  describe("setExternalURL", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).setExternalURL("test_external_url");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update externalUrl and emit an event on setExternalURL", async function () {
      const tx = this.kittyKartMarketplace.setExternalURL("test_external_url");
      await expect(tx).to.be.emit(this.kittyKartMarketplace, "SetExternalURL");
      expect(await this.kittyKartMarketplace.externalURL()).to.equal("test_external_url");
    });
  });

  describe("setDescription", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).setDescription("test_description");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update externalUrl and emit an event", async function () {
      const tx = this.kittyKartMarketplace.setDescription("test_description");
      await expect(tx).to.be.emit(this.kittyKartMarketplace, "SetDescription");
      expect(await this.kittyKartMarketplace.description()).to.equal("test_description");
    });
  });

  describe("setAssetAttributeTable", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartMarketplace
        .connect(this.signers.alice)
        .setAssetAttributeTable("test_asset_attribute_table");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update assetAttributeTable and emit an event", async function () {
      const tx = this.kittyKartMarketplace.setAssetAttributeTable("test_asset_attribute_table");
      await expect(tx).to.be.emit(this.kittyKartMarketplace, "SetAssetAttributeTable");
      expect(await this.kittyKartMarketplace.assetAttributeTable()).to.equal("test_asset_attribute_table");
    });
  });

  describe("grantAccess", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartMarketplace
        .connect(this.signers.alice)
        .grantAccess("0xFB6c5feE537344Db0f585d65C684fbc2A800d0a8");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update externalUrl and emit an event on setExternalURL", async function () {
      const tx = this.kittyKartMarketplace.grantAccess("0xFB6c5feE537344Db0f585d65C684fbc2A800d0a8");
      await expect(tx).to.be.emit(this.kittyKartMarketplace, "AccessGranted");
    });
  });

  describe("revokeAccess", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartMarketplace
        .connect(this.signers.alice)
        .revokeAccess("0xFB6c5feE537344Db0f585d65C684fbc2A800d0a8");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update externalUrl and emit an event on setExternalURL", async function () {
      const tx = this.kittyKartMarketplace.revokeAccess("0xFB6c5feE537344Db0f585d65C684fbc2A800d0a8");
      await expect(tx).to.be.emit(this.kittyKartMarketplace, "AccessRevoked");
    });
  });

  describe("setBaseURI", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).setBaseURI("test_base_uri");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update baseURIString and emit an event", async function () {
      const tx = this.kittyKartMarketplace.setBaseURI("test_base_uri");
      await expect(tx).to.be.emit(this.kittyKartMarketplace, "SetBaseURI");
      expect(await this.kittyKartMarketplace.baseURIString()).to.equal("test_base_uri");
    });
  });

  describe("setDefaultImage", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).setDefaultImage("test_default_image");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update defaultImage and emit an event", async function () {
      const tx = this.kittyKartMarketplace.setDefaultImage("test_default_image");
      await expect(tx).to.be.emit(this.kittyKartMarketplace, "SetDefaultImage");
      expect(await this.kittyKartMarketplace.defaultImage()).to.equal("test_default_image");
    });
  });

  describe("setDefaultAnimationURL", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartMarketplace
        .connect(this.signers.alice)
        .setDefaultAnimationURL("test_default_animation_url");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update defaultAnimationURL and emit an event", async function () {
      const tx = this.kittyKartMarketplace.setDefaultAnimationURL("test_default_animation_url");
      await expect(tx).to.be.emit(this.kittyKartMarketplace, "SetDefaultAnimationURL");
      expect(await this.kittyKartMarketplace.defaultAnimationURL()).to.equal("test_default_animation_url");
    });
  });

  describe("setImage", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).setImage(0, "test_image", "test_animation_url");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should be reverted for nonexistent tokenId", async function () {
      const tx = this.kittyKartMarketplace.setImage(1000, "test_image", "test_animation_url");
      await expect(tx).to.be.revertedWith("KittyKartMarketplace: nonexistent token id");
    });

    it("should update emit an event for setImage", async function () {
      const tx = this.kittyKartMarketplace.setImage(0, "test_image", "test_animation_url");
      await expect(tx).to.be.emit(this.kittyKartMarketplace, "SetImage");
    });
  });

  describe("setBackgroundColor", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).setBackgroundColor(0, "ff0000");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should be reverted for nonexistent tokenId", async function () {
      const tx = this.kittyKartMarketplace.setBackgroundColor(1000, "ff0000");
      await expect(tx).to.be.revertedWith("KittyKartMarketplace: nonexistent token id");
    });

    it("should emit an event for setBackgroundColor", async function () {
      const tx = this.kittyKartMarketplace.setBackgroundColor(0, "ff0000");
      await expect(tx).to.be.emit(this.kittyKartMarketplace, "SetBackgroundColor");
    });
  });

  describe("isApprovedAll", async function () {
    it("should return true for autoBodyShopAddress operator", async function () {
      await this.kittyKartMarketplace.setAutoBodyShop(this.signers.andy.address);
      expect(
        await this.kittyKartMarketplace.isApprovedForAll(this.signers.alice.address, this.signers.andy.address),
      ).to.be.equal(true);
    });

    it("should return false for other operator addresses", async function () {
      await this.kittyKartMarketplace.setAutoBodyShop(this.signers.andy.address);
      expect(
        await this.kittyKartMarketplace.isApprovedForAll(this.signers.alice.address, this.signers.admin.address),
      ).to.be.equal(false);
    });
  });

  describe("MarketplaceRestriction", async function () {
    it("should not allow approve if marketplace is not set", async function () {
      // approve
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).approve(MARKET_PLACE_1, 0);
      // check revert error
      await expect(tx).to.be.revertedWith("KittyKartMarketplace: invalid Marketplace");
    });

    it("should not allow setApproveForAll if marketplace is not set", async function () {
      // approve
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).setApprovalForAll(MARKET_PLACE_1, true);
      // check revert error
      await expect(tx).to.be.revertedWith("KittyKartMarketplace: invalid Marketplace");
    });

    it("should allow approve if restriction is not set", async function () {
      // remove restriction
      await this.kittyKartMarketplace.connect(this.signers.deployer).setProtectionSettings(false);
      // approve
      await this.kittyKartMarketplace.connect(this.signers.alice).approve(MARKET_PLACE_1, 0);
    });

    it("should not allow setApproveForAll if marketplace is not set and restriction is not set", async function () {
      // remove restriction
      await this.kittyKartMarketplace.connect(this.signers.deployer).setProtectionSettings(false);
      // setApprovalForAll
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).setApprovalForAll(MARKET_PLACE_1, true);
      // check revert error
      await expect(tx).to.be.revertedWith("KittyKartMarketplace: invalid Marketplace");
    });

    it("should allow approve if marketplace is set", async function () {
      // set restriction
      await this.kittyKartMarketplace.connect(this.signers.deployer).setProtectionSettings(true);
      // set marketplace
      await this.kittyKartMarketplace.connect(this.signers.deployer).setApprovedMarketplace(MARKET_PLACE_1, true);
      // approve
      await this.kittyKartMarketplace.connect(this.signers.alice).approve(MARKET_PLACE_1, 0);
    });

    it("should allow setApproveForAll if marketplace is set", async function () {
      // set restriction
      await this.kittyKartMarketplace.connect(this.signers.deployer).setProtectionSettings(true);
      // set marketplace
      await this.kittyKartMarketplace.connect(this.signers.deployer).setApprovedMarketplace(MARKET_PLACE_1, true);
      // setApprovalForAll
      await this.kittyKartMarketplace.connect(this.signers.alice).setApprovalForAll(MARKET_PLACE_1, true);
    });
  });
}
