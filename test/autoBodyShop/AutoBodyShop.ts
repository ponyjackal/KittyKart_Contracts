import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { createFixtureLoader } from "ethereum-waffle";
import { ethers } from "hardhat";

import { ALICE_ADDRESS, DEPLOY_ADDRESS, REGISTRY_ADDRESS } from "../constants";
import { deploykittyAssetFixture } from "../kittyAsset/KittyAsset.fixture";
import { deployKittyKartFixture } from "../kittyKart/KittyKart.fixture";
import type { Signers } from "../types";
import { shouldBehaveLikeAutoBodyShop } from "./AutoBodyShop.behavior";
import { deployAutoBodyShopFixture } from "./AutoBodyShop.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    // impersonate account on mainnet
    this.signers.deployer = await ethers.getImpersonatedSigner(DEPLOY_ADDRESS);
    this.signers.alice = await ethers.getImpersonatedSigner(ALICE_ADDRESS);
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("AutoBodyShop", function () {
    beforeEach(async function () {
      const { kittyKart } = await this.loadFixture(deployKittyKartFixture);
      this.kittyKart = kittyKart;

      const { kittyAsset } = await this.loadFixture(deploykittyAssetFixture);
      this.kittyAsset = kittyAsset;

      const { autoBodyShop } = await this.loadFixture(deployAutoBodyShopFixture);
      this.autoBodyShop = autoBodyShop;
      // set KittyKart address
      await this.autoBodyShop.connect(this.signers.deployer).setKittyKart(this.kittyKart.address);
      // set KittyAsset address
      await this.autoBodyShop.connect(this.signers.deployer).setKittyAsset(this.kittyAsset.address);
      // set AutoBodyShop address on kittyAsset
      await this.kittyAsset.connect(this.signers.deployer).setAutoBodyShop(this.autoBodyShop.address);
      // set assetAttribute table in KittyKart
      const assetAttributeTable = await this.kittyAsset.attributeTable();
      await this.kittyKart.connect(this.signers.deployer).setAssetAttributeTable(assetAttributeTable);
      // approve asset tokens to AutoBodyShop
      await this.kittyAsset.connect(this.signers.alice).setApprovalForAll(this.autoBodyShop.address, true);
    });

    shouldBehaveLikeAutoBodyShop();
  });
});
