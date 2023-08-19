"use client"
import { Contract, ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import marketplace from "@/Marketplace.json"
import axios from 'axios';
import { GetIpfsUrlFromPinata } from '@/helpers/pinata';
import { toast } from 'react-toastify';

export default function SingleNFT({tokenId}) {
    console.log(tokenId);
    const notify = toast
    const [nft,setNft] = useState();
    const singleNft = async()=>{
        try {
            const {ethereum} = window;
            if (!ethereum) {
                notify("Make sure metamask is not connected");
                return
            }
                const provider = new ethers.BrowserProvider(ethereum)
                const signer = await provider.getSigner();
                const contract = new Contract(marketplace.address,marketplace.abi,signer)
                const tokenURI = await contract.tokenURI(tokenId);
                const listedToken = await contract.getListedTokenForId(tokenId);
                let metaData =await axios.get(GetIpfsUrlFromPinata(tokenURI));
                metaData = metaData.data
                console.log(metaData);
                let item = {
                    price: metaData.price,
                    tokenId: tokenId,
                    seller: listedToken.seller,
                    owner: listedToken.owner,
                    image: GetIpfsUrlFromPinata(metaData.image),
                    name: metaData.name,
                    description: metaData.description,
                }
                console.log(item);
                setNft(item)
        }catch (err) {
            console.log(err);
        }
    }
    const buy = async()=>{
        try {
            const {ethereum} = window;
            if (!ethereum) {
                notify("Make sure metamask is not connected");
                return
            }
            const provider = new ethers.BrowserProvider(ethereum)
            const signer = await provider.getSigner();
            const contract = new Contract(marketplace.address,marketplace.abi,signer)
            notify.info("Buying the nft... Please wait")
            const transaction = await contract.executeSale(tokenId,{value:ethers.parseEther(nft.price)});
            const receipt = await transaction.wait();
            if(receipt.status)
            notify.success("Successfully bought the nft");
            
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(()=>{
        singleNft()
    },[])
  return (
            <>
                {nft&&
                    <div className='flex items-center w-full h-[30rem]'>
                        <div className='flex items-center justify-center h-full w-6/12'>
                            <span className='border-2 border-solid border-slate-500 p-10'>
                                <img src={nft.image} className='h-96 object-contain' />
                            </span>
                        </div>
                        <div className='w-6/12 h-full flex flex-col justify-center gap-8 p-8'>
                            <h1 className='text-6xl'>{nft.name}</h1>
                            <div>
                                <p className='text-3xl mb-2'>
                                Description: {nft.description}
                                </p>
                                <span className='text-xl'>Owned by: {nft.owner}</span>
                            </div>
                            <div className='flex flex-col text-md'>
                                <span>price: {nft.price} eth</span>
                                <button onClick={buy} className='w-32 rounded-md mt-6 h-12 p-2 border-[1px] border-solid border-slate-600 bg-[#ac7eb1]'>Buy</button>
                            </div>
                        </div>
                    </div>
                }
            </>
  )
}
