// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IKittyKartMarketplace {
  // -----------------------------------------
  // KittyKartGoKart Events
  // -----------------------------------------
  event NFTListed(address indexed tokenContract, uint256 indexed tokenId, address indexed seller, uint256 price);
  event NFTSold(address indexed tokenContract, uint256 indexed tokenId, address seller, address buyer, uint256 price);
  event OfferMade(address indexed tokenContract, uint256 indexed tokenId, address indexed buyer, uint256 price);
  event OfferAccepted(
    address indexed tokenContract,
    uint256 indexed tokenId,
    address seller,
    address buyer,
    uint256 price
  );
  event SetGameServer(address gameServer);
  event SetKittyKartGoKart(address kittyKartGoKart);
  event SetKittyAsseet(address kittyKartAsset);

  struct KittyKartMarketplaceVoucher {
    address user;
    address collection;
    uint256 tokenId;
    uint256 price;
    uint256 actionType; // 0: list, 1: buy 2: make  offer 3: accept offer
    uint256 nonce;
    uint256 expiry;
    bytes signature;
  }

  struct NFT {
    address nftContract;
    uint256 tokenId;
    address seller;
    address owner;
    bool listed;
    uint256 price;
  }

  struct Offer {
    bool exists;
    address buyer;
    uint256 price;
  }

  function setGameServer(address _gameServer) external;

  function list(KittyKartMarketplaceVoucher calldata _voucher) external;

  function listNFT(uint256 _tokenId, address _owner) external;

  function buyNFT(KittyKartMarketplaceVoucher calldata _voucher, uint256 _amount) external;

  function makeOffer(KittyKartMarketplaceVoucher calldata _voucher, uint256 _amount) external;

  function acceptOffer(KittyKartMarketplaceVoucher calldata _voucher) external;

  function setKittyKartGoKart(address _kittyKartGoKart) external;

  function setKittyKartAsset(address _kittyKartAsset) external;
}
