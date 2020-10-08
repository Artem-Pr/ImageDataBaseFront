import { combineReducers } from '@reduxjs/toolkit'
import sliceReducer from './sliceReducer'

const rootReducer = combineReducers({
	mainReducer: sliceReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
