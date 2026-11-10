// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Escrow is Ownable, ReentrancyGuard, Pausable {
    IERC20 public stablecoin;
    address public taxCollector;
    uint256 public taxRateBps = 250; // 2.5%

    enum EscrowStatus { Pending, Released, Refunded, Cancelled }

    struct EscrowEntry {
        address buyer;
        address seller;
        uint256 amount;
        uint256 taxAmount;
        EscrowStatus status;
    }

    mapping(bytes32 => EscrowEntry) public escrows;

    event EscrowDeposited(bytes32 indexed escrowId, address buyer, address seller, uint256 amount);
    event EscrowReleased(bytes32 indexed escrowId, address seller, uint256 netAmount, uint256 taxAmount);
    event EscrowRefunded(bytes32 indexed escrowId, address buyer, uint256 amount);
    event TaxCollected(address collector, uint256 amount);

    constructor(address stablecoinAddress, address taxCollectorAddress) {
        stablecoin = IERC20(stablecoinAddress);
        taxCollector = taxCollectorAddress;
    }

    function setTaxRate(uint256 rateBps) external onlyOwner {
        require(rateBps <= 1000, "Tax too high");
        taxRateBps = rateBps;
    }

    function setTaxCollector(address collector) external onlyOwner {
        require(collector != address(0), "Collector required");
        taxCollector = collector;
    }

    function depositEscrow(bytes32 escrowId, address seller, uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "Amount required");
        require(seller != address(0), "Seller required");
        EscrowEntry storage entry = escrows[escrowId];
        require(entry.status == EscrowStatus.Pending || entry.status == EscrowStatus.Cancelled, "Escrow exists");

        uint256 taxAmount = (amount * taxRateBps) / 10000;
        entry.buyer = msg.sender;
        entry.seller = seller;
        entry.amount = amount;
        entry.taxAmount = taxAmount;
        entry.status = EscrowStatus.Pending;

        require(stablecoin.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit EscrowDeposited(escrowId, msg.sender, seller, amount);
    }

    function releaseEscrow(bytes32 escrowId) external whenNotPaused onlyOwner nonReentrant {
        EscrowEntry storage entry = escrows[escrowId];
        require(entry.status == EscrowStatus.Pending, "Invalid status");
        uint256 payout = entry.amount - entry.taxAmount;
        entry.status = EscrowStatus.Released;

        require(stablecoin.transfer(entry.seller, payout), "Payout failed");
        require(stablecoin.transfer(taxCollector, entry.taxAmount), "Tax transfer failed");
        emit EscrowReleased(escrowId, entry.seller, payout, entry.taxAmount);
    }

    function refundEscrow(bytes32 escrowId) external whenNotPaused onlyOwner nonReentrant {
        EscrowEntry storage entry = escrows[escrowId];
        require(entry.status == EscrowStatus.Pending, "Invalid status");
        entry.status = EscrowStatus.Refunded;

        require(stablecoin.transfer(entry.buyer, entry.amount), "Refund failed");
        emit EscrowRefunded(escrowId, entry.buyer, entry.amount);
    }

    function collectTax(bytes32 escrowId) external whenNotPaused onlyOwner {
        EscrowEntry storage entry = escrows[escrowId];
        require(entry.status == EscrowStatus.Released, "Not released");
        emit TaxCollected(taxCollector, entry.taxAmount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getEscrowDetails(bytes32 escrowId) external view returns (EscrowEntry memory) {
        return escrows[escrowId];
    }
}
