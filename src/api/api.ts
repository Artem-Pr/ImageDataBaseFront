import axios, { AxiosResponse } from 'axios'
import { File, ExifDataStringify } from '../types'

const instance = axios.create({
	baseURL: 'http://localhost:5000',
	headers: {
		'Content-Type': 'multipart/form-data',
	},
})

export const mainApi = {
	sendPhotos(
		files: File[],
		exifDataArr: ExifDataStringify[],
		path: string,
	): Promise<AxiosResponse<any>> {

		const formData = new FormData()
		files.forEach((file: any) => {
			formData.append('filedata', file)
    })

		formData.append('exifDataArr', JSON.stringify(exifDataArr))
		return instance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'path': path
      },
    })
	},
}
