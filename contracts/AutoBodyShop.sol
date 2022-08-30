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
import "erc721a-upgradeable/contracts/interfaces/IERC721AUpgradeable.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";

contract AutoBodyShop is Initializable, ReentrancyGuardUpgradeable, OwnableUpgradeable, PausableUpgradeable {
  ITablelandTables private tableland;

  IERC721AUpgradeable internal kittyKart;
  IERC721AUpgradeable internal kittyPaint;

  uint256 private kittyKartTableId;
  string private kittyKartTable;
  uint256 private kittyPaintTableId;
  string private kittyPaintTable;

  // -----------------------------------------
  // AutoBodyShop Initializer
  // -----------------------------------------
  /**
   * @dev Initializer function
   * @param _kittyKart KittyKart address
   * @param _kittyPaint KittyPaint address
   * @param _registry The registry address
   * @param _kittyKartTableId KittyKart Tableland table id
   * @param _kittyKartTable KittyKart Tableland table name
   * @param _kittyPaintTableId KittyPaint Tableland table id
   * @param _kittyPaintTable KittyPaint Tableland table name
   */
  function initialize(
    address _kittyKart,
    address _kittyPaint,
    address _registry,
    uint256 _kittyKartTableId,
    string memory _kittyKartTable,
    uint256 _kittyPaintTableId,
    string memory _kittyPaintTable
  ) external initializer {
    __Context_init();
    __Ownable_init();
    __ReentrancyGuard_init();
    __Pausable_init();

    require(_kittyKart != address(0) && _kittyPaint != address(0), "Invalid token address.");
    require(
      IERC165Upgradeable(_kittyKart).supportsInterface(0x80ac58cd) &&
        IERC165Upgradeable(_kittyPaint).supportsInterface(0x80ac58cd),
      "Non-erc721"
    );
    require(_registry != address(0), "Invalid registry address");

    kittyKart = IERC721AUpgradeable(_kittyKart);
    kittyPaint = IERC721AUpgradeable(_kittyPaint);
    tableland = ITablelandTables(_registry);
    kittyKartTableId = _kittyKartTableId;
    kittyKartTable = _kittyKartTable;
    kittyPaintTableId = _kittyPaintTableId;
    kittyPaintTable = _kittyPaintTable;
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
   * @param _paintId KittyPaint token id
   */
  function paint(uint256 _kartId, uint256 _paintId) external nonContract {
    require(kittyKart.ownerOf(_kartId) == msg.sender && kittyPaint.ownerOf(_paintId) == msg.sender, "Not an owner");
    // read paint metadata from TableLand
    tableland.runSQL(
      address(this),
      kittyPaintTableId,
      string.concat("SELECT color FROM", kittyPaintTable, "WHERE id = ", StringsUpgradeable.toString(_paintId), ";")
    );
  }
}