import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from './store'
import api from '../api/api'
import { IDBFileObject } from '../types'
import mainApi from '../api/api'

interface ISearchPagination {
	currentPage: number
	totalPages: number
	nPerPage: number
	resultsCount: number
}

interface ISearchResponseObject {
	files: IDBFileObject[]
	searchPagination: ISearchPagination
}

interface IState {
	keywordsList: string[]
	pathsList: string[]
	searchPhotosArr: IDBFileObject[]
	searchPagination: ISearchPagination
}

const initialState: IState = {
	keywordsList: [],
	pathsList: [],
	searchPhotosArr: [],
	searchPagination: {
		currentPage: 1,
		totalPages: 10,
		nPerPage: 30,
		resultsCount: 0,
	},
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
		setCurrentPage(state, action: PayloadAction<number>) {
			state.searchPagination.currentPage = action.payload
		},
		setTotalPages(state, action: PayloadAction<number>) {
			state.searchPagination.totalPages = action.payload
		},
		setNumberPerPage(state, action: PayloadAction<number>) {
			state.searchPagination.nPerPage = action.payload
		},
		setSearchPagination(state, action: PayloadAction<ISearchPagination>) {
			state.searchPagination = action.payload
		},
	},
})

export const {
	setKeywordsList,
	setSearchPhotosArr,
	setPathsList,
	setCurrentPage,
	setNumberPerPage,
	setTotalPages,
	setSearchPagination,
} = mainSlice.actions

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
                                 excludeTags: Set<string>,
                                 currentPage: number,
                                 nPerPage: number,
): AppThunk => async dispatch => {
	try {
		const response = await mainApi.getPhotosByTags(searchTags, excludeTags, currentPage, nPerPage)
		const responseObject: ISearchResponseObject = response.data
		dispatch(setSearchPhotosArr(responseObject.files))
		dispatch(setSearchPagination(responseObject.searchPagination))
	} catch (error) {
		console.error('Ошибка при загрузке фотографий: ', error.message)
	}
}
