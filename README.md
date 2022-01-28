# Metaplex Candy Machine V2 - Next.js

Tutorial by [Update Settings](http://github.com/updatesettings)

BETA RELEASE - Updates still being made

Need web3 help? Support Update Settings by becoming a Cursor holder to receive exclusive access to projects and get hands on web3 dev help by our team.

## [Get a Cursor](https://magiceden.io/marketplace/cursors_by_update_settings)

### To Do:

- [ ] Fix Presale Phase Header (page requires refresh)
- [ ] Remove unused code
- [ ] Performance optimization
- [x] Whitelist signup prevent duplicates
- [ ] Animations

---

# Setup Candy Machine

<!-- Step 0 -->

Create New Wallet

```bash
// Optional: Make a folder if you dont already have one
mkdir ~/my-solana-wallet

// Make wallet within folder
solana-keygen new --outfile ~/my-solana-wallet/my-keypair.json

// Get wallet address
solana-keygen pubkey ~/my-solana-wallet/my-keypair.json

// Use wallet address to verify with keypair
solana-keygen verify <PUBKEY> ~/my-solana-wallet/my-keypair.json

// Config wallet
solana config set --keypair  ~/my-solana-wallet/my-keypair.json

// Devnet Fund wallet
solana airdrop 1 <PUBKEY> --url https://api.devnet.solana.com

// Config Network (devnet)
solana config set --url https://api.devnet.solana.com
```

<!-- Step 1 -->

Create whitelist spl token

```bash

// Optional: Create Token w/ custom vanity
solana-keygen grind --starts-with US:1

// Create Token (If using custom vanity)
spl-token create-token <TOKEN WITH VANITY> --decimals 0

// Create Token (if NOT using custom vanity start here)
spl-token create-token --decimals 0

// Create token account
spl-token create-account <TOKEN>

// Create token supply
spl-token mint <TOKEN> <NUMBER TOKENS TO CREATE>

// Check token supply
spl-token balance <TOKEN>
```

Distribute SPL Tokens via Gumdrop (Optional)

```bash

// Create JSON file with dist list of wallet address
example-dist.json
[
  {
    "handle": "<DISTRIBUTION-METHOD-SPECIFIC-HANDLE>",
    "amount": <GUMDROP-CLAIM-ALLOWANCE>,
    ["edition": <EDITION-NUMBER>]
  },
]

// Run Gumdrop to distribute SPL token
npx ts-node js/packages/cli/src/gumdrop-cli.ts create -k <KEYPAIR> --claim-integration transfer --transfer-mint <SPL TOKEN> --distribution-method wallets --distribution-list example-dist.json
```

<!-- Step 2 -->

Set up config file

Civic pass disabled in this config

```bash
{
  "price": 1,
  "number": 310,
  "gatekeeper": null,
  "solTreasuryAccount": "XXXXpj1yKkPrzCy1zK96iGVFkDjuhw62aqKVsKXXXXX",
  "splTokenAccount": null,
  "splToken": null,
  "goLiveDate": "19 Jan 2022 13:00:00 PST",
  "endSettings": null,
  "whitelistMintSettings": {
    "mode": { "burnEveryTime": true },
    "mint": "61yn9rQEUetLhENEj73pGr3L1Rm8AjpK6DDYc1BYCikV",
    "presale": true,
    "discountPrice": 0
  },
  "hiddenSettings": null,
  "storage": "arweave", // arweave-sol for mainnet
  "ipfsInfuraProjectId": null,
  "ipfsInfuraSecret": null,
  "awsS3Bucket": null,
  "noRetainAuthority": false,
  "noMutable": false
}
```

<!-- Step 3 upload -->

```bash
npx ts-node js/packages/cli/src/candy-machine-v2-cli.ts upload -e devnet -k ~/my-solana-wallet/demo.json -cp config.json -c demo ./demo-assets --rpc-url https://api.devnet.solana.com
```

<!-- Step 4 verify -->

```bash
npx ts-node js/packages/cli/src/candy-machine-v2-cli.ts verify_upload -e devnet -k ~/my-solana-wallet/demo.json -cp config.json -c demo
```

<!-- Step 5 mint -->

```bash
// Mint one
npx ts-node js/packages/cli/src/candy-machine-v2-cli.ts mint_one_token -e devnet -k ~/my-solana-wallet/demo.json -c demo

// Mint multiple (example: 3)
npx ts-node js/packages/cli/src/candy-machine-v2-cli.ts mint_multiple_tokens --number 3 -e devnet -k ~/my-solana-wallet/demo.json -c demo
```

<!-- Step 7 verify keypair creator -->

[Install Metaboss](https://github.com/samuelvanderwaal/metaboss)

```bash

// Verify Keypair for creator (-t 90 needed due to network )
metaboss -t 90 sign all --keypair <PATH_TO_KEYPAIR> --candy-machine-id <CANDY_MACHINE_ID> --v2
```

<!-- Step 7 optional update cm -->

```bash
// Update Candy Machine
npx ts-node js/packages/cli/src/candy-machine-v2-cli.ts update_candy_machine -e devnet -k ~/my-solana-wallet/demo.json -c demo
```

<!-- DANGER -->

<!-- Step 8 withdraw -->

```bash
// * WARNING *
// This will break your candy machine and any other candy machines tied to the keypair.

// Recommend to run this after you have fully minted!

// Rec to run a dry version to view what will break
npx ts-node js/packages/cli/src/candy-machine-v2-cli.ts withdraw --dry -e devnet -k ~/my-solana-wallet/demo.json

// Official withdraw command
npx ts-node js/packages/cli/src/candy-machine-v2-cli.ts withdraw -e devnet -k ~/my-solana-wallet/demo.json
```

---

# Run Front End

```bash
// Fork & Clone
git clone https://github.com/updatesettings/nextjs-candy-machine-v2.git

// Config .env
NEXT_PUBLIC_CANDY_MACHINE_ID=<CANDY MACHINE ID IN CACHE FILE>
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_HOST=https://api.devnet.solana.com
// If you are running the whitelist sign up page, then setup notion as well
NOTION_API_KEY=
NOTION_DATABASE_ID=

// Add Site Data .../data/siteData.js
// Important to add wallet address(es) of creators as this is how we pull the NFTs
// It's recommended to only use the wallet address(es) that are only associated
// to the collection and not tied to other collections
addresses: {
  creators: [
    "XXXXyKkPrzCy1zK96iGVFkDjuhw62aqKVXXXX",
  ],
},

// Set node version - it is recommended to nvm (node version manager)
nvm use

// Install packages
yarn install

// Run local
yarn dev

/////////////////////////////////////////

// Image URLS
// if you don't use Arweave for your NFTs, then you will need to update next.config.js
images: {
    domains: ["arweave.net", "www.arweave.net"],
},
```

# Setup Build (Vercel)

```bash
// Login to vercel
// Set up new project
// Framework Preset: Next.js

// Config Environment Variables (as above)
// In Environment Variables you may need deactivate the CI if build is failing
CI=false

```
