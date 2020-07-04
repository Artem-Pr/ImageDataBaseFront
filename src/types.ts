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
  keywords?: string[]
  originalDate?: Date
  changeDate?: Date
  error?: string
}