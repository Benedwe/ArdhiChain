// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LandRegistry is ERC721URIStorage, AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant FREEZER_ROLE = keccak256("FREEZER_ROLE");

    struct LandParcel {
        string parcelId;
        address owner;
        string region;
        string district;
        string ward;
        string gpsCoordinates;
        string areaSize;
        string verificationStatus;
        string documentHash;
        uint256 createdAt;
        bool frozen;
    }

    mapping(uint256 => LandParcel) public parcels;
    mapping(string => bool) public parcelExists;
    uint256 public nextTokenId = 1;

    event LandRegistered(uint256 indexed tokenId, string parcelId, address indexed owner);
    event LandVerified(uint256 indexed tokenId, string status);
    event LandFrozen(uint256 indexed tokenId, bool frozen);
    event LandTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(GOVERNMENT_ROLE, msg.sender);
        _setupRole(VERIFIER_ROLE, msg.sender);
        _setupRole(FREEZER_ROLE, msg.sender);
    }

    function registerLand(
        string calldata parcelId,
        address owner,
        string calldata region,
        string calldata district,
        string calldata ward,
        string calldata gpsCoordinates,
        string calldata areaSize,
        string calldata documentHash,
        string calldata tokenURI
    ) external whenNotPaused nonReentrant {
        require(bytes(parcelId).length > 0, "Parcel ID required");
        require(!parcelExists[parcelId], "Parcel already registered");
        require(owner != address(0), "Owner required");

        uint256 tokenId = nextTokenId++;
        _safeMint(owner, tokenId);
        _setTokenURI(tokenId, tokenURI);

        parcels[tokenId] = LandParcel({
            parcelId: parcelId,
            owner: owner,
            region: region,
            district: district,
            ward: ward,
            gpsCoordinates: gpsCoordinates,
            areaSize: areaSize,
            verificationStatus: "Pending",
            documentHash: documentHash,
            createdAt: block.timestamp,
            frozen: false
        });

        parcelExists[parcelId] = true;
        emit LandRegistered(tokenId, parcelId, owner);
    }

    function verifyLand(uint256 tokenId, string calldata status) external whenNotPaused onlyRole(VERIFIER_ROLE) {
        require(_exists(tokenId), "Parcel not found");
        parcels[tokenId].verificationStatus = status;
        emit LandVerified(tokenId, status);
    }

    function freezeLand(uint256 tokenId, bool frozen) external whenNotPaused onlyRole(FREEZER_ROLE) {
        require(_exists(tokenId), "Parcel not found");
        parcels[tokenId].frozen = frozen;
        emit LandFrozen(tokenId, frozen);
    }

    function transferLand(uint256 tokenId, address to) external whenNotPaused nonReentrant {
        require(_exists(tokenId), "Parcel not found");
        require(!parcels[tokenId].frozen, "Parcel frozen");
        require(ownerOf(tokenId) == msg.sender, "Only owner can transfer");
        require(to != address(0), "Recipient required");

        _transfer(msg.sender, to, tokenId);
        parcels[tokenId].owner = to;
        emit LandTransferred(tokenId, msg.sender, to);
    }

    function pause() external onlyRole(GOVERNMENT_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(GOVERNMENT_ROLE) {
        _unpause();
    }

    function getLandDetails(uint256 tokenId) external view returns (LandParcel memory) {
        require(_exists(tokenId), "Parcel not found");
        return parcels[tokenId];
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
