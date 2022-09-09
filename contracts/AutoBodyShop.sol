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
import "@tableland/evm/contracts/ITablelandTables.sol";

import "./interfaces/IKittyAsset.sol";
import "./interfaces/IKittyKart.sol";

contract AutoBodyShop is
  Initializable,
  ReentrancyGuardUpgradeable,
  OwnableUpgradeable,
  PausableUpgradeable,
  ERC721HolderUpgradeable
{
  ITablelandTables public tableland;

  IKittyKart public kittyKart;
  IKittyAsset public kittyAsset;

  // -----------------------------------------
  // AutoBodyShop Events
  // -----------------------------------------

  event SetRegistry(address registry);
  event SetKittyKart(address kittyKart);
  event SetKittyAsseet(address kittyAsset);
  event ApplyAssets(uint256 indexed tokenId, uint256[] indexed assetId);

  // -----------------------------------------
  // AutoBodyShop Initializer
  // -----------------------------------------
  /**
   * @dev Initializer function
   * @param _kittyKart KittyKart address
   * @param _kittyAsset kittyAsset address
   * @param _registry The registry address
   */
  function initialize(
    address _kittyKart,
    address _kittyAsset,
    address _registry
  ) external initializer {
    __Context_init();
    __Ownable_init();
    __ReentrancyGuard_init();
    __Pausable_init();
    __ERC721Holder_init();

    require(_kittyKart != address(0) && _kittyAsset != address(0), "AutoBodyShop: invalid token address.");
    require(_registry != address(0), "AutoBodyShop: invalid registry address");

    kittyKart = IKittyKart(_kittyKart);
    kittyAsset = IKittyAsset(_kittyAsset);
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
   * @dev set the KittyKart address
   * @param _kittyKart The registry address
   */
  function setKittyKart(address _kittyKart) external onlyOwner {
    require(_kittyKart != address(0), "AutoBodyShop: invalid kart token address");
    kittyKart = IKittyKart(_kittyKart);

    emit SetKittyKart(_kittyKart);
  }

  /**
   * @dev set the KittyAsset address
   * @param _kittyAsset The registry address
   */
  function setKittyAsset(address _kittyAsset) external onlyOwner {
    require(_kittyAsset != address(0), "AutoBodyShop: invalid asset token address");
    kittyAsset = IKittyAsset(_kittyAsset);

    emit SetKittyAsseet(_kittyAsset);
  }

  // -----------------------------------------
  // AutoBodyShop Mutative Functions
  // -----------------------------------------

  /**
   * @dev Apply assets attributes to a kart
   * @param _kartId KittyKart token id
   * @param _assetIds The array of kittyAsset token ids
   */
  function applyAssets(uint256 _kartId, uint256[] calldata _assetIds) external nonContract nonReentrant {
    require(kittyKart.ownerOf(_kartId) == msg.sender, "AutoBodyShop: not a kart owner");

    for (uint256 i = 0; i < _assetIds.length; i++) {
      require(kittyAsset.ownerOf(_assetIds[i]) == msg.sender, "AutoBodyShop: not an asset owner");
      kittyAsset.safeTransferFrom(msg.sender, address(this), _assetIds[i]);
      kittyAsset.setKittyKart(_assetIds[i], _kartId);
    }

    emit ApplyAssets(_kartId, _assetIds);
  }
}
