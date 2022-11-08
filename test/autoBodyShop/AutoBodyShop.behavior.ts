import { expect } from "chai";
import { network } from "hardhat";

import { SIGNING_AUTOBODY_SHOP_DOMAIN, SIGNING_AUTOBODY_SHOP_TYPES, SIGNING_AUTOBODY_SHOP_VERSION } from "../constants";

/**
 * @note AutoBodyShop contract will be deprecated once we build out backend service for it
 */

export function shouldBehaveLikeAutoBodyShop(): void {
  describe("ApplyAssets", async function () {
    it("should apply asset to kart", async function () {
      // sign a message for AutoBodyShopVoucher
      const data = {
        owner: this.signers.alice.address,
        kartId: 0,
        assetIds: [0],
        resetQuery: "UPDATE Attribute SET in_use = 2 WHERE id = 0",
        applyQuery: "UPDATE Attribute SET kart_id = 2 WHERE id = 0",
        updateImageQuery: "UPDATE Kart SET image = 'https://example.com/1.png' WHERE id = 0",
        nonce: 0,
        expiry: 1663289367,
      };
      const typedDomain = {
        name: SIGNING_AUTOBODY_SHOP_DOMAIN,
        version: SIGNING_AUTOBODY_SHOP_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.autoBodyShop.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_AUTOBODY_SHOP_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // apply assets
      await this.autoBodyShop.connect(this.signers.alice).applyAssets(voucher);
    });

    it("should emit an event on applyAssets", async function () {
      // sign a message for AutoBodyShopVoucher
      const data = {
        owner: this.signers.alice.address,
        kartId: 0,
        assetIds: [1],
        resetQuery: "UPDATE Attribute SET in_use = 2 WHERE id = 0",
        applyQuery: "UPDATE Attribute SET kart_id = 2 WHERE id = 0",
        updateImageQuery: "UPDATE Kart SET image = 'https://example.com/1.png' WHERE id = 0",
        nonce: 1,
        expiry: 1663289367,
      };
      const typedDomain = {
        name: SIGNING_AUTOBODY_SHOP_DOMAIN,
        version: SIGNING_AUTOBODY_SHOP_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.autoBodyShop.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_AUTOBODY_SHOP_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // apply assets
      const tx = this.autoBodyShop.connect(this.signers.alice).applyAssets(voucher);
      // check events
      await expect(tx).to.be.emit(this.autoBodyShop, "ApplyAssets");
    });

    it("should revert if trying to apply used assets", async function () {
      // sign a message for AutoBodyShopVoucher
      const data = {
        owner: this.signers.alice.address,
        kartId: 0,
        assetIds: [0, 1],
        resetQuery: "UPDATE Attribute SET in_use = 2 WHERE id = 0",
        applyQuery: "UPDATE Attribute SET kart_id = 2 WHERE id = 0",
        updateImageQuery: "UPDATE Kart SET image = 'https://example.com/1.png' WHERE id = 0",
        nonce: 2,
        expiry: 1663289367,
      };
      const typedDomain = {
        name: SIGNING_AUTOBODY_SHOP_DOMAIN,
        version: SIGNING_AUTOBODY_SHOP_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.autoBodyShop.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_AUTOBODY_SHOP_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // apply assets
      const tx = this.autoBodyShop.connect(this.signers.alice).applyAssets(voucher);
      // check revert
      await expect(tx).be.revertedWith("AutoBodyShop: not an asset owner");
    });

    it("should revert if signature is signed by non-gameServer", async function () {
      // sign a message for AutoBodyShopVoucher
      const data = {
        owner: this.signers.alice.address,
        kartId: 0,
        assetIds: [0, 1],
        resetQuery: "UPDATE Attribute SET in_use = 2 WHERE id = 0",
        applyQuery: "UPDATE Attribute SET kart_id = 2 WHERE id = 0",
        updateImageQuery: "UPDATE Kart SET image = 'https://example.com/1.png' WHERE id = 0",
        nonce: 3,
        expiry: 1663289367,
      };
      const typedDomain = {
        name: SIGNING_AUTOBODY_SHOP_DOMAIN,
        version: SIGNING_AUTOBODY_SHOP_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.autoBodyShop.address,
      };
      const signature = await this.signers.bell._signTypedData(typedDomain, SIGNING_AUTOBODY_SHOP_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // apply assets
      const tx = this.autoBodyShop.connect(this.signers.alice).applyAssets(voucher);
      // check revert
      await expect(tx).be.revertedWith("AutoBodyShop: invalid call");
    });

    it("should revert if invalid data is signed", async function () {
      // sign a message for AutoBodyShopVoucher
      const data = {
        owner: this.signers.bell.address,
        kartId: 0,
        assetIds: [0, 1],
        resetQuery: "UPDATE Attribute SET in_use = 2 WHERE id = 0",
        applyQuery: "UPDATE Attribute SET kart_id = 2 WHERE id = 0",
        updateImageQuery: "UPDATE Kart SET image = 'https://example.com/1.png' WHERE id = 0",
        nonce: 4,
        expiry: 1663289367,
      };
      const typedDomain = {
        name: SIGNING_AUTOBODY_SHOP_DOMAIN,
        version: SIGNING_AUTOBODY_SHOP_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.autoBodyShop.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_AUTOBODY_SHOP_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // apply assets
      const tx = this.autoBodyShop.connect(this.signers.alice).applyAssets(voucher);
      // check revert
      await expect(tx).be.revertedWith("AutoBodyShop: invalid call");
    });

    it("should revert if invalid nonce", async function () {
      // sign a message for AutoBodyShopVoucher
      const data = {
        owner: this.signers.alice.address,
        kartId: 0,
        assetIds: [0, 1],
        resetQuery: "UPDATE Attribute SET in_use = 2 WHERE id = 0",
        applyQuery: "UPDATE Attribute SET kart_id = 2 WHERE id = 0",
        updateImageQuery: "UPDATE Kart SET image = 'https://example.com/1.png' WHERE id = 0",
        nonce: 0,
        expiry: 1663289367,
      };
      const typedDomain = {
        name: SIGNING_AUTOBODY_SHOP_DOMAIN,
        version: SIGNING_AUTOBODY_SHOP_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.autoBodyShop.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_AUTOBODY_SHOP_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // apply assets
      const tx = this.autoBodyShop.connect(this.signers.alice).applyAssets(voucher);
      // check revert
      await expect(tx).be.revertedWith("AutoBodyShop: invalid nonce");
    });

    it("should revert if signature is expired", async function () {
      // sign a message for AutoBodyShopVoucher
      const data = {
        owner: this.signers.alice.address,
        kartId: 0,
        assetIds: [0, 1],
        resetQuery: "UPDATE Attribute SET in_use = 2 WHERE id = 0",
        applyQuery: "UPDATE Attribute SET kart_id = 2 WHERE id = 0",
        updateImageQuery: "UPDATE Kart SET image = 'https://example.com/1.png' WHERE id = 0",
        nonce: 2,
        expiry: 1662032272,
      };
      const typedDomain = {
        name: SIGNING_AUTOBODY_SHOP_DOMAIN,
        version: SIGNING_AUTOBODY_SHOP_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.autoBodyShop.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_AUTOBODY_SHOP_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // apply assets
      const tx = this.autoBodyShop.connect(this.signers.alice).applyAssets(voucher);
      // check revert
      await expect(tx).be.revertedWith("AutoBodyShop: signature is expired");
    });
  });
}
