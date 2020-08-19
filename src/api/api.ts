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
		// const JSONFiles = JSON.stringify(files)
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

	getKeywordsFromPhoto(
		tempPath: string | undefined,
	): Promise<AxiosResponse<any>> {
		return instance.get('/image-exif', {
			params: { tempPath },
		})
	},
}

export default mainApi
