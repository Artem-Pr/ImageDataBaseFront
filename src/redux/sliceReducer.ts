import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from './store'
import api from '../api/api'
import { IDBFileObject } from '../types'
import mainApi from '../api/api'

interface IState {
	keywordsList: string[]
	pathsList: string[]
	searchPhotosArr: IDBFileObject[]
}

const initialState: IState = {
	keywordsList: [],
	pathsList: [],
	searchPhotosArr: [],
}

const mainSlice = createSlice({
	name: 'main',
	initialState,
	reducers: {
		setKeywordsList(state, action: PayloadAction<string[]>) {
			state.keywordsList = action.payload
		},
		setPathsList(state, action: PayloadAction<string[]>) {
			state.pathsList = action.payload
		},
		setSearchPhotosArr(state, action: PayloadAction<IDBFileObject[]>) {
			state.searchPhotosArr = action.payload
		},
	},
})

export const { setKeywordsList, setSearchPhotosArr, setPathsList } = mainSlice.actions

export default mainSlice.reducer

export const fetchKeywordsList = (): AppThunk => async dispatch => {
	try {
		const response = await api.getKeywordsList()
		dispatch(setKeywordsList(response.data))
	} catch (error) {
		console.error('Ошибка при получении Keywords: ', error.message)
	}
}

export const fetchPathsList = (): AppThunk => async dispatch => {
	try {
		const response = await api.getPathsList()
		dispatch(setPathsList(response.data))
	} catch (error) {
		console.error('Ошибка при получении Paths: ', error.message)
	}
}

export const fetchPhotosByTag = (searchTags: Set<string>,
                                 excludeTags: Set<string>): AppThunk => async dispatch => {
	try {
		const response = await mainApi.getPhotosByTags(searchTags, excludeTags)
		dispatch(setSearchPhotosArr(response.data))
	} catch (error) {
		console.error('Ошибка при загрузке фотографий: ', error.message)
	}
}
