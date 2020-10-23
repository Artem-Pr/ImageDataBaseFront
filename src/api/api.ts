import axios, { AxiosResponse } from 'axios'
import { UploadingObject } from '../types'

const instance = axios.create({
	baseURL: 'http://localhost:5000',
	headers: {
		'Content-Type': 'multipart/form-data',
	},
})

const mainApi = {
	sendPhotos(
		files: UploadingObject[],
		path: string,
	): Promise<AxiosResponse<any>> {
		return instance.post('/upload', files, {
			headers: {
				path: path,
				'Content-Type': 'application/json',
			},
		})
	},
	
	sendPhoto(file: any): Promise<AxiosResponse<any>> {
		const formData = new FormData()
		formData.append('filedata', file)
		
		return instance.post('/uploadItem', formData)
	},
	
	getKeywordsList(): Promise<AxiosResponse<any>> {
		return instance.get('/keywords')
	},
	
	getPathsList(): Promise<AxiosResponse<any>> {
		return instance.get('/paths')
	},
	
	getKeywordsFromPhoto(
		tempPath: string | undefined,
	): Promise<AxiosResponse<any>> {
		return instance.get('/image-exif', {
			params: { tempPath },
		})
	},
	
	getPhotosByTags(
		searchTags: Set<string>,
		excludeTags: Set<string>,
	): Promise<AxiosResponse<any>> {
		return instance.get('/filtered-photos', {
			params: {
				searchTags: Array.from(searchTags),
				excludeTags: Array.from(excludeTags),
			},
		})
	},
}

export default mainApi
