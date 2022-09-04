import { expect } from "chai";

import { REGISTRY_ADDRESS } from "../constants";

export function shouldBehaveLikekittyAsset(): void {
  it("should create metadata table", async function () {
    // create table
    await this.kittyAsset.createMetadataTable(REGISTRY_ADDRESS);
    // check table name
    const tableName = await this.kittyAsset.metadataTable();
    expect(tableName).to.not.equal("");
  });

  it("should insert rows into metadata table on mint", async function () {
    // create table
    await this.kittyAsset.createMetadataTable(REGISTRY_ADDRESS);
    // mint
    // check rows
  });
}
