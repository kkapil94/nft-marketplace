"use client";

import { uploadFileToIPFS, uploadJSONToIPFS } from "@/helpers/pinata";
import { Contract, ethers } from "ethers";
import React, { useRef, useState } from "react";
import marketplace from "@/Marketplace.json";
import { toast } from "react-toastify";

export default function ListNft() {
  const formRef = useRef();
  const [nftDetails, setNftDetails] = useState({
    name: "",
    price: "",
    desc: "",
    file: "",
  });
  const [fileUrl, setFileUrl] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notify = toast;

  const handleChange = (e) => {
    setNftDetails({ ...nftDetails, [e.target.id]: e.target.value });
  };

  const handleFile = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Create local preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to IPFS
      notify.info("Uploading to IPFS...");
      const res = await uploadFileToIPFS(file);

      if (res.success) {
        setFileUrl(res.pinataURL);
        notify.success("File uploaded to IPFS!");
      }
    } catch (err) {
      console.log(err);
      notify.error("Failed to upload file");
    }
  };

  const uploadMetadata = async () => {
    const formData = new FormData(formRef.current);
    const name = formData.get("name");
    const desc = formData.get("desc");
    const price = formData.get("price");

    const jsonBody = { name, description: desc, price, image: fileUrl };
    try {
      const res = await uploadJSONToIPFS(jsonBody);
      if (res.success) {
        return res.pinataURL;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const listNft = async (e) => {
    e.preventDefault();
    if (!fileUrl) {
      notify.error("Please upload an image first");
      return;
    }

    try {
      setIsSubmitting(true);
      const metadata = await uploadMetadata();
      const { ethereum } = window;

      if (!ethereum) {
        notify.error("Please ensure that metamask is installed");
        setIsSubmitting(false);
        return;
      }

      notify.info("Creating your NFT listing...");

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );

      const formData = new FormData(formRef.current);
      const price = ethers.parseUnits(formData.get("price"), "ether");
      let listPrice = await contract.getListPrice();
      listPrice = listPrice.toString();

      const transaction = await contract.createToken(metadata, price, {
        value: listPrice,
      });
      await transaction.wait();

      setNftDetails({ price: "", name: "", desc: "", file: "" });
      setFileUrl(null);
      setImagePreview(null);
      setIsSubmitting(false);
      notify.success("NFT successfully listed!");
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
      notify.error("Failed to list NFT. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Create New NFT Listing
        </h1>
        <p className="text-gray-600">
          Fill out the form below to list your NFT on the marketplace
        </p>
      </div>

      <form ref={formRef} onSubmit={listNft} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                NFT Name
              </label>
              <input
                id="name"
                name="name"
                value={nftDetails.name}
                onChange={handleChange}
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter NFT name"
              />
            </div>

            <div>
              <label
                htmlFor="desc"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="desc"
                name="desc"
                value={nftDetails.desc}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Describe your NFT"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price (ETH)
              </label>
              <input
                id="price"
                name="price"
                value={nftDetails.price}
                onChange={handleChange}
                step="0.001"
                required
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="0.05"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Image
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center ${
                fileUrl ? "border-green-300 bg-green-50" : "border-gray-300"
              }`}
            >
              <input
                id="file"
                name="file"
                value={nftDetails.file}
                required
                type="file"
                className="hidden"
                onChange={(e) => {
                  handleChange(e);
                  handleFile(e);
                }}
              />

              {imagePreview ? (
                <div className="mb-3">
                  <img
                    src={imagePreview}
                    alt="NFT Preview"
                    className="mx-auto h-48 object-contain rounded"
                  />
                </div>
              ) : (
                <div className="py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    Click to browse or drag and drop
                  </p>
                </div>
              )}

              <label
                htmlFor="file"
                className="btn-secondary inline-block cursor-pointer mt-2"
              >
                {imagePreview ? "Change Image" : "Select Image"}
              </label>

              {fileUrl && (
                <p className="mt-2 text-xs text-green-600">
                  ✓ Uploaded to IPFS
                </p>
              )}
            </div>

            {nftDetails.name && nftDetails.price && imagePreview && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-sm text-gray-700 mb-2">
                  NFT Preview
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium">
                    {nftDetails.name}
                  </span>
                  <span className="text-indigo-600 font-semibold">
                    {nftDetails.price} ETH
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !fileUrl}
            className={`w-full btn-primary py-3 flex items-center justify-center ${
              isSubmitting || !fileUrl ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Creating NFT...
              </>
            ) : (
              "List NFT for Sale"
            )}
          </button>
          {!fileUrl && nftDetails.file && (
            <p className="text-xs text-amber-600 mt-2 text-center">
              Waiting for image to finish uploading...
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
