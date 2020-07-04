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
  keywords?: string[]
  originalDate?: Date
  error?: string
}