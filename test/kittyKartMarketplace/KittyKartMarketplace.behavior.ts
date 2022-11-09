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
      // apply assets
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
  });
}
