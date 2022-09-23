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
import "@tableland/evm/contracts/ITablelandTables.sol";

contract KittyKartMarketplace is
  Initializable,
  ReentrancyGuardUpgradeable,
  OwnableUpgradeable,
  PausableUpgradeable,
  ERC721HolderUpgradeable
{
  uint256 public constant MARKET_FEE = 5; // 5 %

  ITablelandTables public tableland;

  IERC721AUpgradeable public kittyKartGoKart; // KittyKartGoKart NFT token
  IERC721AUpgradeable public kittyKartAsset; // KittyKartAsset NFT token
  IERC20Upgradeable public kittyInu; // Kitty Inu ERC20 token

  struct NFT {
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool listed;
  }
  // NFT token contract => token id => NFT
  mapping(address => mapping(uint256 => NFT)) private _idToNFT;

  // -----------------------------------------
  // KittyKartGoKart Events
  // -----------------------------------------
  event NFTListed(address indexed tokenContract, uint256 indexed tokenId, address indexed seller, uint256 price);
  event NFTSold(address indexed tokenContract, uint256 indexed tokenId, address seller, address buyer, uint256 price);

  // -----------------------------------------
  // KittyKartMarketplace Initializer
  // -----------------------------------------
  /**
   * @dev Initializer function
   * @param _kittyKartGoKart KittyKartGoKart address
   * @param _kittyKartAsset kittyKartAsset address
   * @param _kittyKartAsset kittyKartAsset address
   * @param _registry The registry address
   */
  function initialize(
    IERC721AUpgradeable _kittyKartGoKart,
    IERC721AUpgradeable _kittyKartAsset,
    IERC20Upgradeable _kittyInu,
    address _registry
  ) external initializer {
    __Context_init();
    __Ownable_init();
    __ReentrancyGuard_init();
    __Pausable_init();
    __ERC721Holder_init();

    require(address(_kittyKartAsset) != address(0), "KittyKartMarketplace: invalid KittyKartGoKart address.");
    require(address(_kittyKartAsset) != address(0), "KittyKartMarketplace: invalid KittyKartAsset address.");
    require(address(_kittyInu) != address(0), "KittyKartMarketplace: invalid KittyInu token address.");
    require(_registry != address(0), "KittyKartMarketplace: invalid registry address");

    kittyKartGoKart = _kittyKartGoKart;
    kittyKartAsset = _kittyKartAsset;
    kittyInu = _kittyInu;
    tableland = ITablelandTables(_registry);
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
  // KittyKartMarketplace Mutative Functions
  // -----------------------------------------
  /**
   * @dev List NFT on sale by owner
   * @param _tokenContract The NFT token contract
   * @param _tokenId The NFT token id
   * @param _price The KittyInu token price
   */
  function list(
    address _tokenContract,
    uint256 _tokenId,
    uint256 _price
  ) external nonContract nonReentrant {
    require(
      _tokenContract == address(kittyKartGoKart) || _tokenContract == address(kittyKartAsset),
      "KittyKartMarketplace: invalid NFT token contract"
    );
    require(_price > 0, "KittyKartMarketplace: invalid KittyInu token price");
    require(
      IERC721AUpgradeable(_tokenContract).ownerOf(_tokenId) == msg.sender,
      "KittyKartMarketplace: caller is not the owner of NFT token"
    );

    IERC721AUpgradeable(_tokenContract).transferFrom(msg.sender, address(this), _tokenId);

    /* in case we don't list NFTs on marketplace on mint */
    _idToNFT[_tokenContract][_tokenId] = NFT({
      nftContract: _tokenContract,
      tokenId: _tokenId,
      seller: payable(msg.sender),
      owner: payable(msg.sender),
      price: _price,
      listed: true
    });

    /* in case we list NFTs on marketplace on mint */
    // NFT storage nft = _idToNFT[_tokenContract][_tokenId];
    // nft.owner = payable(msg.sender);
    // nft.seller = payable(msg.sender);
    // nft.price = _price;
    // nft.listed = true;

    emit NFTListed(_tokenContract, _tokenId, msg.sender, _price);
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
      seller: payable(_owner),
      owner: payable(_owner),
      price: 0,
      listed: false
    });
  }

  /**
   * @dev Buy NFT on marketplace
   * @param _tokenContract The NFT token contract
   * @param _tokenId The NFT token id
   * @param _amount The KittyInu token amount
   */
  function buyNFT(
    address _tokenContract,
    uint256 _tokenId,
    uint256 _amount
  ) external nonContract nonReentrant {
    require(
      _tokenContract == address(kittyKartGoKart) || _tokenContract == address(kittyKartAsset),
      "KittyKartMarketplace: invalid NFT token contract"
    );

    NFT memory nft = _idToNFT[_tokenContract][_tokenId];
    require(nft.listed, "KittyKartMarketplace: NFT not listed");
    require(nft.price <= _amount, "KittyKartMarketplace: insufficient KittyInu token price");

    uint256 marketFee = (_amount * MARKET_FEE) / 100;
    kittyInu.transferFrom(msg.sender, address(this), marketFee);
    kittyInu.transferFrom(msg.sender, nft.seller, _amount - marketFee);
    IERC721AUpgradeable(_tokenContract).transferFrom(address(this), msg.sender, _tokenId);

    _idToNFT[_tokenContract][_tokenId].owner = payable(msg.sender);
    _idToNFT[_tokenContract][_tokenId].price = 0;
    _idToNFT[_tokenContract][_tokenId].listed = false;

    emit NFTSold(_tokenContract, _tokenId, nft.seller, msg.sender, _amount);
  }
}
