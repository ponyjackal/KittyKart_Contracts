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

  ITablelandTables public tableland;
  string public metadataTable;
  uint256 public metadataTableId;
  string public attributeTable;
  uint256 public attributeTableId;

  string public baseURIString;
  string public tablePrefix;
  string public description;
  string public defaultImage;
  string public externalURL;

  // Game server address
  address public gameServer;
  // AutoBodyShop address
  address public autoBodyShop;
  // assetId => trait_type array
  mapping(uint256 => string[]) public traitTypes;

  // -----------------------------------------
  // KittyAsset Initializer
  // -----------------------------------------

  /**
   * @dev Initializer function
   * @param _baseURIString Base URI
   * @param _description Description
   * @param _image Image
   * @param _externalURL External URL
   * @param _royaltyReceiver Royalty receiver address
   */
  function initialize(
    string memory _baseURIString,
    string memory _description,
    string memory _image,
    string memory _externalURL,
    address payable _royaltyReceiver
  ) external initializerERC721A initializer {
    __Context_init();
    __Ownable_init();
    __ReentrancyGuard_init();
    __Pausable_init();
    __ERC721A_init("Kitty Asset", "KAsset");
    __ERC721Holder_init();
    __ERC2981_init();

    baseURIString = _baseURIString;
    tablePrefix = "kitty_asset_test";
    description = _description;
    defaultImage = _image;
    externalURL = _externalURL;

    // Use ERC2981 to set royalty receiver and fee
    _setDefaultRoyalty(_royaltyReceiver, ROYALTY_FEE);
  }

  // -----------------------------------------
  // kittyAsset Modifiers
  // -----------------------------------------

  modifier nonContract() {
    require(tx.origin == msg.sender, "Caller not a user");
    _;
  }

  modifier onlyGameServer() {
    require(msg.sender == gameServer, "not a GameServer");
    _;
  }

  modifier onlyAutoBodyShop() {
    require(msg.sender == autoBodyShop, "not an AutoBodyShp");
    _;
  }

  // -----------------------------------------
  // KittyAsset View Functions
  // -----------------------------------------

  function metadataURI() public view returns (string memory) {
    string memory base = _baseURI();
    return string.concat(base, "SELECT%20*%20FROM%20", metadataTable);
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURIString;
  }

  /**
   * @dev tokenURI is an example of how to turn a row in your table back into
   * erc721 compliant metadata JSON. Here, we do a simple SELECT statement
   * with function that converts the result into json.
   */
  function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
    require(_exists(_tokenId), "ERC721URIStorage: URI query for nonexistent token");
    string memory base = _baseURI();

    return
      string.concat(
        base,
        "SELECT%20json_object(%27id%27,id,%27name%27,name,%27description%27,description",
        ",%27image%27,image,%27external_url%27,external_url",
        ",%27attributes%27,json_group_array(json_object(%27display_type%27,display_type",
        ",%27trait_type%27,trait_type,%27value%27,value)))",
        "%20as%20meta%20FROM%20",
        metadataTable,
        "%20JOIN%20",
        attributeTable,
        "%20ON%20",
        metadataTable,
        ".id=",
        attributeTable,
        ".asset_id"
        "%20WHERE%20id=",
        StringsUpgradeable.toString(_tokenId),
        "%20GROUP%20BY%20id",
        "&mode=json"
      );
  }

  // -----------------------------------------
  // KittyAsset Owner Functions
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
    tableland = ITablelandTables(_registry);

    metadataTableId = tableland.createTable(
      address(this),
      /*
       *  CREATE TABLE prefix_chainId (
       *    int id,
       *    string name,
       *    string description,
       *    string image,
       *    string external_url,
       *  );
       */
      string.concat(
        "CREATE TABLE ",
        tablePrefix,
        "_",
        StringsUpgradeable.toString(block.chainid),
        " (id int, name text, description text, image text, external_url text);"
      )
    );

    metadataTable = string.concat(
      tablePrefix,
      "_",
      StringsUpgradeable.toString(block.chainid),
      "_",
      StringsUpgradeable.toString(metadataTableId)
    );

    attributeTableId = tableland.createTable(
      address(this),
      /*
       *  CREATE TABLE prefix_chainId (
       *    int asset_id,
       *    int kart_id DEFAULT NULL,
       *    string display_type,
       *    string trait_type,
       *    string value,
       *    int in_use, 0: not-applied, 1: currenly applied, 2: already applied and can't be applied anymore
       *  );
       */
      string.concat(
        "CREATE TABLE ",
        tablePrefix,
        "_attribute_",
        StringsUpgradeable.toString(block.chainid),
        " (asset_id int, kart_id int, display_type text, trait_type text, value text, in_use int);"
      )
    );

    attributeTable = string.concat(
      tablePrefix,
      "_attribute_",
      StringsUpgradeable.toString(block.chainid),
      "_",
      StringsUpgradeable.toString(attributeTableId)
    );

    return metadataTableId;
  }

  /**
   * @dev Set external URL
   * @param _externalURL The external URL
   */
  function setExternalURL(string memory _externalURL) external onlyOwner {
    externalURL = _externalURL;
    tableland.runSQL(
      address(this),
      metadataTableId,
      string.concat(
        "UPDATE ",
        metadataTable,
        " SET external_url = ",
        _externalURL,
        "||'?id='||id", // Turns every row's URL into a URL including get param for tokenId
        ";"
      )
    );
  }

  /**
   * @dev Set base URI
   * @param _baseURIString baseURIString
   */
  function setBaseURI(string memory _baseURIString) external onlyOwner {
    baseURIString = _baseURIString;
  }

  /**
   * @dev Set default image
   * @param _defaultImage defaultImage
   */
  function setDefaultImage(string memory _defaultImage) external onlyOwner {
    defaultImage = _defaultImage;
  }

  /**
   * @dev Set Description
   * @param _description description
   */
  function setDescription(string memory _description) external onlyOwner {
    description = _description;
    tableland.runSQL(
      address(this),
      metadataTableId,
      string.concat("UPDATE ", metadataTable, " SET description = ", _description, "||'?id='||id", ";")
    );
  }

  /**
   * @dev Set image URL
   * @param _tokenId token id
   * @param _image image url
   */
  function setImage(uint256 _tokenId, string memory _image) external onlyOwner {
    tableland.runSQL(
      address(this),
      metadataTableId,
      string.concat(
        "UPDATE ",
        metadataTable,
        " SET image = ",
        _image,
        "WHERE id = ",
        StringsUpgradeable.toString(_tokenId),
        ";"
      )
    );
  }

  /**
   * @dev Set game server
   * @param _gameServer The external URL
   */
  function setGameServer(address _gameServer) external onlyOwner {
    require(_gameServer != address(0), "Invalid game server address");
    gameServer = _gameServer;
  }

  /**
   * @dev Set auto body shop
   * @param _autoBodyShop AutoBodyShop address
   */
  function setAutoBodyShop(address _autoBodyShop) external onlyOwner {
    require(_autoBodyShop != address(0), "Invalid address");
    autoBodyShop = _autoBodyShop;
  }

  // -----------------------------------------
  // KittyAsset Mutative Functions
  // -----------------------------------------

  /**
   * @dev game server mints asset to the user
   * @param _to receiver address
   * @param _displayType display type of game asset
   * @param _traitType trait type of game asset
   * @param _value value of trait type
   */
  function safeMint(
    address _to,
    string memory _displayType,
    string memory _traitType,
    string memory _value
  ) external onlyGameServer {
    uint256 tokenId = _nextTokenId();

    tableland.runSQL(
      address(this),
      metadataTableId,
      string.concat(
        "INSERT INTO ",
        metadataTable,
        " (id, name, description, image, external_url) VALUES (",
        StringsUpgradeable.toString(tokenId),
        ", '#",
        StringsUpgradeable.toString(tokenId),
        "', '",
        description,
        "', '",
        defaultImage,
        "', '",
        externalURL,
        "');"
      )
    );

    tableland.runSQL(
      address(this),
      attributeTableId,
      string.concat(
        "INSERT INTO ",
        attributeTable,
        " (asset_id, display_type, trait_type, value, in_use) VALUES (",
        StringsUpgradeable.toString(tokenId),
        ", '",
        _displayType,
        "', '",
        _traitType,
        "', '",
        _value,
        "', 0",
        ");"
      )
    );

    traitTypes[tokenId].push(_traitType);

    _mint(_to, 1);
  }

  /**
   * @dev game server mints assets to the user
   * @param _to receiver address
   * @param _displayTypes display type of game asset
   * @param _traitTypes trait type of game asset
   * @param _values value of trait type
   */
  function safeBatchMint(
    address _to,
    string[] calldata _displayTypes,
    string[] calldata _traitTypes,
    string[] calldata _values
  ) external onlyGameServer {
    require(_traitTypes.length == _values.length, "Invalid arguments");

    uint256 tokenId = _nextTokenId();
    tableland.runSQL(
      address(this),
      metadataTableId,
      string.concat(
        "INSERT INTO ",
        metadataTable,
        " (id, name, description, image, external_url) VALUES (",
        StringsUpgradeable.toString(tokenId),
        ", '#",
        StringsUpgradeable.toString(tokenId),
        "', '",
        description,
        "', '",
        defaultImage,
        "', '",
        externalURL,
        "');"
      )
    );
    for (uint256 i = 0; i < _traitTypes.length; i++) {
      tableland.runSQL(
        address(this),
        attributeTableId,
        string.concat(
          "INSERT INTO ",
          attributeTable,
          " (asset_id, display_type, trait_type, value, in_use) VALUES (",
          StringsUpgradeable.toString(tokenId),
          ", '",
          _displayTypes[i],
          "', '",
          _traitTypes[i],
          "', '",
          _values[i],
          "', 0",
          ");"
        )
      );

      traitTypes[tokenId].push(_traitTypes[i]);
    }
    _mint(_to, 1);
  }

  /**
   * @dev Apply asset to kart (set kitty kart in asset attributes)
   * @param _assetId The asset id
   * @param _kartId The kitty kart id
   */
  function setKittyKart(uint256 _assetId, uint256 _kartId) external onlyAutoBodyShop nonReentrant {
    string[] memory assetTraitTypes = traitTypes[_assetId];
    string memory traitTypesString = "(";
    for (uint256 i = 0; i < assetTraitTypes.length - 1; i++) {
      traitTypesString = string.concat(traitTypesString, "'", assetTraitTypes[i], "',");
    }
    traitTypesString = string.concat(traitTypesString, "'", assetTraitTypes[assetTraitTypes.length - 1], "')");
    // update in_use for previously applied asset
    tableland.runSQL(
      address(this),
      attributeTableId,
      string.concat(
        "UPDATE ",
        attributeTable,
        " SET in_use = 2",
        " WHERE kart_id = ",
        StringsUpgradeable.toString(_kartId),
        " AND in_use = 1",
        " AND trait_type IN ",
        traitTypesString,
        ";"
      )
    );
    // set kart_id in asset attribute table
    tableland.runSQL(
      address(this),
      attributeTableId,
      string.concat(
        "UPDATE ",
        attributeTable,
        " SET in_use = 1",
        ", kart_id = ",
        StringsUpgradeable.toString(_kartId),
        " WHERE asset_id = ",
        StringsUpgradeable.toString(_assetId),
        ";"
      )
    );
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
