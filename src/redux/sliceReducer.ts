import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from './store'
import api from '../api/api'

interface IKeywordsRaw {
	keywords: string[]
}

interface IState {
	keywordsList: string[]
}

const initialState: IState = {
	keywordsList: [],
}

const mainSlice = createSlice({
	name: 'main',
	initialState,
	reducers: {
		setKeywordsList(state, action: PayloadAction<IKeywordsRaw>) {
			const { keywords } = action.payload
			state.keywordsList = keywords
		},
	},
})

export const { setKeywordsList } = mainSlice.actions

export default mainSlice.reducer

export const fetchKeywordsList = (): AppThunk => async dispatch => {
	try {
		const response = await api.getKeywordsList()
		dispatch(setKeywordsList(response.data))
	} catch (error) {
		console.error('Ошибка при получении Keywords: ', error.message)
	}
}
