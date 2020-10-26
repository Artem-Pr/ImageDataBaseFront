import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Drawer, GridList, GridListTile, GridListTileBar, IconButton } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import { ExifData, File, IChangedData, IDBFileObject, IDrawer } from '../../types'
import DrawerMenu from '../DrawerMenu/DrawerMenu'
import moment from 'moment'

interface Props {
	IDBFilesArr: IDBFileObject[]
	keywordsList: Set<string>
	imageClick: (isGalleryShow: boolean, index: number) => void
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
		fullList: {
			width: 'auto',
		},
		gridList: {
			// поставить медиа запросы
			width: '100%',
		},
		icon: {
			color: 'rgba(255, 255, 255, 0.54)',
		},
		image: {
			objectFit: 'scale-down',
			height: '100%',
		},
		//Todo: починить выдвигающиеся данные для фото
		// gridListTile: {
		// 	textAlign: 'center',
		// 	width: '200px !important',
		// 	overflow: 'hidden',
		// 	// height: '133px !important',
		// 	'&:hover .grid-list-tile-bar': {
		// 		transform: 'translateY(0%)',
		// 	},
		// },
		// gridListTileBar: {
		// 	height: 'auto',
		// 	padding: '10px 0',
		// 	textAlign: 'start',
		// 	transform: 'translateY(100%)',
		// 	transition: 'all 0.2s ease',
		// },
		subtitle: {
			marginTop: 10,
			marginBottom: 5,
		},
	}),
)

const convertExif = (IDBFilesArr: IDBFileObject[]): ExifData[] => {
	return IDBFilesArr.map(file => ({
		keywords: file?.keywords,
		imageSizes: file?.imageSize,
		megapixels: file?.megapixels ? +file?.megapixels : undefined,
		// @ts-ignore
		originalDate: moment(file?.originalDate, 'DD:MM:YYYY')._d,
		// @ts-ignore
		changeDate: moment(file?.changeDate, 'DD:MM:YYYY')._d,
	}))
}

const TitlebarGridListSearch = ({
	                                IDBFilesArr,
	                                imageClick,
	                                keywordsList,
                                }: Props) => {
	const classes = useStyles()
	const drawerInit: IDrawer = {
		isOpen: false,
		file: { preview: '' },
		exif: {},
	}
	const [drawer, setDrawer] = useState<IDrawer>(drawerInit)
	const [exifArr, setExifArr] = useState<ExifData[]>([])
	
	const openDrawer = (
		isOpen: boolean,
		file: IDBFileObject | null = null,
		i: number = 0,
	) => {
		const convertedFile: File = {
			name: file?.originalName || '',
			size: file?.size || 0,
			preview: file?.preview || '',
		}
		
		setDrawer({
			file: convertedFile,
			exif: exifArr[i],
			isOpen,
		})
	}
	
	const updateExifArr = (changedData: IChangedData, exif: ExifData): void => {
		const newExifArr = exifArr.map((exifItem, i) => {
			if (exifItem.name === changedData.originalName) {
				return { ...exif, lastModifiedDate: exifItem.lastModifiedDate }
			} else {
				return exifItem
			}
		})
		setExifArr(newExifArr)
	}
	
	useEffect(() => {
		setExifArr(convertExif(IDBFilesArr))
	}, [IDBFilesArr])
	
	
	return (
		<div className={classes.root}>
			<GridList cellHeight={180} className={classes.gridList}>
				{IDBFilesArr.map((tile, i) =>
					
					<GridListTile
						key={tile._id}
						cols={0.25}
						// className={classes.gridListTile}
					>
						<img
							src={tile.preview}
							alt={tile.originalName}
							className={classes.image}
							onClick={() => imageClick(true, i)}
						/>
						<GridListTileBar
							title={tile.originalName}
							subtitle={<div>
								<div className={classes.subtitle}>{tile.mimetype}</div>
								<div>{tile.originalDate || tile.changeDate}</div>
							</div>}
							// className={cx(classes.gridListTileBar, 'grid-list-tile-bar')}
							actionIcon={
								<IconButton
									aria-label={`info about ${tile.originalName}`}
									className={classes.icon}
									onClick={() => openDrawer(true, tile, i)}
								>
									<InfoIcon />
								</IconButton>
							}
						/>
					</GridListTile>,
				)}
			</GridList>
			
			<Drawer
				anchor="left"
				open={drawer.isOpen}
				onClose={() => openDrawer(false)}
			>
				<DrawerMenu
					defaultKeywords={Array.from(keywordsList)}
					file={drawer.file}
					exif={drawer.exif}
					updateExifArr={updateExifArr}
				/>
			</Drawer>
		</div>
	)
}

export default TitlebarGridListSearch
