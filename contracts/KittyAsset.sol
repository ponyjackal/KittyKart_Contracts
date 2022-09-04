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

contract KittyAsset is
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
  string private _description;
  string private _defaultImage;
  string private _externalURL;

  // Game server address
  address private _gameServer;

  // -----------------------------------------
  // kittyAsset Initializer
  // -----------------------------------------

  /**
   * @dev Initializer function
   * @param baseURI Base URI
   * @param externalURL External URL
   * @param royaltyReceiver Royalty receiver address
   */
  function initialize(
    string memory baseURI,
    string memory description,
    string memory image,
    string memory externalURL,
    address payable royaltyReceiver
  ) external initializerERC721A initializer {
    __Context_init();
    __Ownable_init();
    __ReentrancyGuard_init();
    __Pausable_init();
    __ERC721A_init("Kitty Paint", "KPaint");
    __ERC721Holder_init();
    __ERC2981_init();

    _baseURIString = baseURI;
    _tablePrefix = "kitty_paint_testt";
    _description = description;
    _defaultImage = image;
    _externalURL = externalURL;

    // Use ERC2981 to set royalty receiver and fee
    _setDefaultRoyalty(royaltyReceiver, ROYALTY_FEE);
  }

  // -----------------------------------------
  // kittyAsset Modifiers
  // -----------------------------------------

  modifier nonContract() {
    require(tx.origin == msg.sender, "Caller not a user");
    _;
  }

  modifier onlyGameServer() {
    require(msg.sender == _gameServer, "non game server");
    _;
  }

  // -----------------------------------------
  // kittyAsset View Functions
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
   * @dev get game server address
   */
  function gameServer() external view onlyOwner returns (address) {
    return _gameServer;
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
        "SELECT%20json_object(%27id%27,id,%27name%27,name,%27description%27,description",
        ",%27image%27,image,%27external_link%27,external_link)",
        "%20as%20meta%20FROM%20",
        _metadataTable,
        "%20WHERE%20id=",
        StringsUpgradeable.toString(tokenId),
        "&mode=json"
      );
  }

  // -----------------------------------------
  // kittyAsset Owner Functions
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
       *    string image,
       *    string external_link,
       *  );
       */
      string.concat(
        "CREATE TABLE ",
        _tablePrefix,
        "_",
        StringsUpgradeable.toString(block.chainid),
        " (id int, name text, description text, image text, external_link text);"
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

  /**
   * @dev Set image URL
   * @param tokenId token id
   * @param image image url
   */
  function setImage(uint256 tokenId, string calldata image) external onlyOwner {
    _tableland.runSQL(
      address(this),
      _metadataTableId,
      string.concat(
        "UPDATE ",
        _metadataTable,
        " SET image = ",
        image,
        "WHERE id = ",
        StringsUpgradeable.toString(tokenId),
        ";"
      )
    );
  }

  /**
   * @dev Set game server
   * @param server The external URL
   */
  function setGameServer(address server) external onlyOwner {
    require(server != address(0), "Invalid address");
    _gameServer = server;
  }

  // -----------------------------------------
  // kittyAsset Mutative Functions
  // -----------------------------------------

  /**
   * @dev game server mints asset to the user
   * @param to receiver address
   * @param traitType trait type of game asset
   * @param value value of trait type
   */
  function safeMint(
    address to,
    string memory traitType,
    string memory value
  ) external onlyGameServer {
    uint256 tokenId = _nextTokenId();

    _tableland.runSQL(
      address(this),
      _metadataTableId,
      string.concat(
        "INSERT INTO ",
        _metadataTable,
        " (id, name, description, image, external_link) VALUES (",
        StringsUpgradeable.toString(tokenId),
        ", '#",
        StringsUpgradeable.toString(tokenId),
        "', '",
        _description,
        "', '",
        _defaultImage,
        "', '",
        _externalURL,
        "');"
      )
    );

    _mint(to, 1);
  }

  /**
   * @dev game server mints assets to the user
   * @param to receiver address
   * @param traitTypes trait type of game asset
   * @param values value of trait type
   */
  function safeBatchMint(
    address to,
    string[] calldata traitTypes,
    string[] calldata values
  ) external onlyGameServer {
    require(traitTypes.length == values.length, "Invalid arguments");

    uint256 tokenId = _nextTokenId();
    for (uint256 i = 0; i < traitTypes.length; i++) {
      _tableland.runSQL(
        address(this),
        _metadataTableId,
        string.concat(
          "INSERT INTO ",
          _metadataTable,
          " (id, name, description, image, external_link) VALUES (",
          StringsUpgradeable.toString(tokenId + i),
          ", '#",
          StringsUpgradeable.toString(tokenId + i),
          "', '",
          _description,
          "', '",
          _defaultImage,
          "', '",
          _externalURL,
          "');"
        )
      );
    }
    _mint(to, traitTypes.length);
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
