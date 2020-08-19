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

export interface ExifDataStringify {
  changeDate: string
  originalDate?: string
  keywords?: string[]
  error?: string
}