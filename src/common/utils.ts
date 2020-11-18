import moment from 'moment'

export const formatDate = (date: Date | undefined | null): string => {
	if (date === undefined) return '-'
	if (date === null) return ''
	return moment(date).format('DD.MM.YYYY')
}

export const cloneByJSON = (obj: Object) => {
	return JSON.parse(JSON.stringify(obj))
}
