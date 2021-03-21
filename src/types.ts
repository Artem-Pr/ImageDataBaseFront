export type fileType = 'image/jpeg'
export type DateType = 'original' | 'changed'
export type DialogType = 'alert' | 'notify'

export interface UploadingObject {
	name: string
	tempPath: string
	size: number
	type: string
	keywords: string[] | null
}
export interface UpdatedObject {
	id: string
	updatedFields: {
		originalName?: string
		filePath?: string
		originalDate?: string
		keywords?: string[]
	}
}

export interface BaseFile {
	name?: string
	size?: number
	lastModifiedDate?: Date | null
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
	_id?: string
	changeDate?: Date
	originalDate?: Date
	keywords?: string[]
	megapixels?: number
	imageSizes?: string
	error?: string
	type?: string
}

export interface IDBFileObject {
	_id: string
	changeDate: string
	filePath: string
	keywords: string[]
	megapixels: string
	imageSize: string
	mimetype: string
	originalDate: string | null
	originalName: string
	originalPath: string
	preview: string
	tempPath: string
	size: number
}

export interface IGallery {
	thumbnail: string
	original: string
	renderItem?: () => any
}

export interface IDrawer {
	isOpen: boolean
	file: File
	exif: ExifData
	index?: number
}

export interface IChangedData {
	originalName?: string
	_id?: string
	newName?: string
	originalDate?: Date
	changeDate?: Date
}

export interface IIdentifierObject {
	id: string
	name: string
	originalName: string
	originalPath: string
}
