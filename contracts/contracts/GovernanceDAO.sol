// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract GovernanceDAO is AccessControl, Pausable {
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");

    struct Proposal {
        string title;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public voters;
    uint256 public proposalCount;
    uint256 public requiredMajority = 50;
    uint256 public votingPeriod = 3 days;

    event ProposalCreated(uint256 indexed proposalId, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId, bool success);

    constructor(address admin) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(GOVERNOR_ROLE, admin);
    }

    function createProposal(string calldata title, string calldata description) external whenNotPaused onlyRole(GOVERNOR_ROLE) {
        require(bytes(title).length > 0, "Title required");
        proposalCount++;
        proposals[proposalCount] = Proposal({
            title: title,
            description: description,
            yesVotes: 0,
            noVotes: 0,
            deadline: block.timestamp + votingPeriod,
            executed: false
        });
        emit ProposalCreated(proposalCount, title);
    }

    function vote(uint256 proposalId, bool support) external whenNotPaused {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp <= proposal.deadline, "Voting closed");
        require(!voters[proposalId][msg.sender], "Already voted");

        voters[proposalId][msg.sender] = true;
        if (support) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
        emit VoteCast(proposalId, msg.sender, support);
    }

    function executeProposal(uint256 proposalId) external whenNotPaused onlyRole(GOVERNOR_ROLE) {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.deadline, "Voting still open");
        require(!proposal.executed, "Already executed");

        proposal.executed = true;
        bool passed = proposal.yesVotes * 100 >= (proposal.yesVotes + proposal.noVotes) * requiredMajority;
        emit ProposalExecuted(proposalId, passed);
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
