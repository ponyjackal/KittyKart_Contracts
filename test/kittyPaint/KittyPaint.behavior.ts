import { expect } from "chai";

import { REGISTRY_ADDRESS } from "../constants";

export function shouldBehaveLikeKittyPaint(): void {
  it("should create metadata table", async function () {
    // create table
    await this.kittyPaint.createMetadataTable(REGISTRY_ADDRESS);
    // check table name
    const tableName = await this.kittyPaint.metadataTable();
    expect(tableName).to.not.equal("");
  });

  it("should insert rows into metadata table on mint", async function () {
    // create table
    await this.kittyPaint.createMetadataTable(REGISTRY_ADDRESS);
    // mint
    await this.kittyPaint.publicMint(5);
    // check rows
  });
}
