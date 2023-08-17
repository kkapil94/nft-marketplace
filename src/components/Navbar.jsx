"use client"

import { ethers } from "ethers"
import Link from "next/link"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"

export default function Navbar(){

    const pages = [{name:"Marketplace",url:"/"},{name:"List NFT",url:"/list-nft"},{name:"Profile",url:"/profile"}]
    const [connect,setConnect] = useState(false)
    const notify = toast
    const connecWallet =async ()=>{
       try{ const {ethereum} = window;
        if(!ethereum){
            console.log("make sure the wallet is installed");
        }else{
            const provider =new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner()
            setConnect(true)
            toast.success("Wallet is connected");
        }}catch(err){
            notify.error("Request denied by user")
        }
    }
    const isWalletConnected = async()=>{
        const {ethereum} = window;
        if(!ethereum){
            console.log("make sure the wallet is installed");
        }else{
            const provider =new ethers.BrowserProvider(ethereum);
            const accounts = await provider.send("eth_accounts");
            if (accounts.length>0) {
                setConnect(true)
            }
        }
    }
    useEffect(()=>{
        isWalletConnected();
    })

    return(
        <>
            <nav className="bg-[#d5beeb] text-slate-900 h-16 flex items-center p-4 justify-between sticky top-0">
                <div className="rounded-full h-16 flex items-center text-xl">
                    <span>
                    <img src="/logo.png" alt="" className="h-16 object-contain p-2 "/>
                    </span>
                    <span>NFT mart</span>
                </div>
                <div className="flex gap-6 w-3/6 items-center pr-3 justify-end">
                    {pages.map((page,index)=>(<div key={index}>
                        <Link href={page.url}>
                        <span className="text-xl font-medium focus:border-b-[1px] focus:border-solid hover:border-b-[1px] pb-2 hover:border-solid focus:border-slate-700 hover:border-slate-700">
                            {page.name}
                        </span>
                        </Link>
                    </div>
                    ))}

                    <div>
                        <button  className={!connect?" p-2 bg-[#b6acb9] rounded-md":"p-2 bg-[#63eb63] rounded-md"} onClick={connecWallet}>
                            {connect?"Connected":"Connect Wallet"}
                        </button>
                    </div>
                </div>

            </nav>
        </>
    )
}