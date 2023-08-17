"use client"

import { uploadFileToIPFS, uploadJSONToIPFS } from '@/helpers/pinata';
import { Contract, ethers } from 'ethers';
import React, { useRef, useState } from 'react'
import marketplace from "@/Marketplace.json"
import { toast } from 'react-toastify';


export default function ListNft() {
    const formRef = useRef();
    const formData = new FormData(formRef.current);
    const notify = toast;
    const [nftDetails,setNftDetails] = useState({
        name:'',
        price:"",
        desc:"",
        file:""
    })
    const handleChange = (e)=>{
        setNftDetails({...nftDetails,[e.target.id]:e.target.value})
        console.log(nftDetails);
    }
    const [fileUrl,setFileUrl] = useState();
    const handleFile = async(e)=>{
        try{const file = e.target.files[0]
        const res = await uploadFileToIPFS(file);
        if (res.success) {
            setFileUrl(res.pinataURL)
        }}catch(err){
            console.log(err);
        }
    }
    const uploadMetadata = async()=>{

        const name = formData.get("name");
        const desc = formData.get("desc");
        const price = formData.get("price");
        console.log("price:",price);
        const jsonBody = {name,description:desc,price,image:fileUrl};
        try {
            const res = await uploadJSONToIPFS(jsonBody);
            if (res.success) {
                console.log(res.pinataURL);
                return res.pinataURL
            }
        } catch (error) {
            console.log(error);
            return error
        }
    }
    const listNft = async(e)=>{
        e.preventDefault()
        try{const metadata = await uploadMetadata()
        const {ethereum} = window;
        if (!ethereum) {
            notify("Please ensure that metamask is installed");
        }
        const provider = new ethers.BrowserProvider(ethereum);
        const signer =await provider.getSigner();
        const contract = new Contract(marketplace.address,marketplace.abi,signer);
        const price = ethers.parseUnits(formData.get("price"),"ether");
        let listPrice = await contract.getListPrice()
        listPrice = listPrice.toString()
        console.log(listPrice);
        const transaction = await contract.createToken(metadata,price,{value:listPrice})
        const receipt = await transaction.wait();
        setNftDetails({price:"",name:"",desc:"",file:""})
        if (receipt.status) {
            notify.success("NFT successfully listed");
        }
    }catch(err){
            console.log(err);
        }
    }

  return (
    <>
        
            <form ref={formRef} onSubmit={listNft}  className='border-2 p-8 flex flex-col items-center justify-center gap-4 border-solid border-slate-300 rounded-md '>
                <div className='flex flex-col w-full'>
                    <label htmlFor="name" className='text-lg'>Name</label>
                    <input id="name" name='name' value={nftDetails.name} onChange={handleChange} type="text" required className='w-full h-8 p-2 text-black'/>
                </div>
                <div className='flex flex-col w-full'>
                    <label htmlFor="desc" className='text-lg'>Description</label>
                    <textarea id='desc' name="desc" value={nftDetails.desc} onChange={handleChange} required cols={20} rows={5} className='w-full p-2 text-black'/>
                </div>
                <div className='flex flex-col w-full'>
                    <label htmlFor="price" className='text-lg'>Price(in ETH)</label>
                    <input id='price' name='price' value={nftDetails.price} onChange={handleChange} step="0.001" required type="number" className='w-full h-8 p-2 text-black'/>
                </div>
                <div className='flex flex-col w-full'>
                    <label htmlFor="file" className='text-lg'>Upload</label>
                    <input id='file' name='file' value={nftDetails.file} required type="file" className='w-full h-8' onChange={(e)=>{handleChange(e);handleFile(e)}}/>
                </div>
                <div className='flex flex-col w-full'>
                    <button type='submit' className='text-lg w-full border-2 border-solid border-slate-300 rounded-lg h-10' >Submit</button>
                </div>
            </form>

    </>
  )
}
