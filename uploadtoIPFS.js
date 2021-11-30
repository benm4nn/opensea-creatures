/*
To install:
npm install --save @pinata/sdk

To run:
cd /Users/randb/Documents/GitHub/KrazyPhaces-opensea
node uploadtoIPFS.js

https://docs.pinata.cloud/pinata-node-sdk

*/

require('dotenv').config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

console.log("PINATA_API_KEY: " + PINATA_API_KEY);
console.log("PINATA_API_SECRET: " + PINATA_API_SECRET);

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});

/*
Response:
{
    IpfsHash: This is the IPFS multi-hash provided back for your content,
    PinSize: This is how large (in bytes) the content you just pinned is,
    Timestamp: This is the timestamp for your content pinning (represented in ISO 8601 format)
}
*/


//Pin the entire contents of a directory...
/*

const sourcePath = '/Users/randb/Documents/KrazyPhaces/output/';
const options = {
    pinataMetadata: {
        name: 'KrazyPhaces'//,
        //keyvalues: {
        //    customKey: 'customValue',
        //    customKey2: 'customValue2'
        //}
    },
    pinataOptions: {
        cidVersion: 0
    }
};
pinata.pinFromFS(sourcePath, options).then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});

*/


//List the contents of a directory

const metadataFilter = {
    //name: ''//,
    /* keyvalues: {
        testKeyValue: {
            value: 'exampleFilterValue',
            op: 'exampleFilterOperation'
        },
        testKeyValue2: {
            value: 'exampleFilterValue2',
            op: 'exampleFilterOperation2'
        }
    }
    */
};

const filters = {
    status: 'pinned',
    pageLimit: 1000,
    pageOffset: 0,
    metadata: metadataFilter
};

pinata.pinList(filters).then((result) => {
    //handle results here
    console.log(result);

    for (let i = 0; i < result.count; i++) {
        console.log("File " + i + ": " + result.rows[i].ipfs_pin_hash);
    };


    console.log("The ipfs pin hash is: " + result.count + " " + result.rows[0].ipfs_pin_hash);
    console.log("metadata: " + result.rows[0].metadata[0]);
}).catch((err) => {
    //handle error here
    console.log(err);
});


//Remove a list of files
//https://knowledge.pinata.cloud/en/articles/5506008-how-to-remove-files-on-pinata
/*
If you would like to remove files in bulk, you will need to take two steps.
1. First, you'll need to query the pins you want removed based on some identifying criteria.
2. Next, you will need to loop through those files and unpin each one individually.
Querying for pins means using the pinList endpoint. That is documented here:
When you have the list of pins you'd like to unpin, you can loop through them and call the unpin endpoint.
Please keep in mind that Pinata's API is rate-limited.
You will need to add a half-second to full-second delay between requests.
/*





Pin one file to the root directory

const fs = require('fs');
const readableStreamForFile = fs.createReadStream('/Users/randb/Documents/KrazyPhaces/output/00000 Hinson.png');
const options = {
    pinataMetadata: {
        name: "Hinson"//,
        //keyvalues: {
        //    customKey: 'customValue',
        //    customKey2: 'customValue2'
        //}
    },
    pinataOptions: {
        cidVersion: 0
    }
};
pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});

*/

