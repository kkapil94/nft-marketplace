const hre = require("hardhat");
const fs = require('fs')
const deploy = async()=>{
  const NFTMarketplace =await hre.ethers.deployContract("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.waitForDeployment();
  const data = {
    address: nftMarketplace.target,
    abi: JSON.parse(nftMarketplace.interface.formatJson())
  }
  fs.writeFileSync('./src/Marketplace.json', JSON.stringify(data));
  console.log("NFTMarketplace deployed at:",nftMarketplace.target);
}

deploy()
.then(()=>process.exit(0))
.catch((err)=>
{console.log(err);
process.exit(1);}
)
