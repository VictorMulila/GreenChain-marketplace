import React from "react";
import { ethers } from "ethers";
import './ItemsForSale.css';

const ItemsForSale = ({ items, account, purchaseItem }) => {
  // Filter out items that are either owned by the account or already sold
  const filteredItems = items.filter(
    (item) =>
      item.owner.toLowerCase() !== account.toLowerCase() && !item.isSold
  );

  return (
    <div className="items">
      <h2>Items for Sale</h2>
      {filteredItems.length === 0 ? (
        <p>No items available for purchase.Make sure your Metamask wallet is connected</p>
      ) : (
        filteredItems.map((item) => (
          <div key={item.id.toString()} className="item-card">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Price: </strong>${(ethers.utils.formatEther(item.price) * 1551.04).toFixed(2)} USD</p>
            <p><strong>Owner:</strong> {item.owner}</p>

            <button
              className="buy-button"
              onClick={() => purchaseItem(item.id)}
            >
              Buy for {ethers.utils.formatEther(item.price)} ETH
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ItemsForSale;
