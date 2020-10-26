import React, { useCallback, useState } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import SettingsIcon from '@material-ui/icons/Settings'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { File, ExifData, IChangedData } from '../../types'
import moment from 'moment'
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

interface Props {
	defaultKeywords: string[]
	file: File
	exif: ExifData
	updateExifArr: (changedData: IChangedData, exif: ExifData) => void
}

const fileSizeToString = (size: number): string => {
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

const formatDate = (date: Date | undefined): string => {
	if (!date) return '-'
	return moment(date).format('DD.MM.YYYY')
}

export default function DrawerMenu({
	                                   defaultKeywords,
	                                   file,
	                                   exif,
	                                   updateExifArr,
                                   }: Props) {
	const classes = useStyles()
	const [showAddKeywordField, setShowAddKeywordField] = useState<Boolean>(false)
	const [inputValue, setInputValue] = useState('')
	const [currentExif, setCurrentExif] = useState<ExifData>(exif)
	const [popupOpen, setPopupOpen] = useState<boolean>(false)
	const [originalName, setOriginalName] = useState<string>(file.name || '')
	const [newName, setNewName] = useState<string | null>(null)
	const [originalDate, setOriginalDate] = useState<Date | null>(null)
	const [changeDate, setChangeDate] = useState<Date | null>(null)
	const [editNameField, setEditNameField] = useState<boolean>(false)
	const [editChangeDate, setEditChangeDate] = useState<boolean>(false)
	const [editOriginalDate, setEditOriginalDate] = useState<boolean>(false)
	
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
		saveFunc: any,
		value: string | null,
	) => {
		if (e.key === 'Enter') {
			setEditChangeDate(false)
			setEditNameField(false)
			setEditOriginalDate(false)
			saveFunc(value)
		}
	}
	
	const handleCancel = (cancelFunc: any) => {
		setEditChangeDate(false)
		setEditNameField(false)
		setEditOriginalDate(false)
		cancelFunc(null)
	}
	
	const getChangedData: () => IChangedData = useCallback(() => {
		return {
			originalName,
			...newName && { newName },
			...originalDate && { originalDate },
			...changeDate && { changeDate },
		}
	}, [changeDate, originalName, newName, originalDate])
	
	
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
						<ListItem button onClick={() => setEditNameField(true)}>
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
					<ListItemText primary={file.size && fileSizeToString(file.size)} />
				</ListItem>
				<ListItem>
					<ListItemText className={classes.date} secondary="image sizes: " />
					<ListItemText primary={currentExif.imageSizes} />
				</ListItem>
				<ListItem>
					<ListItemText className={classes.date} secondary="megapixels: " />
					<ListItemText primary={currentExif.megapixels} />
				</ListItem>
				<ListItem button>
					<ListItemText className={classes.date} secondary="original date: " />
					<ListItemText primary={formatDate(currentExif?.originalDate)} />
				</ListItem>
				<ListItem button>
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
