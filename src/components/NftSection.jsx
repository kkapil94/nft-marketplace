"use client"

import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react"
import {toast} from "react-toastify"
import marketplace from "@/Marketplace.json"
import { GetIpfsUrlFromPinata } from "@/helpers/pinata";
import {useRouter} from "next/navigation"
import useStore from "@/app/store";
import axios from "axios";
import Link from "next/link";

export default function NftSection(){
    const [allNfts,setAllNfts] = useState([])
    const connected = useStore(state=>state.connected)
    const router = useRouter();
    const notify = toast;
    const getAllNfts =async ()=>{
        try {
            const {ethereum} = window;
            if (!ethereum) {
                notify.error("Make sure is metamaskmis installed")
                return
            }
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();

            const contract = new Contract(marketplace.address,marketplace.abi,signer);

            const transactions = await contract.getAllNFTs();
            const items = await Promise.all(transactions.map(async i=>{
                let tokenURI = await contract.tokenURI(i.tokenId);
                tokenURI = GetIpfsUrlFromPinata(tokenURI)
                console.log(tokenURI);
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
                console.log(item);
                return item;
            }))
            setAllNfts(items);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        console.log(connected);
       connected&&getAllNfts()
    },[connected])
    
    return(
    <>
        <section className="mb-10">
            <div className="h-full flex items-center justify-between gap-24  px-40 flex-wrap mt-16">
                {connected?allNfts.length?allNfts.map(nft=>
                (
                <div className="card bg-white rounded-lg cursor-pointer" key={nft.tokenId} onClick={()=>{router.push(`/nft/${nft.tokenId}`)}}>
                    <div className="img h-64">
                        <img src={nft.image} alt="" className="h-full"/>
                    </div>
                    <div className="desc flex flex-col text-black ml-2 gap-1 font-medium">
                        <span>{nft.name}</span>
                        <span>{nft.description}</span> 
                        <span>{nft.price} eth</span> 
                    </div>
                </div>)):'loading...':
                <div className="w-full flex items-center justify-center h-[calc(100vh-11rem)] text-4xl"><span>Please connect your wallet</span></div>}
            </div>
        </section>
    
    </>
)}