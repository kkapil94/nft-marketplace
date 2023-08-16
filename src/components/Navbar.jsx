"use client"

import Link from "next/link"
import { useState } from "react"

export default function Navbar(){

    const pages = [{name:"Marketplace",url:"/"},{name:"List NFT",url:"/list-nft"},{name:"Profile",url:"/profile"}]
    const [connect,setConnect] = useState(false)

    return(
        <>
            <nav className="bg-[#d5beeb] text-slate-900 h-16 flex items-center p-4 justify-between">
                <div className="rounded-full h-16 flex items-center text-xl">
                    <span>
                    <img src="/logo.png" alt="" className="h-16 object-contain p-2 "/>
                    </span>
                    <span>NFT mart</span>
                </div>
                <div className="flex gap-6 w-3/6 items-center pr-3 justify-end">
                    {pages.map(page=>(<div>
                        <Link href={page.url}>
                        <span className="text-xl font-medium visited:border-b-[1px] visited:border-solid hover:border-b-[1px] pb-2 hover:border-solid visited:border-slate-700 hover:border-slate-700">
                            {page.name}
                        </span>
                        </Link>
                    </div>
                    ))}

                    <div>
                        <button  className=" p-2 bg-[#b6acb9] rounded-md">
                            {connect?"Connected":"Disconnected"}
                        </button>
                    </div>
                </div>

            </nav>
        </>
    )
}