import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { RootState } from '..'

export interface INFTItem {
  price: string
  itemId: number
  seller: string
  owner: string
  image: any
  name: any
  description: any
}

export interface ExporeState {
  nfts: INFTItem[]
  mynfts: INFTItem[]
}
export const initialState: ExporeState = {
  nfts: [],
  mynfts: []
}

const exporeSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setNFTs(state, action: PayloadAction<INFTItem[]>) {
      state.nfts = action.payload
    },
    clearNFTs(state) {
      state.nfts = initialState.nfts
    },
    setMyNFTs(state, action: PayloadAction<INFTItem[]>) {
      state.mynfts = action.payload
    },
    clearMyNFTs(state) {
      state.nfts = initialState.mynfts
    }
  }
})

// export const getToggleStatus = (state: RootState) => state.test

export const { setNFTs, clearNFTs, setMyNFTs, clearMyNFTs } = exporeSlice.actions
export const exporeReducer = exporeSlice.reducer
