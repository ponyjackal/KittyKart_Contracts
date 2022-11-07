import { expect } from "chai";

import { GAME_SERVER_ADDRESS, MARKET_PLACE_1, REGISTRY_ADDRESS, ZERO_ADDRESS } from "../constants";

export function shouldBehaveLikeKittyKartAsset(): void {
  describe("CreateMetadataTable", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartAsset.connect(this.signers.alice).createMetadataTable(REGISTRY_ADDRESS);
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update metadataTable and emit an event on metadata table creation", async function () {
      // create table
      const tx = this.kittyKartAsset.createMetadataTable(REGISTRY_ADDRESS);
      // check events
      await expect(tx).to.be.emit(this.kittyKartAsset, "CreateMetadataTable");
      const tableName = await this.kittyKartAsset.metadataTable();
      expect(tableName).to.not.equal("");
    });
  });

  describe("setExternalURL", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartAsset.connect(this.signers.alice).setExternalURL("test_external_url");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update externalUrl and emit an event on setExternalURL", async function () {
      const tx = this.kittyKartAsset.setExternalURL("test_external_url");
      await expect(tx).to.be.emit(this.kittyKartAsset, "SetExternalURL");
      expect(await this.kittyKartAsset.externalURL()).to.equal("test_external_url");
    });
  });

  describe("setDescription", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartAsset.connect(this.signers.alice).setDescription("test_description");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update externalUrl and emit an event", async function () {
      const tx = this.kittyKartAsset.setDescription("test_description");
      await expect(tx).to.be.emit(this.kittyKartAsset, "SetDescription");
      expect(await this.kittyKartAsset.description()).to.equal("test_description");
    });
  });

  describe("setBaseURI", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartAsset.connect(this.signers.alice).setBaseURI("test_base_uri");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update baseURIString and emit an event", async function () {
      const tx = this.kittyKartAsset.setBaseURI("test_base_uri");
      await expect(tx).to.be.emit(this.kittyKartAsset, "SetBaseURI");
      expect(await this.kittyKartAsset.baseURIString()).to.equal("test_base_uri");
    });
  });

  describe("setImage", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartAsset.connect(this.signers.alice).setImage(0, "test_image", "test_animation_url");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should be reverted for nonexistent tokenId", async function () {
      const tx = this.kittyKartAsset.setImage(1000, "test_image", "test_animation_url");
      await expect(tx).to.be.revertedWith("KittyKartAsset: nonexistent token id");
    });

    it("should emit an event for setImage", async function () {
      const tx = this.kittyKartAsset.setImage(0, "test_image", "test_animation_url");
      await expect(tx).to.be.emit(this.kittyKartAsset, "SetImage");
    });
  });

  describe("setBackgroundColor", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartAsset.connect(this.signers.alice).setBackgroundColor(0, "ff0000");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should be reverted for nonexistent tokenId", async function () {
      const tx = this.kittyKartAsset.setBackgroundColor(1000, "ff0000");
      await expect(tx).to.be.revertedWith("KittyKartAsset: nonexistent token id");
    });

    it("should emit an event for setBackgroundColor", async function () {
      const tx = this.kittyKartAsset.setBackgroundColor(0, "ff0000");
      await expect(tx).to.be.emit(this.kittyKartAsset, "SetBackgroundColor");
    });
  });

  describe("setGameServer", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartAsset.connect(this.signers.alice).setGameServer(GAME_SERVER_ADDRESS);
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should be reverted for zero address", async function () {
      const tx = this.kittyKartAsset.setGameServer(ZERO_ADDRESS);
      await expect(tx).to.be.revertedWith("KittyKartAsset: invalid game server address");
    });

    it("should update gameServer and emit an event", async function () {
      const tx = this.kittyKartAsset.setGameServer(GAME_SERVER_ADDRESS);
      await expect(tx).to.be.emit(this.kittyKartAsset, "SetGameServer");
    });
  });

  describe("grantAccess", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartAsset
        .connect(this.signers.alice)
        .grantAccess("0xFB6c5feE537344Db0f585d65C684fbc2A800d0a8");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update externalUrl and emit an event on setExternalURL", async function () {
      const tx = this.kittyKartAsset.grantAccess("0xFB6c5feE537344Db0f585d65C684fbc2A800d0a8");
      await expect(tx).to.be.emit(this.kittyKartAsset, "AccessGranted");
    });
  });

  describe("revokeAccess", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyKartAsset
        .connect(this.signers.alice)
        .revokeAccess("0xFB6c5feE537344Db0f585d65C684fbc2A800d0a8");
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should update externalUrl and emit an event on setExternalURL", async function () {
      const tx = this.kittyKartAsset.revokeAccess("0xFB6c5feE537344Db0f585d65C684fbc2A800d0a8");
      await expect(tx).to.be.emit(this.kittyKartAsset, "AccessRevoked");
    });
  });

  describe("isApprovedForAll", async function () {
    it("should return true for autoBodyShopAddress operator", async function () {
      await this.kittyKartAsset.setAutoBodyShop(this.signers.andy.address);
      expect(
        await this.kittyKartAsset.isApprovedForAll(this.signers.alice.address, this.signers.andy.address),
      ).to.be.equal(true);
    });

    it("should return false for other operator addresses", async function () {
      await this.kittyKartAsset.setAutoBodyShop(this.signers.andy.address);
      expect(
        await this.kittyKartAsset.isApprovedForAll(this.signers.alice.address, this.signers.bell.address),
      ).to.be.equal(false);
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
