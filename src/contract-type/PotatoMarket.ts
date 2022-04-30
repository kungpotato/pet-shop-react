import BN from 'bn.js'
import BigNumber from 'bignumber.js'
import {
  PromiEvent,
  TransactionReceipt,
  EventResponse,
  EventData,
  Web3ContractContext
} from 'ethereum-abi-types-generator'

export interface CallOptions {
  from?: string
  gasPrice?: string
  gas?: number
}

export interface SendOptions {
  from: string
  value?: number | string | BN | BigNumber
  gasPrice?: string
  gas?: number
}

export interface EstimateGasOptions {
  from?: string
  value?: number | string | BN | BigNumber
  gas?: number
}

export interface MethodPayableReturnContext {
  send(options: SendOptions): PromiEvent<TransactionReceipt>
  send(options: SendOptions, callback: (error: Error, result: any) => void): PromiEvent<TransactionReceipt>
  estimateGas(options: EstimateGasOptions): Promise<number>
  estimateGas(options: EstimateGasOptions, callback: (error: Error, result: any) => void): Promise<number>
  encodeABI(): string
}

export interface MethodConstantReturnContext<TCallReturn> {
  call(): Promise<TCallReturn>
  call(options: CallOptions): Promise<TCallReturn>
  call(options: CallOptions, callback: (error: Error, result: TCallReturn) => void): Promise<TCallReturn>
  encodeABI(): string
}

export interface MethodReturnContext extends MethodPayableReturnContext {}

export type ContractContext = Web3ContractContext<
  PotatoMarket,
  PotatoMarketMethodNames,
  PotatoMarketEventsContext,
  PotatoMarketEvents
>
export type PotatoMarketEvents = 'MarketTokenMinted'
export interface PotatoMarketEventsContext {
  MarketTokenMinted(
    parameters: {
      filter?: { itemId?: string | string[]; nftContract?: string | string[]; tokenId?: string | string[] }
      fromBlock?: number
      toBlock?: 'latest' | number
      topics?: string[]
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse
}
export type PotatoMarketMethodNames =
  | 'new'
  | 'getListingPrice'
  | 'mintMarketItem'
  | 'createMarketSale'
  | 'fetchMarketItem'
  | 'fetchMyNfts'
  | 'fetchItemCreated'
export interface MarketTokenMintedEventEmittedResponse {
  itemId: string
  nftContract: string
  tokenId: string
  seller: string
  owner: string
  price: string
  sold: boolean
}
export interface MarkettokenResponse {
  itemId: string
  nftContract: string
  tokenId: string
  seller: string
  owner: string
  price: string
  sold: boolean
}
export interface PotatoMarket {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   */
  'new'(): MethodReturnContext
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getListingPrice(): MethodConstantReturnContext<string>
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param nftContract Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   * @param price Type: uint256, Indexed: false
   */
  mintMarketItem(nftContract: string, tokenId: string, price: string): MethodPayableReturnContext
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param nftContract Type: address, Indexed: false
   * @param itemId Type: uint256, Indexed: false
   */
  createMarketSale(nftContract: string, itemId: string): MethodPayableReturnContext
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  fetchMarketItem(): MethodConstantReturnContext<MarkettokenResponse[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  fetchMyNfts(): MethodConstantReturnContext<MarkettokenResponse[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  fetchItemCreated(): MethodConstantReturnContext<MarkettokenResponse[]>
}
