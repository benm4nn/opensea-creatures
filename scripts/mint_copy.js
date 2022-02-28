/*
to run:
cd /Users/randb/Documents/GitHub/KrazyPhaces-opensea/scripts/
node mint.js --network mumbai --n 3
*/

require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
//const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");

const fs = require('fs');
const path = require("path");

const INFURA_KEY = process.env.INFURA_KEY;
const MATIC_KEY = process.env.MATIC_KEY;
const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
const MNEMONIC = process.env.MNEMONIC;
console.log(process.env.MNEMONIC);
const BASE_URL = process.env.BASE_URL;

var NODE_API_KEY;
const isInfura = !!process.env.INFURA_KEY;

//* Remember to write the nft address in the .env file after deploying the contract
const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;

const NUM_CREATURES = 12;
const NUM_LOOTBOXES = 4;
const DEFAULT_OPTION_ID = 0;
const LOOTBOX_OPTION_ID = 2;

const NFT_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
    ],
    name: "mintTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const FACTORY_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_optionId",
        type: "uint256",
      },
      {
        name: "_toAddress",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  const network = `https://rpc-mumbai.maticvigil.com/v1/${MATIC_KEY}`;
  const provider = new HDWalletProvider(
    MNEMONIC,
    network
  );
  const web3Instance = new web3(provider);

  if (FACTORY_CONTRACT_ADDRESS) {
    console.log("FACTORY_CONTRACT_ADDRESS=" + FACTORY_CONTRACT_ADDRESS);
    const factoryContract = new web3Instance.eth.Contract(
      FACTORY_ABI,
      FACTORY_CONTRACT_ADDRESS,
        { gasLimit: "1000000",
          chainId: 80001, 
          networkCheckTimeout: 90000 
         }
    );

    // Creatures issued via the Factory. 
    for (var i = 0; i < NUM_CREATURES; i++) {
      const result = await factoryContract.methods
        .mintTo(OWNER_ADDRESS)
        //.mint(DEFAULT_OPTION_ID, OWNER_ADDRESS)
        .send({ from: OWNER_ADDRESS});
      console.log("Minted creature " + i + ". Transaction: " + result.transactionHash);
    }

    // Lootboxes issued directly to the owner.
    for (var i = 0; i < NUM_LOOTBOXES; i++) {
      const result = await factoryContract.methods
        .mint(LOOTBOX_OPTION_ID, OWNER_ADDRESS)
        .send({ from: OWNER_ADDRESS });
      console.log("Minted lootbox. Transaction: " + result.transactionHash);
    }
  } else if (NFT_CONTRACT_ADDRESS) {
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );

    // Creatures issued directly to the owner.
    for (var i = 0; i < NUM_CREATURES; i++) {
      const result = await nftContract.methods
        .mintTo(OWNER_ADDRESS)
        .send({ from: OWNER_ADDRESS });
      console.log("Minted creature. Transaction: " + result.transactionHash);
    }
  } else {
    console.error(
      "Add NFT_CONTRACT_ADDRESS or FACTORY_CONTRACT_ADDRESS to the environment variables"
    );
  }
}

main();

