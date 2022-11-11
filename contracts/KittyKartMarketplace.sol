// SPDX-License-Identifier: MIT

/*
  _  ___ _   _           _____             
 | |/ (_) | | |         |_   _|            
 | ' / _| |_| |_ _   _    | |  _ __  _   _ 
 |  < | | __| __| | | |   | | | '_ \| | | |
 | . \| | |_| |_| |_| |  _| |_| | | | |_| |
 |_|\_\_|\__|\__|\__, | |_____|_| |_|\__,_|
                  __/ |                    
                 |___/                                                    

Website: https://kittyinuerc20.io/
Telegram: https://t.me/kittyinutoken
Twitter: https://twitter.com/KittyInuErc20
Medium: https://medium.com/@kittyinu
Github: https://github.com/KittyInu
Instagram: https://www.instagram.com/kittyinuerc20/
Facebook: https://www.facebook.com/profile.php?id=100073769243131

*/
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "erc721a-upgradeable/contracts/IERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";

import "./interfaces/IKittyKartMarketplace.sol";

contract KittyKartMarketplace is
  Initializable,
  ReentrancyGuardUpgradeable,
  OwnableUpgradeable,
  PausableUpgradeable,
  ERC721HolderUpgradeable,
  IKittyKartMarketplace,
  EIP712Upgradeable
{
  uint256 public constant MARKET_FEE = 5; // 5 %
  // signature
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  string private constant SIGNING_DOMAIN = "KittyKartMarketplaceVoucher";
  string private constant SIGNATURE_VERSION = "1";

  IERC721AUpgradeable public kittyKartGoKart; // KittyKartGoKart NFT token
  IERC721AUpgradeable public kittyKartAsset; // KittyKartAsset NFT token
  IERC20Upgradeable public kittyInu; // Kitty Inu ERC20 token

  // Game server address
  address public gameServer;
  // NFT token contract => token id => NFT
  mapping(address => mapping(uint256 => NFT)) public _idToNFT;
  // mapping for bids, NFT token contract => token id => Offer
  mapping(address => mapping(uint256 => Offer)) public _idToOffer;
  // KittyKartMarketplace nonces
  mapping(address => uint256) public nonces;
  // KittyKartMarketplace signatures
  mapping(bytes => bool) public signatures;

  // -----------------------------------------
  // KittyKartMarketplace Initializer
  // -----------------------------------------
  /**
   * @dev Initializer function
   * @param _kittyKartGoKart KittyKartGoKart address
   * @param _kittyKartAsset kittyKartAsset address
   * @param _kittyKartAsset kittyKartAsset address
   */
  function initialize(
    IERC721AUpgradeable _kittyKartGoKart,
    IERC721AUpgradeable _kittyKartAsset,
    IERC20Upgradeable _kittyInu
  ) external initializer {
    __Context_init();
    __Ownable_init();
    __ReentrancyGuard_init();
    __Pausable_init();
    __ERC721Holder_init();
    __EIP712_init(SIGNING_DOMAIN, SIGNATURE_VERSION);

    require(address(_kittyKartAsset) != address(0), "KittyKartMarketplace: invalid KittyKartGoKart address.");
    require(address(_kittyKartAsset) != address(0), "KittyKartMarketplace: invalid KittyKartAsset address.");
    require(address(_kittyInu) != address(0), "KittyKartMarketplace: invalid KittyInu token address.");

    kittyKartGoKart = _kittyKartGoKart;
    kittyKartAsset = _kittyKartAsset;
    kittyInu = _kittyInu;
  }

  // -----------------------------------------
  // KittyKartMarketplace Modifiers
  // -----------------------------------------

  modifier nonContract() {
    require(msg.sender.code.length <= 0, "KittyKartMarketplace: caller not a user");
    _;
  }

  modifier onlyKittyContract() {
    require(
      msg.sender == address(kittyKartGoKart) || msg.sender == address(kittyKartAsset),
      "KittyKartMarketplace: caller not a user"
    );
    _;
  }

  // -----------------------------------------
  // KittyKartMarketplace Owner Functions
  // -----------------------------------------
  /**
   * @dev Set game server
   * @param _gameServer The external URL
   */
  function setGameServer(address _gameServer) external onlyOwner {
    require(_gameServer != address(0), "KittyKartMarketplace: invalid game server address");
    gameServer = _gameServer;

    emit SetGameServer(_gameServer);
  }

  /**
   * @dev set the KittyKartGoKart address
   * @param _kittyKartGoKart The KittyKartGoKart address
   */
  function setKittyKartGoKart(address _kittyKartGoKart) external onlyOwner {
    require(_kittyKartGoKart != address(0), "KittyKartMarketplace: invalid kart token address");
    kittyKartGoKart = IERC721AUpgradeable(_kittyKartGoKart);

    emit SetKittyKartGoKart(_kittyKartGoKart);
  }

  /**
   * @dev set the KittyInu address
   * @param _kittyInu The KittyInu address
   */
  function setKittyInu(address _kittyInu) external onlyOwner {
    require(_kittyInu != address(0), "KittyKartMarketplace: invalid asset token address");
    kittyInu = IERC20Upgradeable(_kittyInu);

    emit SetKittyKartAsseet(_kittyInu);
  }

  /**
   * @dev set the KittyKartAsset address
   * @param _kittyKartAsset The KittyKartAsset address
   */
  function setKittyKartAsset(address _kittyKartAsset) external onlyOwner {
    require(_kittyKartAsset != address(0), "KittyKartMarketplace: invalid asset token address");
    kittyKartAsset = IERC721AUpgradeable(_kittyKartAsset);

    emit SetKittyKartAsseet(_kittyKartAsset);
  }

  // -----------------------------------------
  // KittyKartMarketplace Mutative Functions
  // -----------------------------------------
  /**
   * @dev List NFT on sale by owner
   * @param _voucher The KittyKartMarketplaceVoucher
   */
  function list(KittyKartMarketplaceVoucher calldata _voucher) external nonContract nonReentrant {
    address signer = _verify(_voucher);
    require(signer == gameServer, "KittyKartMarketplace: invalid signature");
    require(msg.sender == _voucher.user, "KittyKartMarketplace: invalid user");
    require(
      _voucher.collection == address(kittyKartGoKart) || _voucher.collection == address(kittyKartAsset),
      "KittyKartMarketplace: invalid NFT token contract"
    );
    require(
      IERC721AUpgradeable(_voucher.collection).ownerOf(_voucher.tokenId) == msg.sender,
      "KittyKartMarketplace: caller is not the owner of NFT token"
    );
    require(_voucher.price > 0, "KittyKartMarketplace: invalid KittyInu token price");
    require(_voucher.actionType == 0, "KittyKartMarketplace: invalid action");
    require(_voucher.nonce == nonces[_voucher.user], "KittyKartMarketplace: invalid nonce");
    require(_voucher.expiry == 0 || block.timestamp <= _voucher.expiry, "KittyKartMarketplace: signature is expired");
    require(!signatures[_voucher.signature], "KittyKartMarketplace: signature is used");

    nonces[_voucher.user]++;
    signatures[_voucher.signature] = true;

    IERC721AUpgradeable(_voucher.collection).transferFrom(msg.sender, address(this), _voucher.tokenId);

    /* in case we don't list NFTs on marketplace on mint */
    _idToNFT[_voucher.collection][_voucher.tokenId] = NFT({
      nftContract: _voucher.collection,
      tokenId: _voucher.tokenId,
      seller: msg.sender,
      owner: msg.sender,
      price: _voucher.price,
      listed: true
    });

    /* in case we list NFTs on marketplace on mint */
    // NFT storage nft = _idToNFT[_tokenContract][_tokenId];
    // nft.owner = msg.sender;
    // nft.seller = msg.sender;
    // nft.price = _price;
    // nft.listed = true;

    emit NFTListed(_voucher.collection, _voucher.tokenId, msg.sender, _voucher.price);
  }

  /**
   * @dev List NFT on marketplace on NFT mint
   * @param _tokenId The NFT token id
   * @param _owner The NFT token owner
   */
  function listNFT(uint256 _tokenId, address _owner) external onlyKittyContract nonReentrant {
    _idToNFT[msg.sender][_tokenId] = NFT({
      nftContract: msg.sender,
      tokenId: _tokenId,
      seller: _owner,
      owner: _owner,
      price: 0,
      listed: false
    });
  }

  /**
   * @dev Buy NFT on marketplace
   * @param _voucher The KittyKartMarketplaceVoucher
   */
  function buyNFT(KittyKartMarketplaceVoucher calldata _voucher) external nonContract nonReentrant {
    address signer = _verify(_voucher);
    require(signer == gameServer, "KittyKartMarketplace: invalid signature");
    require(msg.sender == _voucher.user, "KittyKartMarketplace: invalid user");
    require(
      _voucher.collection == address(kittyKartGoKart) || _voucher.collection == address(kittyKartAsset),
      "KittyKartMarketplace: invalid NFT token contract"
    );
    require(_voucher.actionType == 1, "KittyKartMarketplace: invalid action");
    require(_voucher.nonce == nonces[_voucher.user], "KittyKartMarketplace: invalid nonce");
    require(_voucher.expiry == 0 || block.timestamp <= _voucher.expiry, "KittyKartMarketplace: signature is expired");
    require(!signatures[_voucher.signature], "KittyKartMarketplace: signature is used");
    require(
      IERC721AUpgradeable(_voucher.collection).ownerOf(_voucher.tokenId) != msg.sender,
      "KittyKartMarketplace: the owner of NFT token can not buy"
    );

    nonces[_voucher.user]++;
    signatures[_voucher.signature] = true;

    NFT memory nft = _idToNFT[_voucher.collection][_voucher.tokenId];
    require(nft.listed, "KittyKartMarketplace: NFT not listed");
    require(nft.price <= _voucher.price, "KittyKartMarketplace: insufficient KittyInu token price");
    // remove list info
    delete _idToNFT[_voucher.collection][_voucher.tokenId];
    // transfer KittyInu token from buyer to seller after take market fees
    uint256 marketFee = _calculateMarketFee(_voucher.price);
    kittyInu.transferFrom(msg.sender, address(this), marketFee);
    kittyInu.transferFrom(msg.sender, nft.seller, _voucher.price - marketFee);
    // transfer NFT token to buyer
    IERC721AUpgradeable(_voucher.collection).transferFrom(address(this), msg.sender, _voucher.tokenId);

    emit NFTSold(_voucher.collection, _voucher.tokenId, nft.seller, msg.sender, _voucher.price);
  }

  /**
   * @dev Make an offer to a NFT on marketplace
   * @param _voucher The KittyKartMarketplaceVoucher
   */
  function makeOffer(KittyKartMarketplaceVoucher calldata _voucher) external nonContract nonReentrant {
    address signer = _verify(_voucher);
    require(signer == gameServer, "KittyKartMarketplace: invalid signature");
    require(msg.sender == _voucher.user, "KittyKartMarketplace: invalid user");
    require(
      _voucher.collection == address(kittyKartGoKart) || _voucher.collection == address(kittyKartAsset),
      "KittyKartMarketplace: invalid NFT token contract"
    );
    require(_voucher.actionType == 2, "KittyKartMarketplace: invalid action");
    require(_voucher.nonce == nonces[_voucher.user], "KittyKartMarketplace: invalid nonce");
    require(_voucher.expiry == 0 || block.timestamp <= _voucher.expiry, "KittyKartMarketplace: signature is expired");
    require(!signatures[_voucher.signature], "KittyKartMarketplace: signature is used");
    require(
      IERC721AUpgradeable(_voucher.collection).ownerOf(_voucher.tokenId) != msg.sender,
      "KittyKartMarketplace: the owner of NFT token can not make an offer"
    );

    nonces[_voucher.user]++;
    signatures[_voucher.signature] = true;

    Offer memory offer = _idToOffer[_voucher.collection][_voucher.tokenId];
    require(offer.price < _voucher.price, "KittyKartMarketplace: offer price is too low");
    // upate offer info
    _idToOffer[_voucher.collection][_voucher.tokenId] = Offer({
      exists: true,
      buyer: msg.sender,
      price: _voucher.price
    });
    if (offer.exists) {
      // retrun KittyInu token to previous buyer
      kittyInu.transfer(offer.buyer, offer.price);
    }
    // transfer KittyInu token from buyer to marketplace
    kittyInu.transferFrom(msg.sender, address(this), _voucher.price);

    emit OfferMade(_voucher.collection, _voucher.tokenId, msg.sender, _voucher.price);
  }

  /**
   * @dev Accept an offer to a NFT on marketplace
   * @param _voucher The KittyKartMarketplaceVoucher
   */
  function acceptOffer(KittyKartMarketplaceVoucher calldata _voucher) external nonContract nonReentrant {
    address signer = _verify(_voucher);
    require(signer == gameServer, "KittyKartMarketplace: invalid signature");
    require(msg.sender == _voucher.user, "KittyKartMarketplace: invalid user");
    require(
      _voucher.collection == address(kittyKartGoKart) || _voucher.collection == address(kittyKartAsset),
      "KittyKartMarketplace: invalid NFT token contract"
    );
    require(_voucher.actionType == 3, "KittyKartMarketplace: invalid action");
    require(_voucher.nonce == nonces[_voucher.user], "KittyKartMarketplace: invalid nonce");
    require(_voucher.expiry == 0 || block.timestamp <= _voucher.expiry, "KittyKartMarketplace: signature is expired");
    require(
      IERC721AUpgradeable(_voucher.collection).ownerOf(_voucher.tokenId) == msg.sender,
      "KittyKartMarketplace: caller is not the owner of NFT token"
    );
    require(!signatures[_voucher.signature], "KittyKartMarketplace: signature is used");

    nonces[_voucher.user]++;
    signatures[_voucher.signature] = true;

    Offer memory offer = _idToOffer[_voucher.collection][_voucher.tokenId];
    require(offer.exists, "KittyKartMarketplace: offer doesn't exist");
    // remove offer info
    delete _idToOffer[_voucher.collection][_voucher.tokenId];
    // take market fee and transfer tokens to seller
    uint256 marketFee = _calculateMarketFee(offer.price);
    kittyInu.transfer(msg.sender, offer.price - marketFee);
    // transfer NFT from seller to buyer
    IERC721AUpgradeable(_voucher.collection).transferFrom(msg.sender, offer.buyer, _voucher.tokenId);

    emit OfferAccepted(_voucher.collection, _voucher.tokenId, msg.sender, offer.buyer, offer.price);
  }

  // -----------------------------------------
  // KittyKartMarketplace Internal Functions
  // -----------------------------------------
  /**
   * @dev Calculate market fee
   */
  function _calculateMarketFee(uint256 _amount) internal pure returns (uint256) {
    return (_amount * MARKET_FEE) / 100;
  }

  /**
   * @dev return a hash of the givne KittyKartMarketplaceVoucher
   */
  function _hash(KittyKartMarketplaceVoucher calldata _voucher) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            keccak256(
              "KittyKartMarketplaceVoucher(address user,address collection,uint256 tokenId,uint256 price,uint256 actionType,uint256 nonce,uint256 expiry)"
            ),
            _voucher.user,
            _voucher.collection,
            _voucher.tokenId,
            _voucher.price,
            _voucher.actionType,
            _voucher.nonce,
            _voucher.expiry
          )
        )
      );
  }

  /**
   * @dev verify the signature of a given KittyKartMarketplaceVoucher
   * @param _voucher KittyKartMarketplaceVoucher
   */
  function _verify(KittyKartMarketplaceVoucher calldata _voucher) internal view returns (address) {
    bytes32 digest = _hash(_voucher);
    return ECDSAUpgradeable.recover(digest, _voucher.signature);
  }
}
