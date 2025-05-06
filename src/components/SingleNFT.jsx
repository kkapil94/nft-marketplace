"use client";
import { Contract, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import marketplace from "@/Marketplace.json";
import axios from "axios";
import { GetIpfsUrlFromPinata } from "@/helpers/pinata";
import { toast } from "react-toastify";

export default function SingleNFT({ tokenId }) {
  const notify = toast;
  const [nft, setNft] = useState();
  const [loading, setLoading] = useState(true);
  const [processingPurchase, setProcessingPurchase] = useState(false);

  const singleNft = async () => {
    try {
      setLoading(true);
      const { ethereum } = window;
      if (!ethereum) {
        notify.error("Make sure metamask is connected");
        return;
      }
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      const tokenURI = await contract.tokenURI(tokenId);
      const listedToken = await contract.getListedTokenForId(tokenId);
      let metaData = await axios.get(GetIpfsUrlFromPinata(tokenURI));
      metaData = metaData.data;

      let item = {
        price: metaData.price,
        tokenId: tokenId,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: GetIpfsUrlFromPinata(metaData.image),
        name: metaData.name,
        description: metaData.description,
      };
      setNft(item);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const buy = async () => {
    try {
      setProcessingPurchase(true);
      const { ethereum } = window;
      if (!ethereum) {
        notify.error("Make sure metamask is connected");
        setProcessingPurchase(false);
        return;
      }
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      notify.info("Purchasing the NFT... Please wait");
      const transaction = await contract.executeSale(tokenId, {
        value: ethers.parseEther(nft.price),
      });
      const receipt = await transaction.wait();
      if (receipt.status) notify.success("Successfully purchased the NFT");

      setProcessingPurchase(false);
      // Refresh NFT data after purchase
      singleNft();
    } catch (err) {
      console.log(err);
      notify.error("Transaction failed");
      setProcessingPurchase(false);
    }
  };

  useEffect(() => {
    singleNft();
  }, []);

  return (
    <section className="section-container py-16">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        nft && (
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-auto object-contain rounded-lg"
                  style={{ maxHeight: "500px" }}
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                {nft.name}
              </h1>

              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <p className="text-lg text-gray-700 mb-1">
                  <span className="font-semibold">Price:</span>{" "}
                  <span className="font-bold text-indigo-600">
                    {nft.price} ETH
                  </span>
                </p>
                <div className="flex items-center text-gray-600 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Once purchased, this NFT will be transferred to your wallet
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  Description
                </h2>
                <p className="text-gray-700">{nft.description}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  Details
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Token ID</span>
                    <span className="font-medium">{nft.tokenId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Owner</span>
                    <span className="font-medium text-xs md:text-sm truncate max-w-[200px]">
                      {nft.owner}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Seller</span>
                    <span className="font-medium text-xs md:text-sm truncate max-w-[200px]">
                      {nft.seller}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={buy}
                  disabled={processingPurchase}
                  className={`btn-primary w-full py-3 flex items-center justify-center ${
                    processingPurchase ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {processingPurchase ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </section>
  );
}
