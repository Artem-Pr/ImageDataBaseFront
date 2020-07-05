import React, { useState } from 'react'
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
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
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

export default function DrawerMenu({ file, exif }: Props) {
	const classes = useStyles()
	const [showAddKeywordField, setShowAddKeywordField] = useState<Boolean>(false)

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
					<ListItemText primary={formatDate(exif?.originalDate)} />
				</ListItem>
				<ListItem>
					<ListItemText className={classes.date} secondary="change date: " />
					<ListItemText primary={formatDate(exif?.changeDate)} />
				</ListItem>
			</List>
			<Divider />
			<List>
				<ListItem>
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
						<TextField label="new keyword" />
						<ListItemSecondaryAction>
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
				{exif.keywords &&
					exif.keywords.map((text) => (
						<ListItem button key={text}>
							<ListItemText secondary={text} />
						</ListItem>
					))}
			</List>
		</div>
	)
}
