// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Dispute is AccessControl, Pausable {
    bytes32 public constant OFFICER_ROLE = keccak256("OFFICER_ROLE");

    enum DisputeStatus { Open, EvidenceSubmitted, Resolved, Rejected }

    struct Case {
        uint256 parcelId;
        address filer;
        string description;
        string evidenceHash;
        DisputeStatus status;
        uint256 createdAt;
        uint256 resolvedAt;
    }

    mapping(uint256 => Case) public disputes;
    uint256 public disputeCount;

    event DisputeCreated(uint256 indexed disputeId, uint256 parcelId, address indexed filer);
    event EvidenceSubmitted(uint256 indexed disputeId, string evidenceHash);
    event DisputeResolved(uint256 indexed disputeId, DisputeStatus status);

    constructor(address admin) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(OFFICER_ROLE, admin);
    }

    function createDispute(uint256 parcelId, string calldata description) external whenNotPaused {
        require(parcelId > 0, "Parcel required");
        disputeCount++;
        disputes[disputeCount] = Case({
            parcelId: parcelId,
            filer: msg.sender,
            description: description,
            evidenceHash: "",
            status: DisputeStatus.Open,
            createdAt: block.timestamp,
            resolvedAt: 0
        });
        emit DisputeCreated(disputeCount, parcelId, msg.sender);
    }

    function submitEvidence(uint256 disputeId, string calldata evidenceHash) external whenNotPaused {
        Case storage dispute = disputes[disputeId];
        require(dispute.status == DisputeStatus.Open || dispute.status == DisputeStatus.EvidenceSubmitted, "Cannot submit evidence");
        require(dispute.filer == msg.sender || hasRole(OFFICER_ROLE, msg.sender), "Unauthorized");
        dispute.evidenceHash = evidenceHash;
        dispute.status = DisputeStatus.EvidenceSubmitted;
        emit EvidenceSubmitted(disputeId, evidenceHash);
    }

    function resolveDispute(uint256 disputeId, bool approve) external whenNotPaused onlyRole(OFFICER_ROLE) {
        Case storage dispute = disputes[disputeId];
        require(dispute.status != DisputeStatus.Resolved && dispute.status != DisputeStatus.Rejected, "Already closed");
        dispute.status = approve ? DisputeStatus.Resolved : DisputeStatus.Rejected;
        dispute.resolvedAt = block.timestamp;
        emit DisputeResolved(disputeId, dispute.status);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
