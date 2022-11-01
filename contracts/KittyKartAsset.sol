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
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";
import "hardhat/console.sol";

contract KittyKartAsset is
  Initializable,
  ReentrancyGuardUpgradeable,
  OwnableUpgradeable,
  PausableUpgradeable,
  ERC721AUpgradeable,
  ERC721HolderUpgradeable,
  ERC2981Upgradeable,
  EIP712Upgradeable
{
  uint256 public constant TOTAL_SUPPLY = 15000;
  uint256 public constant MINT_FEE = 0;
  uint96 public constant ROYALTY_FEE = 1000;
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  string private constant SIGNING_DOMAIN = "KittyKartAssetVoucher";
  string private constant SIGNATURE_VERSION = "1";

  ITablelandTables public tableland;
  string public metadataTable;
  uint256 public metadataTableId;
  string public attributeTable;
  uint256 public attributeTableId;

  string public baseURIString;
  string public tablePrefix;
  string public description;
  string public externalURL;

  // Game server address
  address public gameServer;
  // market restriction
  bool private _marketplaceProtection;
  // market restriction
  mapping(address => bool) private _approvedMarketplaces;
  // KittyKartAssetVoucher nonces
  mapping(address => uint256) public nonces;

  // autoBodyShop address
  address public autoBodyShop;

  struct KittyKartAssetVoucher {
    address receiver;
    bytes16[] displayTypes;
    bytes16[] traitTypes;
    bytes16[] values;
    string image;
    string animationUrl;
    uint256 nonce;
    uint256 expiry;
    bytes signature;
  }

  // -----------------------------------------
  // KittyKartAsset Events
  // -----------------------------------------

  event CreateMetadataTable(
    string metadataTable,
    uint256 metadataTableId,
    string attributeTable,
    uint256 attributeTableId
  );
  event SetExternalURL(string externalURL);
  event SetBaseURI(string baseURIString);
  event SetDescription(string description);
  event SetImage(uint256 tokenId, string image);
  event SetBackgroundColor(uint256 tokenId, string color);
  event SetGameServer(address gameServer);
  event SetAutoBodyShop(address autoBodyShop);
  event SafeMint(
    address indexed to,
    uint256 tokenId,
    bytes16[] displayTypes,
    bytes16[] indexed traitTypes,
    bytes16[] values
  );
  event AccessGranted(address indexed to);
  event AccessRevoked(address indexed to);

  // -----------------------------------------
  // KittyKartAsset Initializer
  // -----------------------------------------

  /**
   * @dev Initializer function
   * @param _baseURIString Base URI
   * @param _description Description
   * @param _externalURL External URL
   * @param _royaltyReceiver Royalty receiver address
   */
  function initialize(
    string memory _baseURIString,
    string memory _description,
    string memory _externalURL,
    address payable _royaltyReceiver
  ) external initializerERC721A initializer {
    __Context_init();
    __Ownable_init();
    __ReentrancyGuard_init();
    __Pausable_init();
    __ERC721A_init("KittyKart Asset", "KKAsset");
    __ERC721Holder_init();
    __ERC2981_init();
    __EIP712_init(SIGNING_DOMAIN, SIGNATURE_VERSION);

    baseURIString = _baseURIString;
    tablePrefix = "kitty_asset_test";
    description = _description;
    externalURL = _externalURL;

    // set restriction on marketplace
    _marketplaceProtection = true;

    // Use ERC2981 to set royalty receiver and fee
    _setDefaultRoyalty(_royaltyReceiver, ROYALTY_FEE);
  }

  // -----------------------------------------
  // KittyKartAsset Modifiers
  // -----------------------------------------

  modifier nonContract() {
    require(msg.sender.code.length <= 0, "KittyKartAsset: caller not a user");
    _;
  }

  modifier onlyGameServer() {
    require(msg.sender == gameServer, "KittyKartAsset: not a GameServer");
    _;
  }

  // -----------------------------------------
  // KittyKartAsset View Functions
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
    require(_exists(_tokenId), "KittyKartAsset: URI query for nonexistent token");
    string memory base = _baseURI();

    return
      string.concat(
        base,
        "SELECT%20json_object(%27id%27,id,%27name%27,name,%27description%27,description",
        ",%27image%27,image,%27background_color%27,background_color,%27external_url%27,external_url,%27animation_url%27,animation_url",
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
        "&mode=list"
      );
  }

  // -----------------------------------------
  // KittyKartAsset Owner Functions
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
       *    string background_color,
       *    string external_url,
       *    string animation_url,
       *    string owner,
       *  );
       */
      string.concat(
        "CREATE TABLE ",
        tablePrefix,
        "_",
        StringsUpgradeable.toString(block.chainid),
        " (id int, name text, description text, image text, background_color text, external_url text, animation_url text, owner text);"
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

    emit CreateMetadataTable(metadataTable, metadataTableId, attributeTable, attributeTableId);

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
      string.concat("UPDATE ", metadataTable, " SET external_url = ", "'", _externalURL, "'", ";")
    );

    emit SetExternalURL(_externalURL);
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
    require(_exists(_tokenId), "KittyKartAsset: nonexistent token id");

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

  /**
   * @dev Update background color
   * @param _tokenId TokenId
   * @param _color Background Color
   */
  function setBackgroundColor(uint256 _tokenId, string memory _color) external onlyOwner {
    require(_exists(_tokenId), "KittyKartAsset: nonexistent token id");

    tableland.runSQL(
      address(this),
      metadataTableId,
      string.concat(
        "UPDATE ",
        metadataTable,
        " SET background_color = '",
        _color,
        "' WHERE id = ",
        StringsUpgradeable.toString(_tokenId),
        ";"
      )
    );

    emit SetBackgroundColor(_tokenId, _color);
  }

  /**
   * @dev Set game server
   * @param _gameServer The external URL
   */
  function setGameServer(address _gameServer) external onlyOwner {
    require(_gameServer != address(0), "KittyKartAsset: invalid game server address");
    gameServer = _gameServer;

    emit SetGameServer(_gameServer);
  }

  function setApprovedMarketplace(address market, bool approved) public onlyOwner {
    _approvedMarketplaces[market] = approved;
  }

  function setProtectionSettings(bool marketProtect) external onlyOwner {
    _marketplaceProtection = marketProtect;
  }

  // -----------------------------------------
  // KittyKartAsset Mutative Functions
  // -----------------------------------------

  /**
   * @dev Grant access of table to EOA
   * @param _to The address to grant access
   */
  function grantAccess(address _to) external onlyOwner {
    require(metadataTableId != 0 && attributeTableId != 0, "KittyKartAsset: tables are not created yet");
    tableland.runSQL(
      address(this),
      metadataTableId,
      string.concat(
        "GRANT INSERT, UPDATE, DELETE ON ",
        metadataTable,
        " TO ",
        "'",
        StringsUpgradeable.toHexString(_to),
        "'",
        ";"
      )
    );
    tableland.runSQL(
      address(this),
      attributeTableId,
      string.concat(
        "GRANT INSERT, UPDATE, DELETE ON ",
        attributeTable,
        " TO ",
        "'",
        StringsUpgradeable.toHexString(_to),
        "'",
        ";"
      )
    );
    emit AccessGranted(_to);
  }

  /**
   * @dev Revoke access of table to EOA
   * @param _to The address to grant access
   */
  function revokeAccess(address _to) external onlyOwner {
    require(metadataTableId != 0 && attributeTableId != 0, "KittyKartAsset: tables are not created yet");
    tableland.runSQL(
      address(this),
      metadataTableId,
      string.concat(
        "REVOKE INSERT, UPDATE, DELETE ON ",
        metadataTable,
        " FROM ",
        "'",
        StringsUpgradeable.toHexString(_to),
        "'",
        ";"
      )
    );
    tableland.runSQL(
      address(this),
      attributeTableId,
      string.concat(
        "REVOKE INSERT, UPDATE, DELETE ON ",
        attributeTable,
        " FROM ",
        "'",
        StringsUpgradeable.toHexString(_to),
        "'",
        ";"
      )
    );
    emit AccessRevoked(_to);
  }

  /**
   * @dev game server mints assets to the user
   * @param _voucher The KittyKartAssetVoucher
   */
  function safeMint(KittyKartAssetVoucher calldata _voucher) external nonContract {
    address signer = _verify(_voucher);
    require(_voucher.traitTypes.length == _voucher.values.length, "KittyKartAsset: invalid arguments");
    require(signer == gameServer, "KittyKartAsset: invalid signature");
    require(msg.sender == _voucher.receiver, "KittyKartAsset: invalid receiver");
    require(_voucher.nonce == nonces[_voucher.receiver], "KittyKartAsset: invalid nonce");
    require(_voucher.expiry == 0 || block.timestamp <= _voucher.expiry, "KittyKartAsset: asset is expired");

    uint256 tokenId = _nextTokenId();
    nonces[_voucher.receiver]++;

    tableland.runSQL(
      address(this),
      metadataTableId,
      string.concat(
        "INSERT INTO ",
        metadataTable,
        " (id, name, description, image, external_url, animation_url) VALUES (",
        StringsUpgradeable.toString(tokenId),
        ", '#",
        StringsUpgradeable.toString(tokenId),
        "', '",
        description,
        "', '",
        _voucher.image,
        "', '",
        externalURL,
        "', '",
        _voucher.animationUrl,
        "');"
      )
    );
    for (uint256 i = 0; i < _voucher.traitTypes.length; i++) {
      tableland.runSQL(
        address(this),
        attributeTableId,
        string.concat(
          "INSERT INTO ",
          attributeTable,
          " (asset_id, display_type, trait_type, value, in_use) VALUES (",
          StringsUpgradeable.toString(tokenId),
          ", '",
          _bytes16ToString(_voucher.displayTypes[i]),
          "', '",
          _bytes16ToString(_voucher.traitTypes[i]),
          "', '",
          _bytes16ToString(_voucher.values[i]),
          "', 0",
          ");"
        )
      );
    }
    _mint(_voucher.receiver, 1);

    emit SafeMint(_voucher.receiver, tokenId, _voucher.displayTypes, _voucher.traitTypes, _voucher.values);
  }

  function approve(address to, uint256 tokenId) public virtual override {
    if (_marketplaceProtection) {
      require(_approvedMarketplaces[to], "KittyKartAsset: invalid Marketplace");
    }
    super.approve(to, tokenId);
  }

  function setApprovalForAll(address operator, bool approved) public virtual override {
    require(_approvedMarketplaces[operator], "KittyKartAsset: invalid Marketplace");
    super.setApprovalForAll(operator, approved);
  }

  /**
   * @dev set the autobodyShop address
   * @param _autoBodyShop The address of the autobodyShop
   */
  function setAutoBodyShop(address _autoBodyShop) external onlyOwner {
    require(_autoBodyShop != address(0), "KittyKartAsset: invalid autobodyShop address");
    autoBodyShop = _autoBodyShop;

    emit SetAutoBodyShop(_autoBodyShop);
  }

  /**
   * Override isApprovedForAll to allow for autoBodyShop operator status.
   */
  function isApprovedForAll(address owner, address operator) public view override returns (bool) {
    // Whitelist OpenSea proxy contract for easy trading.
    if (operator == autoBodyShop && autoBodyShop != address(0)) {
      return true;
    }

    return super.isApprovedForAll(owner, operator);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721AUpgradeable, ERC2981Upgradeable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  // -----------------------------------------
  // KittyKartAsset Internal Functions
  // -----------------------------------------

  function _bytes16ToString(bytes16 _bytes16) internal pure returns (string memory) {
    uint8 i = 0;
    while (i < 16 && _bytes16[i] != 0) {
      i++;
    }
    bytes memory bytesArray = new bytes(i);
    for (i = 0; i < 16 && _bytes16[i] != 0; i++) {
      bytesArray[i] = _bytes16[i];
    }
    return string(bytesArray);
  }

  /**
   * @dev return a hash of the givne KittyKartAssetVoucher
   */
  function _hash(KittyKartAssetVoucher calldata _voucher) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            keccak256(
              "KittyKartAssetVoucher(address receiver,bytes16[] displayTypes,bytes16[] traitTypes,bytes16[] values,string image,string animationUrl,uint256 nonce,uint256 expiry)"
            ),
            _voucher.receiver,
            keccak256(abi.encodePacked(_voucher.displayTypes)),
            keccak256(abi.encodePacked(_voucher.traitTypes)),
            keccak256(abi.encodePacked(_voucher.values)),
            keccak256(bytes(_voucher.image)),
            keccak256(bytes(_voucher.animationUrl)),
            _voucher.nonce,
            _voucher.expiry
          )
        )
      );
  }

  /**
   * @dev verify the signature of a given KittyKartAssetVoucher
   * @param _voucher KittyKartVoucher
   */
  function _verify(KittyKartAssetVoucher calldata _voucher) internal view returns (address) {
    bytes32 digest = _hash(_voucher);
    return ECDSAUpgradeable.recover(digest, _voucher.signature);
  }

  /**
   * @dev We override this function to update owner on tableland table
   */
  function _beforeTokenTransfers(
    address from,
    address to,
    uint256 startTokenId,
    uint256 quantity
  ) internal override {
    for (uint256 i = startTokenId; i < quantity; i++) {
      tableland.runSQL(
        address(this),
        metadataTableId,
        string.concat(
          "UPDATE ",
          metadataTable,
          " SET owner = '",
          StringsUpgradeable.toHexString(to),
          "' WHERE id = ",
          StringsUpgradeable.toString(i),
          ";"
        )
      );
    }

    super._beforeTokenTransfers(from, to, startTokenId, quantity);
  }
}
