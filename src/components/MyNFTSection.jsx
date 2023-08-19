"use client"

import { Contract, ethers } from 'ethers';
import marketplace from "@/Marketplace.json"
import {toast} from "react-toastify"
import axios from "axios"
import React, { useEffect, useState } from 'react'
import { GetIpfsUrlFromPinata } from '@/helpers/pinata';

export default function MyNFTSection() {
  const [myNfts,setMyNfts] = useState([])
  const [user,setUser] = useState()
  const [total,setTotal] = useState(0)
  const notify = toast;
  const getMyNfts = async()=>{
    try {
      const {ethereum} = window;
      if (!ethereum) {
        notify("Metamask is not installed");
      }else{
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner();
        setUser(signer.getAddress());
        const contract = new Contract(marketplace.address,marketplace.abi,signer);
        const transaction = await contract.getMyNFTs();
        let sumPrice = 0 ;
        const items = await Promise.all(transaction.map(async i=>{
          let tokenURI = await contract.tokenURI(i.tokenId);
                tokenURI = GetIpfsUrlFromPinata(tokenURI)
                let metaData = await axios.get(tokenURI);
                metaData = metaData.data

                let price = ethers.formatUnits(i.price.toString(), 'ether');
                let item = {
                    price,
                    tokenId: i.tokenId,
                    seller: i.seller,
                    owner: i.owner,
                    image: GetIpfsUrlFromPinata(metaData.image),
                    name: metaData.name,
                    description: metaData.description,
                }
                sumPrice += Number(price);
                console.log(item);
                return item;
              }))
              setMyNfts(items)
              setTotal(sumPrice)
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(()=>{
    getMyNfts();
  },[])
  return (
    <>
        <section className='my-16'>
            <div>
              <div className='text-center'>
                  <div className='mb-4'>
                    <span className='text-4xl'>Wallet Address</span>
                  </div>
                  <div>
                    <span>{user}</span>
                  </div>
              </div>
              <div className='flex justify-center mt-20 gap-40 text-xl'>
                <div className='flex flex-col text-center'>
                  <span>Total NFTs:</span>
                  <span>{myNfts.length}</span>
                </div>
                <div className='flex flex-col text-center'>
                  <span>Total Value:</span>
                  <span>{total}</span>
                </div>
              </div>
              <div className='text-center mt-16 text-4xl'>
              <span >Your NFTs</span>
              </div>
              <div className="h-full flex items-center justify-between gap-24  px-40 flex-wrap mt-24">
                {myNfts.length?myNfts.map(nft=>
                (<div className="card bg-white rounded-lg cursor-pointer" key={nft.tokenId} >
                    <div className="img h-64">
                        <img src={nft.image} alt="" className="h-full"/>
                    </div>
                    <div className="desc flex flex-col text-black ml-2 gap-1 font-medium">
                        <span>{nft.name}</span>
                        <span>{nft.description}</span> 
                        <span>{nft.price} eth</span>
                    </div>
                </div>)):
                <div className='flex justify-center w-full'>
                  <span>No NFTs are listed by you</span>
                </div>
                }
            </div>
            </div>
        </section>
    </>
  )
}
