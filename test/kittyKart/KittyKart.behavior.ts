import { expect } from "chai";

import { REGISTRY_ADDRESS } from "../constants";

export function shouldBehaveLikeKittyKart(): void {
  it("should create metadata table", async function () {
    const tableId = await this.kittyKart.createMetadataTable(REGISTRY_ADDRESS);
    console.log("tableId", tableId);
  });
}
