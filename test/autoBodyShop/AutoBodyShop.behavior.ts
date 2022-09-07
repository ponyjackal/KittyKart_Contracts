import { expect } from "chai";

import { REGISTRY_ADDRESS } from "../constants";

export function shouldBehaveLikeAutoBodyShop(): void {
  it("should apply asset to kart", async function () {
    await this.autoBodyShop.connect(this.signers.alice).applyAsset(0, [0]);
  });
}
