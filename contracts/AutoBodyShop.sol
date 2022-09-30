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
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";

import "./interfaces/IKittyKartAsset.sol";
import "./interfaces/IKittyKartGoKart.sol";

/**
 * note This is just for testing purpose, once we build out backend serivce for AutoBodyShop, this will be deprecated
 */

contract AutoBodyShop is
  Initializable,
  ReentrancyGuardUpgradeable,
  OwnableUpgradeable,
  PausableUpgradeable,
  ERC721HolderUpgradeable,
  EIP712Upgradeable
{
  string private constant SIGNING_DOMAIN = "AutoBodyShopVoucher";
  string private constant SIGNATURE_VERSION = "1";

  ITablelandTables public tableland;

  IKittyKartGoKart public kittyKartGoKart;
  IKittyKartAsset public kittyKartAsset;

  // gameserver address
  address public gameServer;
  // AutoBodyShopVoucher nonces
  mapping(address => uint256) public nonces;

  struct AutoBodyShopVoucher {
    address owner;
    uint256 kartId;
    uint256[] assetIds;
    uint256 nonce;
    uint256 expiry;
    bytes signature;
  }

  // -----------------------------------------
  // AutoBodyShop Events
  // -----------------------------------------

  event SetRegistry(address registry);
  event SetKittyKartGoKart(address kittyKartGoKart);
  event SetGameServer(address gameServer);
  event SetKittyAsseet(address kittyKartAsset);
  event ApplyAssets(uint256 indexed tokenId, uint256[] indexed assetId);

  // -----------------------------------------
  // AutoBodyShop Initializer
  // -----------------------------------------
  /**
   * @dev Initializer function
   * @param _kittyKartGoKart KittyKartGoKart address
   * @param _kittyKartAsset kittyKartAsset address
   * @param _registry The registry address
   */
  function initialize(
    address _kittyKartGoKart,
    address _kittyKartAsset,
    address _registry
  ) external initializer {
    __Context_init();
    __Ownable_init();
    __ReentrancyGuard_init();
    __Pausable_init();
    __ERC721Holder_init();
    __EIP712_init(SIGNING_DOMAIN, SIGNATURE_VERSION);

    require(_kittyKartGoKart != address(0) && _kittyKartAsset != address(0), "AutoBodyShop: invalid token address.");
    require(_registry != address(0), "AutoBodyShop: invalid registry address");

    kittyKartGoKart = IKittyKartGoKart(_kittyKartGoKart);
    kittyKartAsset = IKittyKartAsset(_kittyKartAsset);
    tableland = ITablelandTables(_registry);
  }

  // -----------------------------------------
  // AutoBodyShop Modifiers
  // -----------------------------------------

  modifier nonContract() {
    require(tx.origin == msg.sender, "AutoBodyShop: caller not a user");
    _;
  }

  // -----------------------------------------
  // AutoBodyShop Owner Functions
  // -----------------------------------------

  /**
   * @dev set the registry address
   * @param _registry The registry address
   */
  function setRegistry(address _registry) external onlyOwner {
    require(_registry != address(0), "AutoBodyShop: invalid registry address");
    tableland = ITablelandTables(_registry);

    emit SetRegistry(_registry);
  }

  /**
   * @dev set the KittyKartGoKart address
   * @param _kittyKartGoKart The registry address
   */
  function setKittyKartGoKart(address _kittyKartGoKart) external onlyOwner {
    require(_kittyKartGoKart != address(0), "AutoBodyShop: invalid kart token address");
    kittyKartGoKart = IKittyKartGoKart(_kittyKartGoKart);

    emit SetKittyKartGoKart(_kittyKartGoKart);
  }

  /**
   * @dev set the game server address
   * @param _gameServer The game server address
   */
  function setGameServer(address _gameServer) external onlyOwner {
    require(_gameServer != address(0), "AutoBodyShop: invalid game server address");
    gameServer = _gameServer;

    emit SetGameServer(_gameServer);
  }

  /**
   * @dev set the KittyKartAsset address
   * @param _kittyKartAsset The registry address
   */
  function setKittyKartAsset(address _kittyKartAsset) external onlyOwner {
    require(_kittyKartAsset != address(0), "AutoBodyShop: invalid asset token address");
    kittyKartAsset = IKittyKartAsset(_kittyKartAsset);

    emit SetKittyAsseet(_kittyKartAsset);
  }

  // -----------------------------------------
  // AutoBodyShop Mutative Functions
  // -----------------------------------------

  /**
   * @dev Apply assets attributes to a kart
   * @param _voucher The AutoBodyShopVoucher
   */
  function applyAssets(AutoBodyShopVoucher calldata _voucher) external nonContract nonReentrant {
    address signer = _verify(_voucher);
    require(signer == gameServer && msg.sender == _voucher.owner, "AutoBodyShop: invalid call");
    require(kittyKartGoKart.ownerOf(_voucher.kartId) == msg.sender, "AutoBodyShop: not a kart owner");

    for (uint256 i = 0; i < _voucher.assetIds.length; i++) {
      require(kittyKartAsset.ownerOf(_voucher.assetIds[i]) == msg.sender, "AutoBodyShop: not an asset owner");
      kittyKartAsset.safeTransferFrom(msg.sender, address(this), _voucher.assetIds[i]);
      kittyKartAsset.setKittyKartGoKart(_voucher.assetIds[i], _voucher.kartId);
    }

    emit ApplyAssets(_voucher.kartId, _voucher.assetIds);
  }

  /**
   * @dev return a hash of the givne AutoBodyShopVoucher
   */
  function _hash(AutoBodyShopVoucher calldata _voucher) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            keccak256(
              "AutoBodyShopVoucher(address owner,uint256 kartId,uint256[] assetIds,uint256 nonce,uint256 expiry)"
            ),
            _voucher.owner,
            _voucher.kartId,
            keccak256(abi.encodePacked(_voucher.assetIds)),
            _voucher.nonce,
            _voucher.expiry
          )
        )
      );
  }

  /**
   * @dev verify the signature of a given AutoBodyShopVoucher
   * @param _voucher KittyKartVoucher
   */
  function _verify(AutoBodyShopVoucher calldata _voucher) internal view returns (address) {
    bytes32 digest = _hash(_voucher);
    return ECDSAUpgradeable.recover(digest, _voucher.signature);
  }
}
