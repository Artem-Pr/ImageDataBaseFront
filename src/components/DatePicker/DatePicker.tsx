import 'date-fns'
import React from 'react'
import DateFnsUtils from '@date-io/date-fns'
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers'
import { DateType } from '../../types'

interface IProps {
	initialDate: Date | null
	setDate: any
	dateType: DateType
	handleKey: (
		e: React.KeyboardEvent<HTMLElement>,
		dateType: DateType,
		value: Date | null,
	) => void
}

export default function DatePicker({ initialDate, handleKey, setDate, dateType }: IProps) {
	const [selectedDate, setSelectedDate] = React.useState<Date | null>(initialDate)
	
	const handleDateChange = (date: Date | null) => {
		setSelectedDate(date)
		setDate(date)
	}
	
	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<KeyboardDatePicker
				disableToolbar
				variant="inline"
				format="dd.MM.yyyy"
				value={selectedDate}
				onChange={handleDateChange}
				onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
					handleKey(e, dateType , selectedDate)}
				KeyboardButtonProps={{
					'aria-label': 'change date',
				}}
			/>
		</MuiPickersUtilsProvider>
	)
}
