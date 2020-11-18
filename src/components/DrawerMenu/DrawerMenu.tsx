import React, { useCallback, useState } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import SettingsIcon from '@material-ui/icons/Settings'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { ExifData, IChangedData, DateType } from '../../types'
import {
	TextField,
	ListItemSecondaryAction,
	ListItemText,
	ListItemIcon,
	ListItem,
	Divider,
	List,
	IconButton,
	Input,
	InputAdornment,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import DatePicker from '../DatePicker/DatePicker'
import { formatDate } from '../../common/utils'

interface Props {
	defaultKeywords: string[]
	exif: ExifData
	updateExifArr: (changedData: IChangedData, exif: ExifData) => void
}

const fileSizeToString = (size: number): string => {
	if (!size) return '-'
	const originalSize = size / 1000000
	if (originalSize > 1) return originalSize.toFixed(3) + ' Mb'
	else return (size / 1000).toFixed() + ' Kb'
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		item: {
			paddingRight: 100,
		},
		textField: {
			width: 200,
		},
		list: {
			minWidth: 250,
			width: 'auto',
		},
		name: {
			maxWidth: 50,
			width: 50,
		},
		date: {
			maxWidth: 100,
			width: 100,
		},
	}),
)

export default function DrawerMenu({
	                                   defaultKeywords,
	                                   exif,
	                                   updateExifArr,
                                   }: Props) {
	const classes = useStyles()
	const [showAddKeywordField, setShowAddKeywordField] = useState<Boolean>(false)
	const [inputValue, setInputValue] = useState('')
	const [currentExif, setCurrentExif] = useState<ExifData>(exif)
	const [popupOpen, setPopupOpen] = useState<boolean>(false)
	const [originalName, setOriginalName] = useState<string>(exif.name || '')
	const [newName, setNewName] = useState<string | null>(null)
	const [originalDate, setOriginalDate] = useState<Date | null>(currentExif?.originalDate || null)
	const [editNameField, setEditNameField] = useState<boolean>(false)
	const [editOriginalDate, setEditOriginalDate] = useState<boolean>(false)
	
	const closeAllFields = () => {
		setEditNameField(false)
		setEditOriginalDate(false)
		addKeyword()
	}
	
	const addKeyword = () => {
		const currentKeywordsSet = new Set([
			inputValue,
			...(currentExif.keywords || []),
		])
		currentKeywordsSet.delete('')
		let newExif = {
			...currentExif,
			keywords: Array.from(currentKeywordsSet),
		}
		updateExifArr(getChangedData(), newExif)
		setCurrentExif(newExif)
	}
	
	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		if (e.key === 'Enter') addKeyword()
	}
	
	const handleKeyDownProp = (
		e: React.KeyboardEvent<HTMLElement>,
		saveFunc: any = null,
		value: string | null = null,
	) => {
		if (e.key === 'Enter') {
			closeAllFields()
			saveFunc && saveFunc(value)
		}
	}
	
	const handleCancel = (cancelFunc: any) => {
		closeAllFields()
		cancelFunc(null)
	}
	
	const handleEdit = (cancelFunc: any) => {
		closeAllFields()
		cancelFunc(true)
	}
	
	const datePickerHandleKey = (
		e: React.KeyboardEvent<HTMLElement>,
		dateType: DateType,
		value: Date | null,
	) => {
		handleKeyDownProp(e)
		if (dateType === 'original') setOriginalDate(value)
	}
	
	const getChangedData: () => IChangedData = useCallback(() => {
		const extension = exif.name?.slice(-4)
		return {
			originalName,
			...newName && { newName: newName + extension },
			...originalDate && { originalDate },
		}
	}, [exif.name, originalName, newName, originalDate])
	
	
	return (
		<div role="presentation" className={classes.list}>
			<List>
				<ListItem>
					<ListItemIcon>
						<SettingsIcon />
					</ListItemIcon>
					<ListItemText primary={'Properties'} />
				</ListItem>
				
				{!editNameField
					? (
						<ListItem button onClick={() => handleEdit(setEditNameField)}>
							<ListItemText className={classes.name} secondary="name: " />
							<ListItemText primary={newName || originalName} />
						</ListItem>
					) : (
						<ListItem>
							<ListItemText className={classes.name} secondary="name: " />
							<Input
								value={newName || ''}
								onChange={e => setNewName(e.target.value)}
								onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
									handleKeyDownProp(e, setOriginalName, newName)}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={() => handleCancel(setNewName)}
										>
											<Close />
										</IconButton>
									</InputAdornment>
								}
							/>
						</ListItem>
					)}
				
				<ListItem>
					<ListItemText className={classes.name} secondary="size: " />
					<ListItemText primary={exif.size && fileSizeToString(exif.size)} />
				</ListItem>
				<ListItem>
					<ListItemText className={classes.date} secondary="image sizes: " />
					<ListItemText primary={currentExif.imageSizes || '-'} />
				</ListItem>
				<ListItem>
					<ListItemText className={classes.date} secondary="megapixels: " />
					<ListItemText primary={currentExif.megapixels || '-'} />
				</ListItem>
				
				{!editOriginalDate
					? (
						<ListItem button onClick={() => handleEdit(setEditOriginalDate)}>
							<ListItemText className={classes.date} secondary="original date: " />
							<ListItemText primary={formatDate(originalDate)} />
						</ListItem>
					) : (
						<ListItem>
							<ListItemText className={classes.date} secondary="original date: " />
							<DatePicker
								dateType='original'
								setDate={setOriginalDate}
								handleKey={datePickerHandleKey}
								initialDate={originalDate} />
						</ListItem>
					)}
				
				<ListItem>
					<ListItemText className={classes.date} secondary="change date: " />
					<ListItemText primary={formatDate(currentExif?.changeDate)} />
				</ListItem>
			</List>
			<Divider />
			<List>
				<ListItem className={classes.item}>
					<ListItemIcon>
						<MenuBookIcon />
					</ListItemIcon>
					<ListItemText primary={'Keywords'} />
					<ListItemSecondaryAction>
						<IconButton
							edge="end"
							onClick={() => setShowAddKeywordField(!showAddKeywordField)}
						>
							<PlaylistAddIcon />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
				{showAddKeywordField ? (
					<ListItem>
						<Autocomplete
							freeSolo
							inputValue={inputValue}
							onInputChange={(event, newInputValue) => {
								setInputValue(newInputValue)
							}}
							onOpen={() => setPopupOpen(true)}
							onClose={() => setPopupOpen(false)}
							onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
								if (!popupOpen) handleKeyDown(e)
							}}
							options={defaultKeywords}
							style={{ width: 300 }}
							renderInput={(params) => (
								<TextField {...params} label="new keyword" />
							)}
						/>
					</ListItem>
				) : (
					''
				)}
				{currentExif.keywords &&
				currentExif.keywords.map((text, i) => (
					<ListItem button key={text + i}>
						<ListItemText secondary={text} />
					</ListItem>
				))}
			</List>
		</div>
	)
}
