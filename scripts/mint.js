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

//NUM_CREATURES = 12;
const NUM_LOOTBOXES = 4;
const DEFAULT_OPTION_ID = 0;
const LOOTBOX_OPTION_ID = 2;

//Process the arguments
const args = process.argv.slice(2);
const argMap = {};

if (args.length % 2)
  throw new Error('Invalid number of arguments');

for (let i = 0; i < args.length; i += 2) {
  let key = args[i];

  if (!/^--([a-z]+-)*[a-z]+$/g.test(key))
    throw new Error('Invalid argument name');

  key = key
    .replace(/^--/, '')
    .replace(/-([a-z])/g, g => g[1].toUpperCase());

  argMap[key] = args[i + 1];
};

//POST PROCESS the argMap
var CHAIN_URL;
var Options;

if (argMap.network) {
  switch (argMap.network.toLowerCase()) {
    case ("mainnet" || "live"):
      NODE_API_KEY = isInfura ? INFURA_KEY : ALCHEMY_KEY;
      CHAIN_URL = isInfura ? "https://" + network + ".infura.io/v3/" + INFURA_KEY : "https://eth-" + network + ".alchemyapi.io/v2/" + ALCHEMY_KEY;
      Options = {
        gas: 5000000,
        gasPrice: 5000000000,
        chainId: 1
      };
      break;
    case "rinkeby":
      NODE_API_KEY = ALCHEMY_KEY;
      CHAIN_URL = isInfura ? "" : "";
      Options = {
        gas: 8000000,
        network_id: 4,
        chainId: 4
      };
      break;
    case "mumbai":
      NODE_API_KEY = MATIC_KEY;
      CHAIN_URL = `https://rpc-mumbai.maticvigil.com/v1/${MATIC_KEY}`;
      Options = {
        network_id: 80001,
        confirmations: 2,
        skipDryRun: true,
        //If you don't set a gas fee, it will assume you have no gas and give the error 
        // Error:  *** Deployment Failed ***
        //"Migrations" could not deploy due to insufficient funds
        gas: 8000000,
        gasPrice: 10000000000,
        //    cumulativeGasUsed: 24500,
        //effectiveGasPrice: '0x2540be400',
        chainId: 80001
      };
      break;
    case "matic":
      NODE_API_KEY = MATIC_KEY;
      CHAIN_URL = `https://rpc-mainnet.maticvigil.com/v1/${MATIC_KEY}`;
      Options = {
        network_id: 137,
        // gas: 8000000,
        // gasPrice: 5000000000,
        confirmations: 2,
        chainId: 137
      };
      break;
    case "":
      console.error("Please set a valid network using argument --network <live, mainnet, rinkeby, mumbai, matic>");
      return;
      break;
    default:
      console.error("Please set a valid network, " + argMap.network.toLowerCase() + " is not valid. Use --network <live, mainnet, rinkeby, mumbai, matic>");
      return;
      break;
  }
};

//argument --n 8 means mint 8 items
var NUM_CREATURES = 1;
if (argMap.n) {
  NUM_CREATURES = parseInt(argMap.n, 10);
};

const MUMBAI = `https://rpc-mumbai.maticvigil.com/v1/${NODE_API_KEY}`
const MATIC = `https://rpc-mainnet.maticvigil.com/v1/${NODE_API_KEY}`
//const MAX_NUMBER = 11111;
//const NUM_ITEMS = 3;

//*Parse the contract artifact for ABI reference.
let rawdata = fs.readFileSync(path.resolve(__dirname, "../build/contracts/Creature.json"));

let contractAbi = JSON.parse(rawdata);
//const NFT_ABI = contractAbi.abi

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

  try {
    //*define web3, contract and wallet instances
    const provider = new HDWalletProvider(
      MNEMONIC,
      `https://rpc-mumbai.maticvigil.com/v1/${NODE_API_KEY}`/*,
      {
        network_id: 80001,
        confirmations: 2,
        skipDryRun: true,
        //If you don't set a gas fee, it will assume you have no gas and give the error 
        // Error:  *** Deployment Failed ***
        //"Migrations" could not deploy due to insufficient funds
        gas: 3000000,
        gasPrice: 10000000000
      }
      */
    );

    const web3Instance = new web3(provider);

    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      Options
    );

    //* just mint 
    /*
    await nftContract.methods
    .mintItem(OWNER_ADDRESS, "https://krazyphaces.herokuapp.com/api/token/")
    .send({ from: OWNER_ADDRESS }).then(console.log('minted')).catch(error => console.log(error));
    */

    for (var i = 0; i < NUM_CREATURES; i++) {

      const factoryContract = new web3Instance.eth.Contract(
        FACTORY_ABI,
        //FACTORY_CONTRACT_ADDRESS,
        "0x87981De7Ab124cd83089a2473cAeE8F6a501AB81",
        { gasLimit: "1000000" }
      );

      const result = await factoryContract.methods
      .mint(DEFAULT_OPTION_ID, OWNER_ADDRESS)

      //const result = await nftContract.methods

      //mint function needs to be found in the abi i.e. search in /build/contracts/Creature.json for the minting function
      //https://ethereum.stackexchange.com/questions/65370/contract-methods-transfer-is-a-not-a-function-error-using-web3
       //.mintTo(OWNER_ADDRESS, BASE_URL)
      
      // .mintTo(OWNER_ADDRESS)
      
       //need to include chainID here 
       //https://community.infura.io/t/deployment-failed-with-error-only-replay-protected-eip-155-transactions-allowed-over-rpc/2601
        .send({ from: OWNER_ADDRESS,  chainId: 80001, networkCheckTimeout: 90000});
        //gasPrice: "150000000000", gas: "9000000",
      console.log("Minted NFT " + (i+1) + ". Transaction: " + result.transactionHash);
    }

    /*
    for (var i = 1; i <= NUM_CREATURES; i++) {
      await nftContract.methods
        .mint(OWNER_ADDRESS, BASE_URL)
        .send({ from: OWNER_ADDRESS }).then(console.log('minted nft ' + i)).catch(error => console.log(error));
    }
    */

  }

  catch (e) {
    console.log(e)
  }
}

//invoke
main().then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

















/*
development: {
  host: "localhost",
  port: 7545,
  gas: 5000000,
  network_id: "*", // Match any network id
},
mumbai: {
  provider: function () {
    return new HDWalletProvider(MNEMONIC, `https://rpc-mumbai.maticvigil.com/v1/${MATIC_KEY}`);
  },
  network_id: 80001,
  confirmations: 2,
  skipDryRun: true,
  //If you don't set a gas fee, it will assume you have no gas and give the error
  // Error:  *** Deployment Failed ***
  //"Migrations" could not deploy due to insufficient funds
  gas: 3000000,
  gasPrice: 10000000000
},
matic: {
  provider: function () {
    return new HDWalletProvider(MNEMONIC, `https://rpc-mainnet.maticvigil.com/v1/${MATIC_KEY}`);
  },
  network_id: 137,
 // gas: 5000000,
//  gasPrice: 5000000000,
  confirmations: 2,
},
rinkeby: {
  provider: function () {
    return new HDWalletProvider(MNEMONIC, rinkebyNodeUrl);
  },
  //gas: 5000000,
  gas: 8000000,
  network_id: 4,
},
live: {
  network_id: 1,
  provider: function () {
    return new HDWalletProvider(MNEMONIC, mainnetNodeUrl);
  },
  gas: 5000000,
  gasPrice: 5000000000,
},
*/

/*
if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
  console.error("Please set a mnemonic, RPC API key, owner, network, and contract address.");
  return;
}

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

  const provider = new HDWalletProvider(
    MNEMONIC,
    CHAIN_URL
  );
  const web3Instance = new web3(provider);

  if (FACTORY_CONTRACT_ADDRESS) {
    const factoryContract = new web3Instance.eth.Contract(
      FACTORY_ABI,
      FACTORY_CONTRACT_ADDRESS,
      Options
    );

    // Creatures issued directly to the owner.
    for (var i = 0; i < NUM_CREATURES; i++) {
      const result = await factoryContract.methods
        .mint(DEFAULT_OPTION_ID, OWNER_ADDRESS)
        .send({ from: OWNER_ADDRESS });
      console.log("Minted creature. Transaction: " + result.transactionHash);
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


*/
