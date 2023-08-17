"use client"

import { useState } from "react"

export default function NftSection(){
    const [allNfts,setAllNfts] = useState(null)
    
    return(
    <>
        <section className="mb-10">
            <div className="h-full flex items-center justify-center gap-24  px-32 flex-wrap mt-16 cursor-pointer">
                <div className="card bg-white rounded-lg">
                    <div className="img h-64">
                        <img src="/ape.webp" alt="" className="h-full"/>
                    </div>
                    <div className="desc flex flex-col text-black ml-2 gap-1 font-medium">
                        <span>Bored Ape</span>
                        <span>Bored Ape club</span> 
                        <span>0.053 eth</span>
                    </div>
                </div>
                <div className="card bg-white rounded-lg">
                    <div className="img h-64">
                        <img src="/ape.webp" alt="" className="h-full"/>
                    </div>
                    <div className="desc flex flex-col text-black ml-2 gap-1 font-medium">
                        <span>Bored Ape</span>
                        <span>Bored Ape club</span> 
                        <span>0.053 eth</span>
                    </div>
                </div>
                <div className="card bg-white rounded-lg">
                    <div className="img h-64">
                        <img src="/ape.webp" alt="" className="h-full"/>
                    </div>
                    <div className="desc flex flex-col text-black ml-2 gap-1 font-medium">
                        <span>Bored Ape</span>
                        <span>Bored Ape club</span> 
                        <span>0.053 eth</span>
                    </div>
                </div>
                <div className="card bg-white rounded-lg">
                    <div className="img h-64">
                        <img src="/ape.webp" alt="" className="h-full"/>
                    </div>
                    <div className="desc flex flex-col text-black ml-2 gap-1 font-medium">
                        <span>Bored Ape</span>
                        <span>Bored Ape club</span> 
                        <span>0.053 eth</span>
                    </div>
                </div>
                <div className="card bg-white rounded-lg">
                    <div className="img h-64">
                        <img src="/ape.webp" alt="" className="h-full"/>
                    </div>
                    <div className="desc flex flex-col text-black ml-2 gap-1 font-medium">
                        <span>Bored Ape</span>
                        <span>Bored Ape club</span> 
                        <span>0.053 eth</span>
                    </div>
                </div>
                <div className="card bg-white rounded-lg">
                    <div className="img h-64">
                        <img src="/ape.webp" alt="" className="h-full"/>
                    </div>
                    <div className="desc flex flex-col text-black ml-2 gap-1 font-medium">
                        <span>Bored Ape</span>
                        <span>Bored Ape club</span> 
                        <span>0.053 eth</span>
                    </div>
                </div>
                <div className="card bg-white rounded-lg">
                    <div className="img h-64">
                        <img src="/ape.webp" alt="" className="h-full"/>
                    </div>
                    <div className="desc flex flex-col text-black ml-2 gap-1 font-medium">
                        <span>Bored Ape</span>
                        <span>Bored Ape club</span> 
                        <span>0.053 eth</span>
                    </div>
                </div>
                <div className="card bg-white rounded-lg">
                    <div className="img h-64">
                        <img src="/ape.webp" alt="" className="h-full"/>
                    </div>
                    <div className="desc flex flex-col text-black ml-2 gap-1 font-medium">
                        <span>Bored Ape</span>
                        <span>Bored Ape club</span> 
                        <span>0.053 eth</span>
                    </div>
                </div>
            </div>
        </section>
    
    </>
)}