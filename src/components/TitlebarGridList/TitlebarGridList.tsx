import React, { useState } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'
import Drawer from '@material-ui/core/Drawer'
import { File, ExifData } from '../../types'
import moment from 'moment'
import DrawerMenu from '../DrawerMenu/DrawerMenu'

interface Props {
	files: File[]
	exif: ExifData[]
}

interface Drawer {
	isOpen: boolean
	file: File | null
	exif: ExifData | null
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
	}),
)

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
					? <DrawerMenu file={drawer.file} exif={drawer.exif} />
					: ''}
			</Drawer>
		</div>
	)
}
