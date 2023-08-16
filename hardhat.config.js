require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks:{
    sepolia:{
      url:process.env.NEXT_PUBLIC_ALCHEMY_API_URL,
      accounts:[process.env.NEXT_PUBLIC_PRIVATE_KEY]
    }
  },
  etherscan:{
    apiKey:{
      sepolia:process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
    }
  },
};
