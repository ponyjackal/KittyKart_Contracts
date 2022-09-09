import { expect } from "chai";

import { REGISTRY_ADDRESS } from "../constants";

export function shouldBehaveLikeAutoBodyShop(): void {
  describe("ApplyAssets", async function () {
    it("should apply asset to kart", async function () {
      // apply assets
      await this.autoBodyShop.connect(this.signers.alice).applyAssets(0, [0]);
    });

    it("should emit an event on applyAssets", async function () {
      // apply assets
      const tx = this.autoBodyShop.connect(this.signers.alice).applyAssets(0, [1]);
      // check events
      await expect(tx).to.be.emit(this.autoBodyShop, "ApplyAssets");
    });

    it("should revert if trying to apply used assets", async function () {
      // apply assets
      const tx = this.autoBodyShop.connect(this.signers.alice).applyAssets(0, [0, 1]);
      // check revert
      await expect(tx).be.reverted;
    });
  });
}
