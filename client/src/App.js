import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { highestBid:0 ,highestBidder:0 ,highestBidderButton:0 ,contractBalance:0 ,contractBalanceButton:0, 
    acc4Balance:null, userBalance:0, userBalanceButton:0, thisUserBalanceButton:0,
    withdrawSum:0, withdrawButton:0, withdrawAcc: null,
    accountBalanceButton:0,
    web3: null, accounts: null, contract: null, bid: 0};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const response = await instance.methods.highestBid().call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, highestBid: response});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  bid = async () => {
    const { accounts, contract } = this.state;

    try{
      await contract.methods.bid().send({from:accounts[0], value: this.state.web3.utils.toWei(this.state.bid)});
    }
    catch(error){
      alert(
        `Your bid isn't high enough!`,
      );
      console.error(error);
    }

    

    const response1 = await contract.methods.highestBidder().call();
    const response2 = await contract.methods.highestBid().call();

    this.setState({ highestBidder: response1, highestBid: response2 });
  };

  withdraw = async () => {
    const { accounts, contract } = this.state;

    const response = await contract.methods.userBalances(accounts[0]).call();
    var noError = 0;

    try{
      await contract.methods.withdraw().send({from:accounts[0]});
      noError = 1;
    }
    catch(error){
      alert(
        `You have no balance to withdraw!`,
      );
      console.error(error);
    }
    
    if(noError === 1){
      if(this.state.withdrawButton === 0){
        this.setState({ withdrawSum: response, withdrawButton: 1 });
      }
      else{
        this.setState({ withdrawSum: response, withdrawButton: 0 });
      }
    }

  };




  getContractBalance = async () => {
    const contract  = this.state.contract;

    const response = await contract.methods.getContractBalance().call();

    if(this.state.contractBalanceButton === 0){
      this.setState({ contractBalance: response, contractBalanceButton: 1 });
    }
    else{
      this.setState({ contractBalance: response, contractBalanceButton: 0 });
    }
    
  };

  getHighestBidder= async () => {
    const contract = this.state.contract;

    const response = await contract.methods.highestBidder().call();

    if(this.state.highestBidderButton === 0){
      this.setState({ highestBidder: response, highestBidderButton: 1 });
    }
    else{
      this.setState({ highestBidder: response, highestBidderButton: 0 });
    }
    
  };

  getThisUserBalance= async () => {
    const { accounts, contract } = this.state;

    const response = await contract.methods.userBalances(accounts[0]).call();
    if(this.state.thisUserBalanceButton === 0){
      this.setState({ userBalance: response, thisUserBalanceButton: 1 });
    }
    else{
      this.setState({ userBalance: response, thisUserBalanceButton: 0 });
    }
    
  };

  getUserBalance= async () => {
    const contract  = this.state.contract;
    var noError = 0;
    var response
    try{
      response = await contract.methods.userBalances(this.state.acc4Balance).call();
      noError = 1;
    }
    catch(error){
      alert(
        `You enter invalid account!`,
      );
      console.error(error);
    }

    if(noError === 1){
      if(this.state.userBalanceButton === 0){
        this.setState({ userBalance: response, userBalanceButton: 1 });
      }
      else{
        this.setState({ userBalance: response, userBalanceButton: 0 });
      }
    }
  };
  
  getAccountBalance= async () => { 
    const { accounts, contract } = this.state;

      const response = await contract.methods.getAccountBalance(accounts[0]).call();

      if(this.state.accountBalanceButton === 0){
        this.setState({ accountBalance: response, accountBalanceButton: 1 });
      }
      else{
        this.setState({ accountBalance: response, accountBalanceButton: 0 });
      }
  };



  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    let contractBalanceInfo
    if(this.state.contractBalanceButton === 0 ){
      contractBalanceInfo = ""
    }
    else{
      contractBalanceInfo = <h4>The balance of the contract is: {this.state.contractBalance} Wei </h4>
    }

    let withdrawInfo
    if(this.state.withdrawButton === 0){
      withdrawInfo = ""
    }
    else{
      withdrawInfo = <h4>You just withdrew: {this.state.withdrawSum} Wei </h4>
    }

    let highestBidderInfo
    if(this.state.highestBidderButton === 0 ){
      highestBidderInfo = ""
    }
    else{
      highestBidderInfo = <h4> The highestBidder is: {this.state.highestBidder}</h4>
    }

    let thisUserBalanceInfo
    if(this.state.thisUserBalanceButton === 0){
      thisUserBalanceInfo = ""
    }
    else{
      thisUserBalanceInfo = <h4> Your userBalance is: {this.state.userBalance} Wei </h4>
    }


    let userBalanceInfo
    if(this.state.userBalanceButton === 0){
      userBalanceInfo = ""
    }
    else{
      userBalanceInfo = <h4> This account's userBalance is: {this.state.userBalance} Wei </h4>
    }

    let accountBalanceInfo
    if(this.state.accountBalanceButton === 0){
      accountBalanceInfo = ""
    }
    else{
      accountBalanceInfo = <h4> Your account Balance is: {this.state.accountBalance} Wei </h4>
    }

    return (
      <div className="App">
        <h1>Auction Started!</h1>
        
        <h4>The highestBid is : {this.state.highestBid} Wei</h4>
        
        <p>How much Ethereum do you want to bid?</p>
        <input type = "Number" onChange={(event)=> {this.setState({bid: event.target.value})}}/>
        <button onClick={this.bid}> Bid</button>

         <p> Press this button to withdraw your balance:</p>
        <button onClick={this.withdraw}> Withdraw</button>
        {withdrawInfo}

        <p> Press this button to check highestBidder:</p>
        <button onClick={this.getHighestBidder}> getHighestBidder</button>
        {highestBidderInfo}

        <p>Press this button to check contractBalance:</p>
        <button onClick={this.getContractBalance}> getContractBalance</button>
        {contractBalanceInfo}

        <p>Press this button to check your userBalance:</p>
        <button onClick={this.getThisUserBalance}> Your userBalance</button>
        {thisUserBalanceInfo}

        <p>Press this button to check your account Balance:</p>
        <button onClick={this.getAccountBalance}> Your accountBalance</button>
        {accountBalanceInfo}

        <p>Enter account to check its userBalance:</p>
        <input type = "text" onChange={(event)=> {this.setState({acc4Balance: event.target.value})}}/>
        <button onClick={this.getUserBalance}> getUserBalance</button>
        {userBalanceInfo}
    
      </div>
    );
  }
}

export default App;
