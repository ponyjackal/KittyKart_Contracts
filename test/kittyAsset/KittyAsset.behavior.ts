import { expect } from "chai";

import { REGISTRY_ADDRESS } from "../constants";

export function shouldBehaveLikekittyAsset(): void {
  describe("CreateMetadataTable", async function () {
    it("should create metadata table", async function () {
      // create table
      await this.kittyAsset.createMetadataTable(REGISTRY_ADDRESS);
      // check table name
      const tableName = await this.kittyAsset.metadataTable();
      expect(tableName).to.not.equal("");
    });

    it("should emit an event on metadata table creation", async function () {
      // create table
      const tx = this.kittyAsset.createMetadataTable(REGISTRY_ADDRESS);
      // check events
      await expect(tx).to.be.emit(this.kittyAsset, "CreateMetadataTable");
    });
  });
}
