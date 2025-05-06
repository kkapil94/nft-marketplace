"use client";

import { ethers } from "ethers";
import Link from "next/link";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import useStore from "@/app/store";

export default function Navbar() {
  const pages = [
    { name: "Marketplace", url: "/" },
    { name: "List NFT", url: "/list-nft" },
    { name: "Profile", url: "/profile" },
  ];
  const [connect, setConnect] = useState(false);
  const setConnected = useStore((state) => state.setConnected);
  const notify = toast;

  const connecWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("make sure the wallet is installed");
      } else {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        setConnect(true);
        setConnected(true);
        toast.success("Wallet is connected");
      }
    } catch (err) {
      notify.error("Request denied by user");
    }
  };

  const isWalletConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("make sure the wallet is installed");
    } else {
      const provider = new ethers.BrowserProvider(ethereum);
      const accounts = await provider.send("eth_accounts");
      if (accounts.length > 0) {
        setConnect(true);
        setConnected(true);
      }
    }
  };

  useEffect(() => {
    isWalletConnected();
  });

  return (
    <>
      <nav className="bg-white shadow-sm h-20 flex items-center px-6 lg:px-10 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="NFT Mart Logo"
            className="h-12 w-12 object-contain"
          />
          <span className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            NFT Mart
          </span>
        </div>

        <div className="flex gap-6 items-center">
          <div className="hidden md:flex gap-8">
            {pages.map((page, index) => (
              <div key={index}>
                <Link href={page.url}>
                  <span className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 px-1 py-2">
                    {page.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>

          <button
            className={`btn-connect ${
              !connect
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            onClick={connecWallet}
          >
            {connect ? "Wallet Connected" : "Connect Wallet"}
          </button>
        </div>
      </nav>
    </>
  );
}
