import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function HomePage() {
  const [account, setAccount] = useState(undefined);
  const [balance, setBalance] = useState(0);
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const checkWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    }
  };

  const getBalance = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(contractAddress, atm_abi.abi, provider);
    const currentBalance = await contract.balance();
    setBalance(currentBalance.toNumber());
  };

  const deposit = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atm_abi.abi, signer);
    try {
      const transaction = await contract.deposit(inputA, { value: inputA });
      await transaction.wait();
      getBalance();
      notify("Deposit successful", `You deposited ${inputA} ETH.`);
    } catch (error) {
      notify("Deposit failed", "There was an error processing your deposit.");
    }
  };

  const withdraw = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atm_abi.abi, signer);
    try {
      const transaction = await contract.withdraw(inputB);
      await transaction.wait();
      getBalance();
      notify("Withdrawal successful", `You withdrew ${inputB} ETH.`);
    } catch (error) {
      notify("Withdrawal failed", "There was an error processing your withdrawal.");
    }
  };

  const notify = (title, message) => {
    const newNotification = { title, message };
    setNotifications([newNotification, ...notifications]);
  };

  useEffect(() => {
    checkWallet();
    getBalance();

    
    const interval = setInterval(getBalance, 5000); // Update balance every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container">
      <header>
        <div className="button-container">
          <input
            type="number"
            placeholder="Enter ETH to deposit"
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
          />
          <button onClick={deposit}>Deposit ETH</button>
        </div>

        <div className="button-container">
          <input
            type="number"
            placeholder="Enter ETH to withdraw"
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
          />
          <button onClick={withdraw}>Withdraw ETH</button>
        </div>

        <h1>Welcome Naveen </h1>
        {account ? (
          <div className="account-info">
            <p>Account Holder: Naveen Kumar</p>
            <p>Account Type: Crypto Savings</p>
            <p>Account Opened Date: 01/01/23</p>
            <p>Address: M G Road, Bangalore, India</p>
            <p>Your Balance: {balance} ETH </p>
            <p>Account Address: {account}</p>
          </div>
        ) : (
          <p>Please install Metamask to use this ATM.</p>
        )}
      </header>

      {/* Display notifications in the right-bottom corner */}
      <div className="notifications">
        <h3>Notifications</h3>
        <div>
          {notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              <p>{notification.title}</p>
              <p>{notification.message}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .container {
          text-align: center;
          background-color: #8e44ad; /* Purple background */
          color: #ffffff; /* White text */
          padding: 20px;
          position: relative;
        }

        header {
          position: relative;
        }

        .button-container {
          display: flex;
          align-items: center;
          justify-content: flex-start; /* Align buttons to the left */
          margin: 10px;
        }

        input {
          margin-right: 10px;
        }

        button {
          padding: 10px;
          border: none;
          cursor: pointer;
        }

        /* Display notifications in the right-bottom corner */
        .notifications {
          position: fixed;
          bottom: 10px;
          right: 10px;
          text-align: center;
        }

        .notification-item {
          background-color: #2ecc71; /* Green background for notifications */
          color: #ffffff; /* White text */
          padding: 10px;
          margin-bottom: 5px;
          border-radius: 5px;
        }
      `}</style>
    </main>
  );
}
