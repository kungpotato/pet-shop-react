import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'

export interface TestState {
  toogle: boolean
}
export const initialState: TestState = {
  toogle: false
}

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    updateToggle(state, action: PayloadAction<boolean>) {
      state.toogle = action.payload
    }
  }
})

export const getToggleStatus = (state: RootState) => state.test

export const { updateToggle } = testSlice.actions
export const testReducer = testSlice.reducer
