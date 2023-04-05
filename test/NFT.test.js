const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const c = console.log.bind()

const zeroAddress = "0x0000000000000000000000000000000000000000"

describe("NFT", function () {
    let nft
    let RockId
    let PaperId
    it("deploy", async () => {
        [owner, user1, user2, user3] = await ethers.getSigners()
        let NFT = await ethers.getContractFactory("NFT")
        let name = "RockPaperScissors"
        let symbol = "RPS"
        nft = await NFT.deploy(name, symbol)
        assert.equal(await nft.name(), name)
        assert.equal(await nft.symbol(), symbol)
        c("NFT address:", nft.address);
    })
    it("mint error", async () => {
        await expect(nft.connect(user1).mint("")).to.be.revertedWith('Ownable: caller is not the owner')
    })
    it("mint", async () => {
        let RockURI = "Rock"
        let mint = await nft.mint(RockURI)
        let tx = await mint.wait()
        RockId = Number(await nft.getCurrentId())
        assert.equal(tx.events[0].event, "Transfer")
        assert.equal(tx.events[0].args.from, zeroAddress)
        assert.equal(tx.events[0].args.to, owner.address)
        assert.equal(Number(tx.events[0].args.tokenId), RockId)

        assert.equal(await nft.ownerOf(RockId), owner.address)
        assert.equal(await nft.tokenURI(RockId), RockURI)
        assert.equal(Number(await nft.balanceOf(owner.address)), 1)
    })
    it("mintTo", async () => {
        let PaperURI = "Paper"
        await nft.mintTo(user1.address, PaperURI)
        PaperId = Number(await nft.getCurrentId())
        assert.equal(await nft.ownerOf(PaperId), user1.address)
        assert.equal(await nft.tokenURI(PaperId), PaperURI)
        assert.equal(Number(await nft.balanceOf(user1.address)), 1)
    })
    it("approve", async () => {
        let Approval = await nft.approve(user3.address, RockId)
        let tx = await Approval.wait()
        assert.equal(tx.events[0].event, "Approval")
        assert.equal(tx.events[0].args.owner, owner.address)
        assert.equal(tx.events[0].args.approved, user3.address)
        assert.equal(Number(tx.events[0].args.tokenId), RockId)
        assert.equal(await nft.getApproved(RockId), user3.address)
    })
    it("transferFrom", async () => {
        await nft.connect(user3).transferFrom(owner.address, user2.address, RockId)
        assert.equal(await nft.ownerOf(RockId), user2.address)
        assert.equal(Number(await nft.balanceOf(owner.address)), 0)
        assert.equal(Number(await nft.balanceOf(user2.address)), 1)
    })
    it("burn error", async () => {
        await expect(nft.connect(user1).burn(RockId)).to.be.revertedWith('Only owner of token')
    })
    it("burn", async () => {
        await nft.connect(user2).burn(RockId)
        assert.equal(Number(await nft.balanceOf(user2.address)), 0)
    })
})