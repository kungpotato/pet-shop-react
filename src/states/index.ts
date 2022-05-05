import { configureStore } from '@reduxjs/toolkit'
import { exporeReducer } from './expore/reducer'
import { testReducer } from './test/reducer'
import { setupListeners } from '@reduxjs/toolkit/query/react'

const store = configureStore({
  reducer: {
    test: testReducer,
    expore: exporeReducer
  }
})

setupListeners(store.dispatch)

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
