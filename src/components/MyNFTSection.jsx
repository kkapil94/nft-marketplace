"use client";

import { Contract, ethers } from "ethers";
import marketplace from "@/Marketplace.json";
import { toast } from "react-toastify";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { GetIpfsUrlFromPinata } from "@/helpers/pinata";
import { useRouter } from "next/navigation";

export default function MyNFTSection() {
  const [myNfts, setMyNfts] = useState([]);
  const [user, setUser] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const notify = toast;

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const getMyNfts = async () => {
    try {
      setLoading(true);
      const { ethereum } = window;
      if (!ethereum) {
        notify.error("Metamask is not installed");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUser(address);

      const contract = new Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      const transaction = await contract.getMyNFTs();

      let sumPrice = 0;
      const items = await Promise.all(
        transaction.map(async (i) => {
          let tokenURI = await contract.tokenURI(i.tokenId);
          tokenURI = GetIpfsUrlFromPinata(tokenURI);
          let metaData = await axios.get(tokenURI);
          metaData = metaData.data;

          let price = ethers.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.owner,
            image: GetIpfsUrlFromPinata(metaData.image),
            name: metaData.name,
            description: metaData.description,
          };
          sumPrice += Number(price);
          return item;
        })
      );

      setMyNfts(items);
      setTotal(sumPrice.toFixed(3));
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyNfts();
  }, []);

  return (
    <div className="section-container py-12">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                My NFT Portfolio
              </h1>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-3">
                  {user && user.substring(2, 4).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Wallet Address</p>
                  <div className="flex items-center">
                    <p className="font-medium text-gray-800 mr-2">
                      {user ? truncateAddress(user) : "Loading..."}
                    </p>
                    {user && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(user);
                          notify.success("Address copied!");
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Copy address"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center min-w-[120px]">
                <p className="text-gray-500 text-sm mb-1">Total NFTs</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {loading ? "..." : myNfts.length}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center min-w-[120px]">
                <p className="text-gray-500 text-sm mb-1">Total Value</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {loading ? "..." : `${total} ETH`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NFT List */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">
            Your NFT Collection
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : myNfts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myNfts.map((nft) => (
                <div
                  key={nft.tokenId}
                  className="nft-card cursor-pointer"
                  onClick={() => router.push(`/nft/${nft.tokenId}`)}
                >
                  <div className="h-64 overflow-hidden bg-gray-50">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{nft.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 truncate">
                      {nft.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-indigo-600">
                        {nft.price} ETH
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        You Own This
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No NFTs in Your Collection
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                You don&apos;t have any NFTs in your collection yet. Start by
                purchasing NFTs from the marketplace.
              </p>
              <button onClick={() => router.push("/")} className="btn-primary">
                Browse Marketplace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
