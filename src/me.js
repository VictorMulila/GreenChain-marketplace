import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import './App.css';

function App() {
    const CONTRACT_ADDRESS = "0xb4857ebde6474958838c0f9444a822f09f7a17a9";
    const ABI = [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "seller",
            "type": "address"
          }
        ],
        "name": "ItemListed",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "name": "ItemPurchased",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "ItemRemoved",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "ItemTransferred",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_price",
            "type": "uint256"
          }
        ],
        "name": "listItem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "purchaseItem",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "removeItem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "transferItem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "getItemsByOwner",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "itemCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "itemExists",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "items",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isSold",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "ownedItems",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState("");
    const [items, setItems] = useState([]);
    const [ownedItems, setOwnedItems] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
          try {
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              setProvider(provider);

              const accounts = await provider.send("eth_requestAccounts", []);
              setAccount(accounts[0]);
              setIsConnected(true);

              const signer = provider.getSigner();
              setSigner(signer);

              const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
              setContract(contractInstance);

              loadItems(contractInstance);
              loadOwnedItems(contractInstance, accounts[0]);
          } catch (error) {
              console.error("Error connecting to MetaMask:", error);
          }
      } else {
          console.error("MetaMask is not installed");
      }
  };

    const purchaseItem = async (itemId, price) => {
        if (!contract || !account) {
            console.error("Contract or account not initialized");
            return;
        }

        try {
            const tx = await contract.purchaseItem(itemId, {
                value: ethers.utils.parseEther(price)
            });
            await tx.wait();
            // Refresh items after purchase
            loadItems(contract);
            loadOwnedItems(contract, account);
        } catch (error) {
            console.error("Error purchasing item:", error);
        }
    };

    useEffect(() => {
      // Check if wallet is already connected
      const checkConnection = async () => {
          if (typeof window.ethereum !== "undefined") {
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const accounts = await provider.listAccounts();
              if (accounts.length > 0) {
                  connectWallet();
              }
          }
      };
      checkConnection();
  }, []);

  const loadItems = async (contract) => {
      if (!contract) return;
      try {
          const itemCount = await contract.itemCount();
          let items = [];
          for (let i = 1; i <= itemCount; i++) {
              const item = await contract.items(i);
              items.push(item);
          }
          setItems(items);
      } catch (error) {
          console.error("Error loading items:", error);
      }
  };

  const loadOwnedItems = async (contract, owner) => {
      if (!contract || !owner) return;
      try {
          const ownedItemIds = await contract.getItemsByOwner(owner);
          let ownedItems = [];
          for (let i = 0; i < ownedItemIds.length; i++) {
              const item = await contract.items(ownedItemIds[i]);
              ownedItems.push(item);
          }
          setOwnedItems(ownedItems);
      } catch (error) {
          console.error("Error loading owned items:", error);
      }
  };

  const listItem = async (name, price) => {
      if (!contract) {
          console.error("Contract is not initialized");
          return;
      }
      if (!name || !price) {
          console.error("Please enter a valid name and price");
          return;
      }

      try {
          const tx = await contract.listItem(name, ethers.utils.parseEther(price));
          await tx.wait();
          loadItems(contract);
      } catch (error) {
          console.error("Error listing item:", error);
      }
  };

    return (
        <div className="App">
            <h1>Marketplace</h1>
            
            {!isConnected ? (
                <button className="connect-button" onClick={connectWallet}>
                    Connect to MetaMask
                </button>
            ) : (
                <div className="wallet-info">
                    <p>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
                </div>
            )}

            {isConnected && (
                <>
                    <div className="list-item">
                        <h2>List Item</h2>
                        <input id="itemName" placeholder="Item Name" className="input-field" />
                        <input id="itemPrice" placeholder="Item Price (in ETH)" className="input-field" />
                        <button 
                            className="button" 
                            onClick={() => {
                                const name = document.getElementById("itemName").value.trim();
                                const price = document.getElementById("itemPrice").value.trim();
                                if (!name || !price) {
                                    console.error("Please enter a valid name and price");
                                    return;
                                }
                                listItem(name, price);
                            }}
                            disabled={!contract}
                        >
                            List Item
                        </button>
                    </div>

                    <div className="items">
                        <h2>Items for Sale</h2>
                        {items.map((item) => (
                            <div key={item.id} className="item-card">
                                <p><strong>Name:</strong> {item.name}</p>
                                <p><strong>Price:</strong> {ethers.utils.formatEther(item.price)} ETH</p>
                                <p><strong>Owner:</strong> {item.owner}</p>
                                {item.owner.toLowerCase() !== account.toLowerCase() && !item.isSold && (
                                    <button
                                        className="buy-button"
                                        onClick={() => purchaseItem(item.id, ethers.utils.formatEther(item.price))}
                                    >
                                        Buy
                                    </button>
                                )}
                                {item.isSold && <p className="sold-text">SOLD</p>}
                            </div>
                        ))}
                    </div>

                    <div className="owned-items">
                        <h2>Your Items</h2>
                        {ownedItems.map((item) => (
                            <div key={item.id} className="item-card">
                                <p><strong>Name:</strong> {item.name}</p>
                                <p><strong>Price:</strong> {ethers.utils.formatEther(item.price)} ETH</p>
                                <p><strong>Owner:</strong> {item.owner}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default App;