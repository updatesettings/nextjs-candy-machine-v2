import { web3, Program, Provider, Wallet } from "@project-serum/anchor"

import { MintLayout, TOKEN_PROGRAM_ID, Token } from "@solana/spl-token"
import { WalletContextState } from "@solana/wallet-adapter-react"
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction
} from "@solana/web3.js"

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3.PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
)

const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
)

const CANDY_MACHINE = "candy_machine"

export const CANDY_MACHINE_PROGRAM_ID = new web3.PublicKey(
  "cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ"
)

const getTokenWallet = async function (wallet: PublicKey, mint: PublicKey) {
  return (
    await PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0]
}

const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: PublicKey,
  payer: PublicKey,
  walletAddress: PublicKey,
  splTokenMintAddress: PublicKey
) => {
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: true
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false
    }
  ]
  return new TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([])
  })
}

export const getCandyMachine = async (config: web3.PublicKey, uuid: string) => {
  return await web3.PublicKey.findProgramAddress(
    [Buffer.from(CANDY_MACHINE), config.toBuffer(), Buffer.from(uuid)],
    CANDY_MACHINE_PROGRAM_ID
  )
}

const getMetadata = async (mint: web3.PublicKey): Promise<web3.PublicKey> => {
  return (
    await web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}

const getMasterEdition = async (
  mint: web3.PublicKey
): Promise<web3.PublicKey> => {
  return (
    await web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition")
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}

export const mintOneToken = async (
  wallet: WalletContextState
): Promise<string> => {
  const endpoint =
    process.env.NEXT_PUBLIC_CONNECTION_NETWORK == "devnet"
      ? process.env.NEXT_PUBLIC_SOLANA_RPC_HOST_DEVNET
      : process.env.NEXT_PUBLIC_SOLANA_RPC_HOST_MAINNET_BETA

  if (!endpoint) throw "No RPC endpoint configured."

  const solConnection = new web3.Connection(endpoint, "confirmed")

  // const solPriceStr = program.getOptionValue('price') || '1';
  // const lamports = parseInt(solPriceStr) * LAMPORTS_PER_SOL;

  const mint = web3.Keypair.generate()

  const anchorWallet = {
    publicKey: wallet.publicKey,
    signAllTransactions: wallet.signAllTransactions,
    signTransaction: wallet.signTransaction
  } as any

  if (!wallet.publicKey) throw "No public key."

  const token = await getTokenWallet(wallet.publicKey, mint.publicKey)

  const provider = new Provider(solConnection, anchorWallet, {
    preflightCommitment: "recent"
  })

  const idl = await Program.fetchIdl(CANDY_MACHINE_PROGRAM_ID, provider)

  if (!idl) throw "No idl."

  const anchorProgram = new Program(idl, CANDY_MACHINE_PROGRAM_ID, provider)

  if (
    !process.env.NEXT_PUBLIC_CANDY_MACHINE_CACHE_PROGRAM_CONFIG ||
    !process.env.NEXT_PUBLIC_CANDY_MACHINE_CACHE_PROGRAM_UUID
  ) {
    throw "Wrong candy machine config"
  }

  const config = new web3.PublicKey(
    process.env.NEXT_PUBLIC_CANDY_MACHINE_CACHE_PROGRAM_CONFIG
  )
  const [candyMachine] = await getCandyMachine(
    config,
    process.env.NEXT_PUBLIC_CANDY_MACHINE_CACHE_PROGRAM_UUID
  )

  const candy = await anchorProgram.account.candyMachine.fetch(candyMachine)
  const metadata = await getMetadata(mint.publicKey)
  const masterEdition = await getMasterEdition(mint.publicKey)

  const tx = await anchorProgram.rpc.mintNft({
    accounts: {
      config: config,
      candyMachine: candyMachine,
      payer: wallet.publicKey,
      //@ts-ignore
      wallet: candy.wallet,
      mint: mint.publicKey,
      metadata,
      masterEdition,
      mintAuthority: wallet.publicKey,
      updateAuthority: wallet.publicKey,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      clock: web3.SYSVAR_CLOCK_PUBKEY
    },
    signers: [mint],
    instructions: [
      web3.SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MintLayout.span,
        lamports: await provider.connection.getMinimumBalanceForRentExemption(
          MintLayout.span
        ),
        programId: TOKEN_PROGRAM_ID
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        0,
        wallet.publicKey,
        wallet.publicKey
      ),
      createAssociatedTokenAccountInstruction(
        token,
        wallet.publicKey,
        wallet.publicKey,
        mint.publicKey
      ),
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        token,
        wallet.publicKey,
        [],
        1
      )
    ]
  })

  return tx
}
