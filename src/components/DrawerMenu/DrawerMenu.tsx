import React, { useState, useEffect } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import SettingsIcon from '@material-ui/icons/Settings'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import TextField from '@material-ui/core/TextField'
import { File, ExifData } from '../../types'
import moment from 'moment'

interface Props {
	file: File
	exif: ExifData
	updateExifArr: (fileName: string, exif: ExifData) => void
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

export default function DrawerMenu({ file, exif, updateExifArr }: Props) {
	const classes = useStyles()
	const [showAddKeywordField, setShowAddKeywordField] = useState<Boolean>(false)
	const [editableText, setEditableText] = useState<string>('')
	const [currentExif, setCurrentExif] = useState<ExifData>(exif)

	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		if (e.key === 'Enter') {
			let newExif = {
				...currentExif,
				keywords: [editableText, ...(currentExif.keywords || [])],
			}
			file.name && updateExifArr(file.name, newExif)
			setShowAddKeywordField(false)
			setEditableText('')
			setCurrentExif(newExif)
		}
	}

	return (
		<div role="presentation" className={classes.list}>
			<List>
				<ListItem>
					<ListItemIcon>
						<SettingsIcon />
					</ListItemIcon>
					<ListItemText primary={'Properties'} />
				</ListItem>
				<ListItem button>
					<ListItemText className={classes.name} secondary="name: " />
					<ListItemText primary={file.name} />
				</ListItem>
				{/* <ListItem className="ml-5">
				<TextField label="name" value={file.name} />
			</ListItem> */}
				<ListItem>
					<ListItemText className={classes.name} secondary="size: " />
					<ListItemText
						primary={file.size && (file.size / 1000000).toFixed(3) + ' Mb'}
					/>
				</ListItem>
				<ListItem>
					<ListItemText className={classes.date} secondary="original date: " />
					<ListItemText primary={formatDate(currentExif?.originalDate)} />
				</ListItem>
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
						<IconButton edge="end" onClick={() => setShowAddKeywordField(true)}>
							<AddIcon />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
				{showAddKeywordField ? (
					<ListItem>
						<TextField
							className={classes.textField}
							label="new keyword"
							defaultValue={editableText}
							onChange={(e) => setEditableText(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						<ListItemSecondaryAction>
							{/* <IconButton edge="end">
								<PlaylistAddIcon />
							</IconButton> */}
							<IconButton
								edge="end"
								onClick={() => setShowAddKeywordField(false)}
							>
								<CloseIcon />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				) : (
					''
				)}
				{currentExif.keywords &&
					currentExif.keywords.map((text) => (
						<ListItem button key={text}>
							<ListItemText secondary={text} />
						</ListItem>
					))}
			</List>
		</div>
	)
}
