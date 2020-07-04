import React, { useState } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import SettingsIcon from '@material-ui/icons/Settings'
import TextField from '@material-ui/core/TextField'
import { File, ExifData } from '../../types'
import moment from 'moment'

interface Props {
	files: File[]
	exif: ExifData[]
}

interface Drawer {
	isOpen: boolean
	file: File | null
	exif: ExifData | null
}

// interface Exif extends ExifData {
//   changeDate: Date
// }

const formatDate = (date: Date | undefined): string => {
	if (!date) return '-'
	return moment(date).format('DD.MM.YYYY')
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			margin: '16px 0',
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: 'space-around',
			overflow: 'hidden',
			backgroundColor: theme.palette.background.paper,
		},
		gridList: {
			// поставить медиа запросы
			width: '100%',
		},
		icon: {
			color: 'rgba(255, 255, 255, 0.54)',
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

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
export default function TitlebarGridList({ files, exif }: Props) {
	const classes = useStyles()
	const drawerInit: Drawer = {
		isOpen: false,
		file: null,
		exif: null,
	}
	const [drawer, setDrawer] = useState<Drawer>(drawerInit)

	const openDrawer = (
		isOpen: boolean,
		file: File | null = null,
		exif: ExifData | null = null,
	): void => {
		setDrawer({
			file,
			exif,
			isOpen,
		})
	}

	if (files.length === 0 || exif.length === 0) return <div></div>

	const list = (file: File, exifData: ExifData) => (
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
					<ListItemText primary={formatDate(exifData?.originalDate)} />
				</ListItem>
				<ListItem>
					<ListItemText className={classes.date} secondary="change date: " />
					<ListItemText primary={formatDate(exifData?.changeDate)} />
				</ListItem>
			</List>
			{exifData.keywords ? (
				<>
					<Divider />
					<List>
						<ListItem>
							<ListItemIcon>
								<MenuBookIcon />
							</ListItemIcon>
							<ListItemText primary={'Keywords'} />
						</ListItem>
						{exifData.keywords.map((text, index) => (
							<ListItem button key={text}>
								<ListItemText secondary={text} />
							</ListItem>
						))}
					</List>
				</>
			) : (
				''
			)}
		</div>
	)

	return (
		<div className={classes.root}>
			<GridList cellHeight={180} className={classes.gridList}>
				{files.map((tile, i) => (
					<GridListTile key={tile.preview} cols={0.25}>
						<img src={tile.preview} alt={tile.name} />
						<GridListTileBar
							title={tile.name}
							subtitle={
								exif[i]?.originalDate ? (
									<span>{`original date: ${moment(exif[i]?.originalDate).format(
										'DD.MM.YYYY',
									)}`}</span>
								) : (
									<span>{`change date: ${moment(exif[i]?.changeDate).format(
										'DD.MM.YYYY',
									)}`}</span>
								)
							}
							actionIcon={
								<IconButton
									aria-label={`info about ${tile.name}`}
									className={classes.icon}
									onClick={() => openDrawer(true, tile, exif[i])}
								>
									<InfoIcon />
								</IconButton>
							}
						/>
					</GridListTile>
				))}
			</GridList>
			<Drawer
				anchor="left"
				open={drawer.isOpen}
				onClose={() => openDrawer(false)}
			>
				{drawer && drawer.file && drawer.exif
					? list(drawer.file, drawer.exif)
					: ''}
			</Drawer>
		</div>
	)
}
