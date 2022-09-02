import { expect } from "chai";

import { REGISTRY_ADDRESS } from "../constants";

export function shouldBehaveLikeKittyKart(): void {
  it("should create metadata table", async function () {
    // create table
    await this.kittyKart.createMetadataTable(REGISTRY_ADDRESS);
    // check table name
    const tableName = await this.kittyKart.metadataTable();
    expect(tableName).to.not.equal("");
  });
}
