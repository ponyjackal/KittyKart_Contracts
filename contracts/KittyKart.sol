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

  ITablelandTables public tableland;
  uint256 public metadataTableId;
  string public baseURIString;
  string public metadataTable;
  string public assetAttributeTable;
  string public tablePrefix;
  string public description;
  string public defaultImage;
  string public externalURL;
  string public defaultAnimationURL;

  // market restriction
  bool private _marketplaceProtection;
  mapping(address => bool) private _approvedMarketplaces;

  // -----------------------------------------
  // KittyKart Events
  // -----------------------------------------

  event CreateMetadataTable(string metadataTable, uint256 metadataTableId);
  event SetExternalURL(string externalURL);
  event SetDescription(string description);
  event SetAssetAttributeTable(string assetAttributeTable);
  event SetBaseURI(string baseURI);
  event SetDefaultImage(string defaultImage);
  event SetDefaultAnimationURL(string defaultAnimationURL);
  event SetImage(uint256 tokenId, string image);
  event Mint(address indexed to, uint256 quantity);

  // -----------------------------------------
  // KittyKart Initializer
  // -----------------------------------------

  /**
   * @dev Initializer function
   * @param _baseURIString Base URI
   * @param _description description
   * @param _image default image url
   * @param _animation default image url
   * @param _externalURL External URL
   * @param _royaltyReceiver Royalty receiver address
   */
  function initialize(
    string memory _baseURIString,
    string memory _description,
    string memory _image,
    string memory _animation,
    string memory _externalURL,
    address payable _royaltyReceiver
  ) external initializerERC721A initializer {
    __Context_init();
    __Ownable_init();
    __ReentrancyGuard_init();
    __Pausable_init();
    __ERC721A_init("Kitty Kart", "KKart");
    __ERC721Holder_init();
    __ERC2981_init();

    baseURIString = _baseURIString;
    tablePrefix = "kitty_kart_test";
    description = _description;
    defaultImage = _image;
    externalURL = _externalURL;
    defaultAnimationURL = _animation;

    // set restriction on marketplace
    _marketplaceProtection = true;

    // Use ERC2981 to set royalty receiver and fee
    _setDefaultRoyalty(_royaltyReceiver, ROYALTY_FEE);
  }

  // -----------------------------------------
  // KittyKart Modifiers
  // -----------------------------------------

  modifier nonContract() {
    require(tx.origin == msg.sender, "KittyKart: caller not a user");
    _;
  }

  // -----------------------------------------
  // KittyKart View Functions
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
    require(_exists(_tokenId), "KittyKart: URI query for nonexistent token");
    string memory base = _baseURI();

    return
      string.concat(
        base,
        "SELECT%20json_object(%27id%27,id,%27name%27,name,%27description%27,description",
        ",%27image%27,image,%27external_url%27,external_url,%animation_url%27,animation_url",
        ",%27attributes%27,json_group_array(json_object(%27display_type%27,display_type",
        ",%27trait_type%27,trait_type,%27value%27,value)))",
        "%20FROM%20",
        metadataTable,
        "%20LEFT%20JOIN%20",
        assetAttributeTable,
        "%20ON%20(",
        metadataTable,
        ".id=",
        assetAttributeTable,
        ".kart_id%20AND%20",
        assetAttributeTable,
        ".in_use=1)",
        "%20WHERE%20id=",
        StringsUpgradeable.toString(_tokenId),
        "%20GROUP%20BY%20id",
        "&mode=list"
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
       *    string animation_url,
       *  );
       */
      string.concat(
        "CREATE TABLE ",
        tablePrefix,
        "_",
        StringsUpgradeable.toString(block.chainid),
        " (id int, name text, description text, image text, external_url text, animation_url text);"
      )
    );

    metadataTable = string.concat(
      tablePrefix,
      "_",
      StringsUpgradeable.toString(block.chainid),
      "_",
      StringsUpgradeable.toString(metadataTableId)
    );

    emit CreateMetadataTable(metadataTable, metadataTableId);

    return metadataTableId;
  }

  /**
   * @dev Set external URL
   * @param _externalURL The external URL
   */
  function setExternalURL(string calldata _externalURL) external onlyOwner {
    externalURL = _externalURL;
    tableland.runSQL(
      address(this),
      metadataTableId,
      string.concat("UPDATE ", metadataTable, " SET external_url = ", "'", _externalURL, "'", ";")
    );

    emit SetExternalURL(_externalURL);
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
      string.concat("UPDATE ", metadataTable, " SET description = ", "'", _description, "'", ";")
    );

    emit SetDescription(_description);
  }

  /**
   * @dev Set asset attributes table
   * @param _assetAttributeTable description
   */
  function setAssetAttributeTable(string memory _assetAttributeTable) external onlyOwner {
    assetAttributeTable = _assetAttributeTable;

    emit SetAssetAttributeTable(_assetAttributeTable);
  }

  /**
   * @dev Set base URI
   * @param _baseURIString baseURIString
   */
  function setBaseURI(string memory _baseURIString) external onlyOwner {
    baseURIString = _baseURIString;

    emit SetBaseURI(_baseURIString);
  }

  /**
   * @dev Set default image
   * @param _image Image URL
   */
  function setDefaultImage(string memory _image) external onlyOwner {
    defaultImage = _image;

    emit SetDefaultImage(_image);
  }

  /**
   * @dev Set default animation URL
   * @param _animationURL Animation URL
   */
  function setDefaultAnimationURL(string memory _animationURL) external onlyOwner {
    defaultAnimationURL = _animationURL;

    emit SetDefaultImage(_animationURL);
  }

  /**
   * @dev Update image url
   * @param _tokenId TokenId
   * @param _image Image URL
   * @param _animationURL Animation URL
   */
  function setImage(
    uint256 _tokenId,
    string memory _image,
    string memory _animationURL
  ) external onlyOwner {
    tableland.runSQL(
      address(this),
      metadataTableId,
      string.concat(
        "UPDATE ",
        metadataTable,
        " SET image = '",
        _image,
        "', animation_url = '",
        _animationURL,
        "' WHERE id = ",
        StringsUpgradeable.toString(_tokenId),
        ";"
      )
    );

    emit SetImage(_tokenId, _image);
  }

  function setApprovedMarketplace(address market, bool approved) public onlyOwner {
    _approvedMarketplaces[market] = approved;
  }

  function setProtectionSettings(bool marketProtect) external onlyOwner {
    _marketplaceProtection = marketProtect;
  }

  // -----------------------------------------
  // KittyKart Mutative Functions
  // -----------------------------------------

  // TODO: need to update later
  /**
   * @dev Its free mint for test
   * @param _quantity The quantity value to mint
   */
  function publicMint(uint256 _quantity) external nonContract {
    uint256 tokenId = _nextTokenId();
    for (uint256 i = 0; i < _quantity; i++) {
      tableland.runSQL(
        address(this),
        metadataTableId,
        string.concat(
          "INSERT INTO ",
          metadataTable,
          " (id, name, description, image, external_url, animation_url) VALUES (",
          StringsUpgradeable.toString(tokenId + i),
          ", '#",
          StringsUpgradeable.toString(tokenId + i),
          "', '",
          description,
          "', '",
          defaultImage,
          "', '",
          externalURL,
          "', '",
          defaultAnimationURL,
          "');"
        )
      );
    }
    _mint(msg.sender, _quantity);

    emit Mint(msg.sender, _quantity);
  }

  function approve(address to, uint256 tokenId) public virtual override {
    if (_marketplaceProtection) {
      require(_approvedMarketplaces[to], "KittyKart: invalid Marketplace");
    }
    super.approve(to, tokenId);
  }

  function setApprovalForAll(address operator, bool approved) public virtual override {
    require(_approvedMarketplaces[operator], "KittyKart: invalid Marketplace");
    super.setApprovalForAll(operator, approved);
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
