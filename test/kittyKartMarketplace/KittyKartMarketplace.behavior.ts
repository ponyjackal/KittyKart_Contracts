import { expect } from "chai";
import { ethers, network } from "hardhat";

import { SIGNING_MARKETPLACE_DOMAIN, SIGNING_MARKETPLACE_TYPES, SIGNING_MARKETPLACE_VERSION } from "../constants";

// alice has some karts and assets,
// bell has some kittyInu tokens

export function shouldBehaveLikeKittyKartMarketplace(): void {
  describe("List", async function () {
    it("should list a nft", async function () {
      // alice is going to list kart
      // sign a message for KittyKartMarketplace
      const data = {
        user: this.signers.alice.address,
        collection: this.kittyKartGoKart.address,
        tokenId: 0,
        price: ethers.utils.parseEther("0.1"),
        actionType: 0,
        nonce: 0,
        expiry: 0,
      };
      const typedDomain = {
        name: SIGNING_MARKETPLACE_DOMAIN,
        version: SIGNING_MARKETPLACE_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.kittyKartMarketplace.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // list nft
      await this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
      // check ownership is transferred
      const ownerOfKart = await this.kittyKartGoKart.ownerOf(0);
      expect(ownerOfKart).to.equal(this.kittyKartMarketplace.address);
      // check kart is listed
      const listedKart = await this.kittyKartMarketplace._idToNFT(this.kittyKartGoKart.address, 0);
      expect(listedKart.nftContract).to.equal(this.kittyKartGoKart.address);
      expect(listedKart.tokenId).to.equal(0);
      expect(listedKart.seller).to.equal(this.signers.alice.address);
      expect(listedKart.listed).to.equal(true);
      expect(listedKart.price).to.equal(ethers.utils.parseEther("0.1"));
      // check if nonce is updated
      const nonce = await this.kittyKartMarketplace.nonces(this.signers.alice.address);
      expect(nonce).to.equal(1);
      // check if signature is set as used
      const isSignatureUsed = await this.kittyKartMarketplace.signatures(signature);
      expect(isSignatureUsed).to.equal(true);
    });

    it("should emit an event for list", async function () {
      // alice is going to list kart
      // sign a message for KittyKartMarketplace
      const data = {
        user: this.signers.alice.address,
        collection: this.kittyKartAsset.address,
        tokenId: 0,
        price: ethers.utils.parseEther("0.1"),
        actionType: 0,
        nonce: 1,
        expiry: 0,
      };
      const typedDomain = {
        name: SIGNING_MARKETPLACE_DOMAIN,
        version: SIGNING_MARKETPLACE_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.kittyKartMarketplace.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // list nft
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
      await expect(tx).to.be.emit(this.kittyKartMarketplace, "NFTListed");
    });

    it("should revert if user is non-owner of the token", async function () {
      // alice is going to list kart_0, alice is already listed kart_0
      // sign a message for KittyKartMarketplace
      const data = {
        user: this.signers.alice.address,
        collection: this.kittyKartGoKart.address,
        tokenId: 0,
        price: ethers.utils.parseEther("0.1"),
        actionType: 0,
        nonce: 0,
        expiry: 0,
      };
      const typedDomain = {
        name: SIGNING_MARKETPLACE_DOMAIN,
        version: SIGNING_MARKETPLACE_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.kittyKartMarketplace.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // list nft
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
      // check revert
      await expect(tx).be.revertedWith("KittyKartMarketplace: caller is not the owner of NFT token");
    });

    it("should revert if nonce is not correct", async function () {
      // alice is going to list kart_1, nonce is not correct
      // sign a message for KittyKartMarketplace
      const data = {
        user: this.signers.alice.address,
        collection: this.kittyKartGoKart.address,
        tokenId: 1,
        price: ethers.utils.parseEther("0.1"),
        actionType: 0,
        nonce: 0,
        expiry: 0,
      };
      const typedDomain = {
        name: SIGNING_MARKETPLACE_DOMAIN,
        version: SIGNING_MARKETPLACE_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.kittyKartMarketplace.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // list nft
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
      // check revert
      await expect(tx).be.revertedWith("KittyKartMarketplace: invalid nonce");
    });

    it("should revert if signature is not signed by gameServer", async function () {
      // alice is going to list kart_1, and Bell signed the signature
      // sign a message for KittyKartMarketplace
      const data = {
        user: this.signers.alice.address,
        collection: this.kittyKartGoKart.address,
        tokenId: 1,
        price: ethers.utils.parseEther("0.1"),
        actionType: 0,
        nonce: 2,
        expiry: 0,
      };
      const typedDomain = {
        name: SIGNING_MARKETPLACE_DOMAIN,
        version: SIGNING_MARKETPLACE_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.kittyKartMarketplace.address,
      };
      const signature = await this.signers.bell._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // list nft
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
      // check revert
      await expect(tx).be.revertedWith("KittyKartMarketplace: invalid signature");
    });

    it("should revert if tx submitter is not valid user", async function () {
      // alice is going to list kart_1, but user is bell
      // sign a message for KittyKartMarketplace
      const data = {
        user: this.signers.bell.address,
        collection: this.kittyKartGoKart.address,
        tokenId: 1,
        price: ethers.utils.parseEther("0.1"),
        actionType: 0,
        nonce: 2,
        expiry: 0,
      };
      const typedDomain = {
        name: SIGNING_MARKETPLACE_DOMAIN,
        version: SIGNING_MARKETPLACE_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.kittyKartMarketplace.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // list nft
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
      // check revert
      await expect(tx).be.revertedWith("KittyKartMarketplace: invalid user");
    });

    it("should revert if nft address is not kart or asset", async function () {
      // alice is going to list kart_1, but nft address is not kart or asset
      // sign a message for KittyKartMarketplace
      const data = {
        user: this.signers.alice.address,
        collection: this.kittyInu.address,
        tokenId: 1,
        price: ethers.utils.parseEther("0.1"),
        actionType: 0,
        nonce: 2,
        expiry: 0,
      };
      const typedDomain = {
        name: SIGNING_MARKETPLACE_DOMAIN,
        version: SIGNING_MARKETPLACE_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.kittyKartMarketplace.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // list nft
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
      // check revert
      await expect(tx).be.revertedWith("KittyKartMarketplace: invalid NFT token contract");
    });

    it("should revert if listing price is not valid", async function () {
      // alice is going to list kart_1, but listing price is 0
      // sign a message for KittyKartMarketplace
      const data = {
        user: this.signers.alice.address,
        collection: this.kittyKartGoKart.address,
        tokenId: 1,
        price: 0,
        actionType: 0,
        nonce: 2,
        expiry: 0,
      };
      const typedDomain = {
        name: SIGNING_MARKETPLACE_DOMAIN,
        version: SIGNING_MARKETPLACE_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.kittyKartMarketplace.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // list nft
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
      // check revert
      await expect(tx).be.revertedWith("KittyKartMarketplace: invalid KittyInu token price");
    });

    it("should revert if action type is not correct", async function () {
      // alice is going to list kart_1, but action type is not correct
      // sign a message for KittyKartMarketplace
      const data = {
        user: this.signers.alice.address,
        collection: this.kittyKartGoKart.address,
        tokenId: 1,
        price: ethers.utils.parseEther("0.1"),
        actionType: 1, // for listing, it should be 0
        nonce: 2,
        expiry: 0,
      };
      const typedDomain = {
        name: SIGNING_MARKETPLACE_DOMAIN,
        version: SIGNING_MARKETPLACE_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.kittyKartMarketplace.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // list nft
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
      // check revert
      await expect(tx).be.revertedWith("KittyKartMarketplace: invalid action");
    });

    it("should revert if signature is expired", async function () {
      // alice is going to list kart_1, but the signature is expired
      // sign a message for KittyKartMarketplace
      const data = {
        user: this.signers.alice.address,
        collection: this.kittyKartGoKart.address,
        tokenId: 1,
        price: ethers.utils.parseEther("0.1"),
        actionType: 0,
        nonce: 2,
        expiry: 1, // expired
      };
      const typedDomain = {
        name: SIGNING_MARKETPLACE_DOMAIN,
        version: SIGNING_MARKETPLACE_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.kittyKartMarketplace.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // list nft
      const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
      // check revert
      await expect(tx).be.revertedWith("KittyKartMarketplace: asset is expired");
    });
  });

  describe("Buy", async function () {
    before(async function () {
      // alice is going to list a kart_2
      // sign a message for KittyKartMarketplace
      const data = {
        user: this.signers.alice.address,
        collection: this.kittyKartGoKart.address,
        tokenId: 2,
        price: ethers.utils.parseEther("0.5"),
        actionType: 0,
        nonce: 2,
        expiry: 0,
      };
      const typedDomain = {
        name: SIGNING_MARKETPLACE_DOMAIN,
        version: SIGNING_MARKETPLACE_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.kittyKartMarketplace.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // list nft
      await this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);

      // alice is going to list an asset_1
      // sign a message for KittyKartMarketplace
      const data1 = {
        user: this.signers.alice.address,
        collection: this.kittyKartAsset.address,
        tokenId: 1,
        price: ethers.utils.parseEther("0.1"),
        actionType: 0,
        nonce: 3,
        expiry: 0,
      };
      const signature1 = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data1);
      const voucher1 = {
        ...data1,
        signature: signature1,
      };
      // list nft
      await this.kittyKartMarketplace.connect(this.signers.alice).list(voucher1);

      // bell allows KittyInu tokens to KittyKartMarketplace
      await this.kittyInu
        .connect(this.signers.bell)
        .increaseAllowance(this.kittyKartMarketplace.address, ethers.utils.parseEther("100"));
    });

    it("should buy a listed nft", async function () {
      // bell is going to buy a kart_2
      // sign a message for KittyKartMarketplace
      const data = {
        user: this.signers.bell.address,
        collection: this.kittyKartGoKart.address,
        tokenId: 2,
        price: ethers.utils.parseEther("0.5"),
        actionType: 1,
        nonce: 0,
        expiry: 0,
      };
      const typedDomain = {
        name: SIGNING_MARKETPLACE_DOMAIN,
        version: SIGNING_MARKETPLACE_VERSION,
        chainId: network.config.chainId,
        verifyingContract: this.kittyKartMarketplace.address,
      };
      const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
      const voucher = {
        ...data,
        signature: signature,
      };
      // list nft
      await this.kittyKartMarketplace.connect(this.signers.bell).buyNFT(voucher);
      // check ownership is transferred
      const ownerOfKart = await this.kittyKartGoKart.ownerOf(2);
      expect(ownerOfKart).to.equal(this.signers.bell.address);
      // check if alice got KittyInu token reducing the market fee 5%
      const balanceOfAlice = await this.kittyInu.balanceOf(this.signers.alice.address);
      expect(balanceOfAlice).to.equal(ethers.utils.parseEther("0.475"));
      // check kart is removed from the list
      const listedKart = await this.kittyKartMarketplace._idToNFT(this.kittyKartGoKart.address, 2);
      expect(listedKart.listed).to.equal(false);
      expect(listedKart.price).to.equal(0);
      // check if nonce is updated
      const nonce = await this.kittyKartMarketplace.nonces(this.signers.bell.address);
      expect(nonce).to.equal(1);
      // check if signature is set as used
      const isSignatureUsed = await this.kittyKartMarketplace.signatures(signature);
      expect(isSignatureUsed).to.equal(true);
    });

    // it("should emit an event for list", async function () {
    //   // alice is going to list kart
    //   // sign a message for KittyKartMarketplace
    //   const data = {
    //     user: this.signers.alice.address,
    //     collection: this.kittyKartAsset.address,
    //     tokenId: 0,
    //     price: ethers.utils.parseEther("0.1"),
    //     actionType: 0,
    //     nonce: 1,
    //     expiry: 0,
    //   };
    //   const typedDomain = {
    //     name: SIGNING_MARKETPLACE_DOMAIN,
    //     version: SIGNING_MARKETPLACE_VERSION,
    //     chainId: network.config.chainId,
    //     verifyingContract: this.kittyKartMarketplace.address,
    //   };
    //   const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
    //   const voucher = {
    //     ...data,
    //     signature: signature,
    //   };
    //   // list nft
    //   const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
    //   await expect(tx).to.be.emit(this.kittyKartMarketplace, "NFTListed");
    // });

    // it("should revert if user is non-owner of the token", async function () {
    //   // alice is going to list kart_0, alice is already listed kart_0
    //   // sign a message for KittyKartMarketplace
    //   const data = {
    //     user: this.signers.alice.address,
    //     collection: this.kittyKartGoKart.address,
    //     tokenId: 0,
    //     price: ethers.utils.parseEther("0.1"),
    //     actionType: 0,
    //     nonce: 0,
    //     expiry: 0,
    //   };
    //   const typedDomain = {
    //     name: SIGNING_MARKETPLACE_DOMAIN,
    //     version: SIGNING_MARKETPLACE_VERSION,
    //     chainId: network.config.chainId,
    //     verifyingContract: this.kittyKartMarketplace.address,
    //   };
    //   const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
    //   const voucher = {
    //     ...data,
    //     signature: signature,
    //   };
    //   // list nft
    //   const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
    //   // check revert
    //   await expect(tx).be.revertedWith("KittyKartMarketplace: caller is not the owner of NFT token");
    // });

    // it("should revert if nonce is not correct", async function () {
    //   // alice is going to list kart_1, nonce is not correct
    //   // sign a message for KittyKartMarketplace
    //   const data = {
    //     user: this.signers.alice.address,
    //     collection: this.kittyKartGoKart.address,
    //     tokenId: 1,
    //     price: ethers.utils.parseEther("0.1"),
    //     actionType: 0,
    //     nonce: 0,
    //     expiry: 0,
    //   };
    //   const typedDomain = {
    //     name: SIGNING_MARKETPLACE_DOMAIN,
    //     version: SIGNING_MARKETPLACE_VERSION,
    //     chainId: network.config.chainId,
    //     verifyingContract: this.kittyKartMarketplace.address,
    //   };
    //   const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
    //   const voucher = {
    //     ...data,
    //     signature: signature,
    //   };
    //   // list nft
    //   const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
    //   // check revert
    //   await expect(tx).be.revertedWith("KittyKartMarketplace: invalid nonce");
    // });

    // it("should revert if signature is not signed by gameServer", async function () {
    //   // alice is going to list kart_1, and Bell signed the signature
    //   // sign a message for KittyKartMarketplace
    //   const data = {
    //     user: this.signers.alice.address,
    //     collection: this.kittyKartGoKart.address,
    //     tokenId: 1,
    //     price: ethers.utils.parseEther("0.1"),
    //     actionType: 0,
    //     nonce: 2,
    //     expiry: 0,
    //   };
    //   const typedDomain = {
    //     name: SIGNING_MARKETPLACE_DOMAIN,
    //     version: SIGNING_MARKETPLACE_VERSION,
    //     chainId: network.config.chainId,
    //     verifyingContract: this.kittyKartMarketplace.address,
    //   };
    //   const signature = await this.signers.bell._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
    //   const voucher = {
    //     ...data,
    //     signature: signature,
    //   };
    //   // list nft
    //   const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
    //   // check revert
    //   await expect(tx).be.revertedWith("KittyKartMarketplace: invalid signature");
    // });

    // it("should revert if tx submitter is not valid user", async function () {
    //   // alice is going to list kart_1, but user is bell
    //   // sign a message for KittyKartMarketplace
    //   const data = {
    //     user: this.signers.bell.address,
    //     collection: this.kittyKartGoKart.address,
    //     tokenId: 1,
    //     price: ethers.utils.parseEther("0.1"),
    //     actionType: 0,
    //     nonce: 2,
    //     expiry: 0,
    //   };
    //   const typedDomain = {
    //     name: SIGNING_MARKETPLACE_DOMAIN,
    //     version: SIGNING_MARKETPLACE_VERSION,
    //     chainId: network.config.chainId,
    //     verifyingContract: this.kittyKartMarketplace.address,
    //   };
    //   const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
    //   const voucher = {
    //     ...data,
    //     signature: signature,
    //   };
    //   // list nft
    //   const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
    //   // check revert
    //   await expect(tx).be.revertedWith("KittyKartMarketplace: invalid user");
    // });

    // it("should revert if nft address is not kart or asset", async function () {
    //   // alice is going to list kart_1, but nft address is not kart or asset
    //   // sign a message for KittyKartMarketplace
    //   const data = {
    //     user: this.signers.alice.address,
    //     collection: this.kittyInu.address,
    //     tokenId: 1,
    //     price: ethers.utils.parseEther("0.1"),
    //     actionType: 0,
    //     nonce: 2,
    //     expiry: 0,
    //   };
    //   const typedDomain = {
    //     name: SIGNING_MARKETPLACE_DOMAIN,
    //     version: SIGNING_MARKETPLACE_VERSION,
    //     chainId: network.config.chainId,
    //     verifyingContract: this.kittyKartMarketplace.address,
    //   };
    //   const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
    //   const voucher = {
    //     ...data,
    //     signature: signature,
    //   };
    //   // list nft
    //   const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
    //   // check revert
    //   await expect(tx).be.revertedWith("KittyKartMarketplace: invalid NFT token contract");
    // });

    // it("should revert if listing price is not valid", async function () {
    //   // alice is going to list kart_1, but listing price is 0
    //   // sign a message for KittyKartMarketplace
    //   const data = {
    //     user: this.signers.alice.address,
    //     collection: this.kittyKartGoKart.address,
    //     tokenId: 1,
    //     price: 0,
    //     actionType: 0,
    //     nonce: 2,
    //     expiry: 0,
    //   };
    //   const typedDomain = {
    //     name: SIGNING_MARKETPLACE_DOMAIN,
    //     version: SIGNING_MARKETPLACE_VERSION,
    //     chainId: network.config.chainId,
    //     verifyingContract: this.kittyKartMarketplace.address,
    //   };
    //   const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
    //   const voucher = {
    //     ...data,
    //     signature: signature,
    //   };
    //   // list nft
    //   const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
    //   // check revert
    //   await expect(tx).be.revertedWith("KittyKartMarketplace: invalid KittyInu token price");
    // });

    // it("should revert if action type is not correct", async function () {
    //   // alice is going to list kart_1, but action type is not correct
    //   // sign a message for KittyKartMarketplace
    //   const data = {
    //     user: this.signers.alice.address,
    //     collection: this.kittyKartGoKart.address,
    //     tokenId: 1,
    //     price: ethers.utils.parseEther("0.1"),
    //     actionType: 1, // for listing, it should be 0
    //     nonce: 2,
    //     expiry: 0,
    //   };
    //   const typedDomain = {
    //     name: SIGNING_MARKETPLACE_DOMAIN,
    //     version: SIGNING_MARKETPLACE_VERSION,
    //     chainId: network.config.chainId,
    //     verifyingContract: this.kittyKartMarketplace.address,
    //   };
    //   const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
    //   const voucher = {
    //     ...data,
    //     signature: signature,
    //   };
    //   // list nft
    //   const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
    //   // check revert
    //   await expect(tx).be.revertedWith("KittyKartMarketplace: invalid action");
    // });

    // it("should revert if signature is expired", async function () {
    //   // alice is going to list kart_1, but the signature is expired
    //   // sign a message for KittyKartMarketplace
    //   const data = {
    //     user: this.signers.alice.address,
    //     collection: this.kittyKartGoKart.address,
    //     tokenId: 1,
    //     price: ethers.utils.parseEther("0.1"),
    //     actionType: 0,
    //     nonce: 2,
    //     expiry: 1, // expired
    //   };
    //   const typedDomain = {
    //     name: SIGNING_MARKETPLACE_DOMAIN,
    //     version: SIGNING_MARKETPLACE_VERSION,
    //     chainId: network.config.chainId,
    //     verifyingContract: this.kittyKartMarketplace.address,
    //   };
    //   const signature = await this.signers.gameServer._signTypedData(typedDomain, SIGNING_MARKETPLACE_TYPES, data);
    //   const voucher = {
    //     ...data,
    //     signature: signature,
    //   };
    //   // list nft
    //   const tx = this.kittyKartMarketplace.connect(this.signers.alice).list(voucher);
    //   // check revert
    //   await expect(tx).be.revertedWith("KittyKartMarketplace: asset is expired");
    // });
  });
}
