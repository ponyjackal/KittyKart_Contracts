import { expect } from "chai";

import { KITTY_INU_ADDRESS } from "../constants";

export function shouldBehaveLikeKittyKartMarketplace(): void {
  describe("bell's balance", async function () {
    it("should hold Kitty Inu", async function () {
      const balance = await this.kittyKartAsset.balanceOf(KITTY_INU_ADDRESS);
      expect(balance).to.be.gt(0);
    });
  });
}
