export type fileType = 'image/jpeg'

export interface File {
	preview: string
	lastModified?: number
	lastModifiedDate?: Date
	name?: string
	path?: string
	size?: number
	type?: fileType
	webkitRelativePath?: string
}

export interface ExifData {
  changeDate: Date
  originalDate?: Date
  keywords?: string[]
  error?: string
}

export interface ExifDataStringify {
  changeDate: string
  originalDate?: string
  keywords?: string[]
  error?: string
}