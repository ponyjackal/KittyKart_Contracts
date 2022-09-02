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
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";
import "hardhat/console.sol";

contract KittyKart is
  Initializable,
  ReentrancyGuardUpgradeable,
  OwnableUpgradeable,
  PausableUpgradeable,
  ERC721AUpgradeable,
  ERC721HolderUpgradeable,
  ERC2981Upgradeable
{
  uint256 public constant TOTAL_SUPPLY = 15000;
  uint256 public constant MINT_FEE = 0;
  uint96 public constant ROYALTY_FEE = 1000;

  ITablelandTables private _tableland;
  string private _baseURIString;
  string private _metadataTable;
  uint256 private _metadataTableId;
  string private _tablePrefix;
  string private _externalURL;

  // -----------------------------------------
  // KittyKart Initializer
  // -----------------------------------------

  /**
   * @dev Initializer function
   * @param baseURI Base URI
   * @param externalURL External URL
   * @param royaltyReceiver Royalty receiver address
   */
  function initialize(
    string memory baseURI,
    string memory externalURL,
    address payable royaltyReceiver
  ) external initializerERC721A initializer {
    __Context_init();
    __Ownable_init();
    __ReentrancyGuard_init();
    __Pausable_init();
    __ERC721A_init("Kitty Kart", "KKart");
    __ERC721Holder_init();
    __ERC2981_init();

    _baseURIString = baseURI;
    _tablePrefix = "kitty_kart_test";
    _externalURL = externalURL;

    // Use ERC2981 to set royalty receiver and fee
    _setDefaultRoyalty(royaltyReceiver, ROYALTY_FEE);
  }

  // -----------------------------------------
  // KittyKart Modifiers
  // -----------------------------------------

  modifier nonContract() {
    require(tx.origin == msg.sender, "Caller not a user");
    _;
  }

  // -----------------------------------------
  // KittyKart View Functions
  // -----------------------------------------

  function metadataURI() public view returns (string memory) {
    string memory base = _baseURI();
    return string.concat(base, "SELECT%20*%20FROM%20", _metadataTable);
  }

  function _baseURI() internal view override returns (string memory) {
    return _baseURIString;
  }

  /**
   * @dev get metadata table name
   */
  function metadataTable() external view onlyOwner returns (string memory) {
    return _metadataTable;
  }

  /**
   * @dev get metadata table id
   */
  function metadataTableId() external view onlyOwner returns (uint256) {
    return _metadataTableId;
  }

  /**
   * @dev tokenURI is an example of how to turn a row in your table back into
   * erc721 compliant metadata JSON. Here, we do a simple SELECT statement
   * with function that converts the result into json.
   */
  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
    string memory base = _baseURI();

    return
      string.concat(
        base,
        "SELECT%20json_object(%27id%27,id,%27external_link%27,external_link,%27color%27,color)%20as%20meta%20FROM%20",
        _metadataTable,
        "%20WHERE%20id=",
        StringsUpgradeable.toString(tokenId),
        "&mode=json"
      );
  }

  // -----------------------------------------
  // KittyKart Owner Functions
  // -----------------------------------------
  /**
   * @dev create table in TableLand
   * @param _registry The registry address
   */
  function createMetadataTable(address _registry) external payable onlyOwner returns (uint256) {
    /*
     * registry if the address of the Tableland registry. You can always find those
     * here https://github.com/tablelandnetwork/evm-tableland#currently-supported-chains
     */
    _tableland = ITablelandTables(_registry);

    _metadataTableId = _tableland.createTable(
      address(this),
      /*
       *  CREATE TABLE prefix_chainId (
       *    int id,
       *    string name,
       *    string description,
       *    string external_link,
       *    string color,
       *  );
       */
      string.concat(
        "CREATE TABLE ",
        _tablePrefix,
        "_",
        StringsUpgradeable.toString(block.chainid),
        " (id int, external_link text, color text);"
      )
    );

    _metadataTable = string.concat(
      _tablePrefix,
      "_",
      StringsUpgradeable.toString(block.chainid),
      "_",
      StringsUpgradeable.toString(_metadataTableId)
    );

    return _metadataTableId;
  }

  /**
   * @dev Set external URL
   * @param externalURL The external URL
   */
  function setExternalURL(string calldata externalURL) external onlyOwner {
    _externalURL = externalURL;
    _tableland.runSQL(
      address(this),
      _metadataTableId,
      string.concat(
        "update ",
        _metadataTable,
        " set external_link = ",
        externalURL,
        "||'?tokenId='||id", // Turns every row's URL into a URL including get param for tokenId
        ";"
      )
    );
  }

  // -----------------------------------------
  // KittyKart Mutative Functions
  // -----------------------------------------

  /**
   * @dev Its free mint for test
   * @param _quantity The quantity value to mint
   */
  function publicMint(uint256 _quantity) external nonContract {
    uint256 tokenId = _nextTokenId();
    for (uint256 i = 0; i < _quantity; i++) {
      _tableland.runSQL(
        address(this),
        _metadataTableId,
        string.concat(
          "INSERT INTO ",
          _metadataTable,
          " (id, external_link, color) VALUES (",
          StringsUpgradeable.toString(tokenId + i),
          ", '",
          _externalURL,
          "', 'blue');"
        )
      );
    }
    _mint(msg.sender, _quantity);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721AUpgradeable, ERC2981Upgradeable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
