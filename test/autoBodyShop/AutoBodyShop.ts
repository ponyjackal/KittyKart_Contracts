import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { createFixtureLoader } from "ethereum-waffle";
import { ethers } from "hardhat";

import { DEPLOY_ADDRESS, REGISTRY_ADDRESS } from "../constants";
import { deploykittyAssetFixture } from "../kittyAsset/KittyAsset.fixture";
import { deployKittyKartFixture } from "../kittyKart/KittyKart.fixture";
import type { Signers } from "../types";
import { shouldBehaveLikeAutoBodyShop } from "./AutoBodyShop.behavior";
import { deployAutoBodyShopFixture } from "./AutoBodyShop.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    // impersonate account on goerli
    this.signers.deployer = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("AutoBodyShop", function () {
    beforeEach(async function () {
      const { kittyKart } = await this.loadFixture(deployKittyKartFixture);
      this.kittyKart = kittyKart;

      const { kittyAsset } = await this.loadFixture(deploykittyAssetFixture);
      this.kittyAsset = kittyAsset;

      const kittyKartTableId = await this.kittyKart.metadataTableId();
      const kittyKartTable = await this.kittyKart.metadataTable();
      const kittyAssetTableId = await this.kittyAsset.metadataTableId();
      const kittyAssetTable = await this.kittyAsset.metadataTable();

      // const loadAutoBodyShopFixture: ReturnType<typeof createFixtureLoader> = createFixtureLoader([
      //   this.kittyKart.address,
      //   this.kittyAsset.address,
      //   REGISTRY_ADDRESS,
      //   kittyKartTableId,
      //   kittyKartTable,
      //   kittyAssetTableId,
      //   kittyAssetTable,
      // ]);
      // this.loadAutoBodyShopFixture = loadAutoBodyShopFixture;
      const { autoBodyShop } = await this.loadFixture(deployAutoBodyShopFixture);
      this.autoBodyShop = autoBodyShop;
    });

    shouldBehaveLikeAutoBodyShop();
  });
});
