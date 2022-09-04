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
  ITablelandTables private tableland;

  IKittyKart internal kittyKart;
  IKittyAsset internal kittyAsset;

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

    require(_kittyKart != address(0) && _kittyAsset != address(0), "Invalid token address.");
    require(_registry != address(0), "Invalid registry address");

    kittyKart = IKittyKart(_kittyKart);
    kittyAsset = IKittyAsset(_kittyAsset);
    tableland = ITablelandTables(_registry);
  }

  // -----------------------------------------
  // AutoBodyShop Modifiers
  // -----------------------------------------

  modifier nonContract() {
    require(tx.origin == msg.sender, "Caller not a user");
    _;
  }

  /**
   * @dev Apply paint color to kart
   * @param _kartId KittyKart token id
   * @param _paintId kittyAsset token id
   */
  function paint(uint256 _kartId, uint256 _paintId) external nonContract {
    require(kittyKart.ownerOf(_kartId) == msg.sender && kittyAsset.ownerOf(_paintId) == msg.sender, "Not an owner");
    kittyAsset.safeTransferFrom(msg.sender, address(this), _paintId);
  }
}
