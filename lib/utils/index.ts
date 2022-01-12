import { PublicKey } from "@solana/web3.js"

export const findProgramAddress = async (
  seeds: (Buffer | Uint8Array)[],
  programId: PublicKey
) => {
  /*eslint-disable */
  const localStorage = useLocalStorage()
  const key =
    "pda-" +
    seeds.reduce((agg, item) => agg + item.toString("hex"), "") +
    programId.toString()
  const cached = localStorage.getItem(key)
  if (cached) {
    const value = JSON.parse(cached)

    return [value.key, parseInt(value.nonce)] as [string, number]
  }

  const result = await PublicKey.findProgramAddress(seeds, programId)

  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        key: result[0].toBase58(),
        nonce: result[1]
      })
    )
  } catch {
    // ignore
  }

  return [result[0].toBase58(), result[1]] as [string, number]
}

type UseStorageReturnValue = {
  getItem: (key: string) => string
  setItem: (key: string, value: string) => boolean
  removeItem: (key: string) => void
}

export const useLocalStorage = (): UseStorageReturnValue => {
  const isBrowser: boolean = ((): boolean => typeof window !== "undefined")()

  const getItem = (key: string): string => {
    return isBrowser ? window.localStorage[key] : ""
  }

  const setItem = (key: string, value: string): boolean => {
    if (isBrowser) {
      window.localStorage.setItem(key, value)
      return true
    }

    return false
  }

  const removeItem = (key: string): void => {
    window.localStorage.removeItem(key)
  }

  return {
    getItem,
    setItem,
    removeItem
  }
}
