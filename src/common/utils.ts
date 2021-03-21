import moment from 'moment'
import { ExifData, IChangedData } from '../types'
import React from 'react'

export const formatDate = (date: Date | undefined | null | string): string => {
	if (
		date === undefined ||
		date === '-' ||
		date === ''
	) return '-'
	if (date === null) return ''
	return moment(date).format('DD.MM.YYYY')
}

export const cloneByJSON = (obj: Object) => {
	return JSON.parse(JSON.stringify(obj))
}

export const isDifferentKeywords = (arr1: string[] | null = null, arr2: string[] | null = null) => {
	if (!arr1 || !arr2) return false
	return arr1.sort().join('') !== arr2.sort().join('')
}

export const updateExifArr = (
	changedData: IChangedData,
	exif: ExifData,
	openDrawerByEditSelectedClick: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void },
	exifArr: ExifData[],
	selectedArr: boolean[],
	setExifDataArr: React.Dispatch<React.SetStateAction<ExifData[]>>,
): void => {
	if (openDrawerByEditSelectedClick.isOpen) {
		const { newName: name, changeDate, originalDate } = changedData
		const newExifArr = exifArr.map((exifItem, i) => {
			if (selectedArr[i]) {
				const currentExtension = exifItem.name?.slice(-4)
				return {
					...exifItem,
					...(exif.keywords?.length && { keywords: exif.keywords }),
					...(exif.name && { name: exif.name }),
					...(name && { name: name + '_' + i + currentExtension }),
					...(originalDate && { originalDate }),
					...(changeDate && { changeDate }),
					...(changeDate && { lastModifiedDate: changeDate }),
				}
			} else {
				return exifItem
			}
		})
		setExifDataArr(newExifArr)
		return
	}
	const newExifArr = exifArr.map(exifItem => {
		// debugger
		const { _id, originalName, newName: name, changeDate, originalDate } = changedData
		// debugger
		if (
			(_id && exifItem._id === _id) ||
			(originalName && exifItem.name === originalName)
		) {
			return {
				...exif,
				...(name && { name }),
				...(originalDate && { originalDate }),
				...(changeDate && { changeDate }),
				lastModifiedDate: changeDate || null,
			}
		} else {
			return exifItem
		}
	})
	setExifDataArr(newExifArr)
}
