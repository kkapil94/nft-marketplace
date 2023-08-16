"use client"

import React, { useRef } from 'react'

export default function ListNft() {
    const formRef = useRef();
    const formData = new FormData(formRef.current);
  return (
    <>
        
            <form ref={formRef} className='border-2 p-8 flex flex-col items-center justify-center gap-4 border-solid border-slate-300 rounded-md '>
                <div className='flex flex-col w-full'>
                    <label htmlFor="name" className='text-lg'>Name</label>
                    <input id="name" name='name' type="text" className='w-full h-8 p-2 text-black'/>
                </div>
                <div className='flex flex-col w-full'>
                    <label htmlFor="desc" className='text-lg'>Description</label>
                    <textarea id='desc' name="desc" cols={20} rows={5} className='w-full p-2 text-black'/>
                </div>
                <div className='flex flex-col w-full'>
                    <label htmlFor="price" className='text-lg'>Price(in ETH)</label>
                    <input id='price' type="number" className='w-full h-8 p-2 text-black'/>
                </div>
                <div className='flex flex-col w-full'>
                    <label htmlFor="file" className='text-lg'>Upload</label>
                    <input id='file' name='file' type="file" className='w-full h-8'/>
                </div>
                <div className='flex flex-col w-full'>
                    <button className='text-lg w-full border-2 border-solid border-slate-300 rounded-lg h-10' >Submit</button>
                </div>
            </form>
       
    </>
  )
}
