import SingleNFT from "@/components/SingleNFT"

export default function NFTInfo({params}) {

  return (
    <>
        <SingleNFT tokenId={params.tokenId}/>
    </>
  )
}