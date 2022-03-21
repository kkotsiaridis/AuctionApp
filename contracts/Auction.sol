// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Auction{
    
    address public highestBidder; 
    uint public highestBid; 
    mapping(address => uint) public userBalances; 
    
    constructor() {
        highestBidder = msg.sender;
        highestBid = 0;
    }
    
    modifier canWithdraw(){
        require(userBalances[msg.sender] > 0,"You have no balance to withdraw!");
        _;
    }
    
    function bid() payable public {
        require(msg.value > highestBid,"Your bid isn't high enough!");
        uint b = userBalances[highestBidder];
        userBalances[highestBidder] = highestBid + b;
        highestBid = msg.value;
        highestBidder = msg.sender;
    }
    
    function withdraw() public canWithdraw {
        address payable sender = payable(msg.sender);
        uint b = userBalances[msg.sender];
        userBalances[msg.sender] = 0;
        require(sender.send(b),"Could not return your balance!");
    } 
    
    function getContractBalance() public view returns(uint){
        return address(this).balance;
    }
      
    function getAccountBalance(address _bidder) public view returns(uint){
        return address(_bidder).balance;
    }
    
    function isTheHighestBidder()public view returns(bool){
        if(msg.sender == highestBidder){
            return true;
        }
        return false;
    }
    
    receive() external payable{} 
}
