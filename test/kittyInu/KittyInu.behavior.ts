import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldBehaveLikeKittyInu(): void {
  describe("mint", async function () {
    it("should be reverted for not owner", async function () {
      const tx = this.kittyInu
        .connect(this.signers.alice)
        .mint(this.signers.alice.address, ethers.utils.parseEther("1000"));
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should mint tokens to receiver", async function () {
      await this.kittyInu
        .connect(this.signers.deployer)
        .mint(this.signers.bell.address, ethers.utils.parseEther("1000"));
      const balanceOfBell = await this.kittyInu.balanceOf(this.signers.bell.address);
      expect(balanceOfBell).to.equal(ethers.utils.parseEther("1000"));
    });
  });
}
