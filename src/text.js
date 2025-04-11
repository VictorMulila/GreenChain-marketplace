x return (
        <div className="App">
           <Navbar isConnected={isConnected} account={account} connectWallet={connectWallet} />

          

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
                                <p><strong>Price:$</strong> {ethers.utils.formatEther(item.price)*1551.04} USD</p>
                                <p><strong>Owner:</strong> {item.owner}</p>
                                {item.owner.toLowerCase() !== account.toLowerCase() && !item.isSold && (
                                    <button
                                        className="buy-button"
                                        onClick={() => purchaseItem(item.id)}>
    Buy for {ethers.utils.formatEther(item.price) } ETH
                                  
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