// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    mapping(address => uint256) public debtFunds;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event Invest(address indexed investor, uint256 amount);
    event Redeem(address indexed investor, uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");

        balance += _amount;
        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;
        emit Withdraw(_withdrawAmount);
    }

    // Function to invest in debt funds
    function investInDebtFunds(uint256 _investAmount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");

        // Perform investment transaction
        balance -= _investAmount;
        debtFunds[msg.sender] += _investAmount;

        // Emit the event
        emit Invest(msg.sender, _investAmount);
    }

    // Function to redeem from debt funds
    function redeemFromDebtFunds(uint256 _redeemAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");

        // Ensure sufficient balance in debt funds for redemption
        require(debtFunds[msg.sender] >= _redeemAmount, "Insufficient balance for redemption");

        // Perform redemption transaction
        balance += _redeemAmount;
        debtFunds[msg.sender] -= _redeemAmount;

        // Emit the event
        emit Redeem(msg.sender, _redeemAmount);
    }
}
