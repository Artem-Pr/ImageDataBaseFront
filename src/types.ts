export type fileType = 'image/jpeg'

export interface UploadingObject {
	name: string
	tempPath: string
	size: number
	type: string
	keywords: string[] | null
}

export interface BaseFile {
	name?: string
	size?: number
	lastModifiedDate?: Date
	tempPath?: string
}

export interface File extends BaseFile {
	preview: string
	lastModified?: number
	path?: string
	type?: fileType
	webkitRelativePath?: string
}

export interface ExifData extends BaseFile {
	changeDate?: Date
	originalDate?: Date
	keywords?: string[]
	megapixels?: number
	imageSizes?: number
	error?: string
	type?: string
}

export interface IDBFileObject {
	_id: string
	changeDate: string
	filePath: string
	keywords: string[]
	megapixels: string
	mimetype: string
	originalDate: string | null
	originalName: string
	originalPath: string
	preview: string
	tempPath: string
	size: number
}

export interface IGallery {
	original: string
	thumbnail: string
}
