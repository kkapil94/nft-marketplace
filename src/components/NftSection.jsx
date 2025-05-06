"use client";

import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import marketplace from "@/Marketplace.json";
import { GetIpfsUrlFromPinata } from "@/helpers/pinata";
import { useRouter } from "next/navigation";
import useStore from "@/app/store";
import axios from "axios";

export default function NftSection() {
  const [allNfts, setAllNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const connected = useStore((state) => state.connected);
  const setConnected = useStore((state) => state.setConnected);
  const router = useRouter();
  const notify = toast;

  const connecWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        notify.error("Make sure the wallet is installed");
        return;
      }
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      setConnected(true);
      toast.success("Wallet is connected");
    } catch (err) {
      notify.error("Request denied by user");
    }
  };

  const getAllNfts = async () => {
    try {
      setLoading(true);
      const { ethereum } = window;
      if (!ethereum) {
        notify.error("Make sure Metamask is installed");
        return;
      }
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const contract = new Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );

      const transactions = await contract.getAllNFTs();
      const items = await Promise.all(
        transactions.map(async (i) => {
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
          return item;
        })
      );
      setAllNfts(items);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected) {
      getAllNfts();
    }
  }, [connected]);

  return (
    <section className="section-container">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-center mb-2">NFT Marketplace</h1>
        <p className="text-gray-600 text-center mb-8">
          Discover, collect, and sell extraordinary NFTs
        </p>
      </div>

      {connected ? (
        loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : allNfts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allNfts.map((nft) => (
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
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1 text-gray-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No NFTs available right now</p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)] text-center">
          <div className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Connect your wallet to browse and purchase NFTs from the marketplace
          </p>
          <button onClick={connecWallet} className="btn-primary">
            Connect Wallet
          </button>
        </div>
      )}
    </section>
  );
}
