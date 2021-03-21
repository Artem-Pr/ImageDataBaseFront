import React, { useEffect, useState } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import {
	GridList,
	GridListTile,
	GridListTileBar,
	IconButton,
	Drawer,
	CircularProgress,
	Paper,
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import { File, ExifData, IDrawer } from '../../types'
import DrawerMenu from '../DrawerMenu/DrawerMenu'
import mainApi from '../../api/api'
import moment from 'moment'
import { updateExifArr } from '../../common/utils'

interface Props {
	defaultKeywords: string[]
	files: File[]
	exifArr: ExifData[]
	selectedArr: boolean[]
	setExifDataArr: React.Dispatch<React.SetStateAction<ExifData[]>>
	setSelectedArr: React.Dispatch<React.SetStateAction<boolean[]>>
	openDrawerByEditSelectedClick: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }
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
		gridListTile: {
			minWidth: 200,
		},
		icon: {
			color: 'rgba(255, 255, 255, 0.54)',
		},
		paper1: {
			position: 'absolute',
			display: 'flex',
			'& > *': {
				margin: theme.spacing(1),
				width: theme.spacing(16),
				height: theme.spacing(16),
			},
		},
		paper: {
			height: '100%',
			width: '100%',
		},
		gridListMenuSelected: {
			background: 'rgba(0, 132, 236, 0.83)',
		},
		image: {
			cursor: 'pointer',
		},
	}),
)

const prepareExif = (rawExif: any, file: File | null): ExifData => {
	const { DateTimeOriginal, CreateDate, MediaCreateDate } = rawExif // try to get all possible fields
	const exifOriginalDate = DateTimeOriginal || CreateDate || MediaCreateDate
	const originalDate = exifOriginalDate ?
		// @ts-ignore
		moment(exifOriginalDate, 'YYYY:MM:DD hh:mm:ss')._d
		: null
	let keywords = rawExif?.Keywords
	if (keywords && !Array.isArray(keywords)) keywords = [keywords]
	
	return {
		changeDate: file?.lastModifiedDate || new Date(),
		...(file?.name && { name: file.name }),
		...(originalDate && { originalDate }),
		...(keywords && { keywords }),
		...(rawExif.Megapixels && { megapixels: rawExif.Megapixels }),
		...(rawExif.ImageSize && { imageSizes: rawExif.ImageSize }),
		...(file?.size && { size: file.size }),
		...(file?.tempPath && { tempPath: file.tempPath }),
		...(file?.type && { type: file.type }),
	}
}

export default function TitlebarGridList({
	                                         defaultKeywords,
	                                         files,
	                                         exifArr,
	                                         setExifDataArr,
	                                         selectedArr,
	                                         setSelectedArr,
	                                         openDrawerByEditSelectedClick,
                                         }: Props) {
	const classes = useStyles()
	const drawerInit: IDrawer = {
		isOpen: false,
		file: { preview: '' },
		exif: {},
	}
	const [drawer, setDrawer] = useState<IDrawer>(drawerInit)
	
	const toggleDrawer = async (
		isOpen: boolean,
		file: File = { preview: '' },
		index: number = 0,
	) => {
		let newExif: ExifData | null
		if (!isOpen && openDrawerByEditSelectedClick.isOpen) {
			openDrawerByEditSelectedClick.setIsOpen(false)
			return
		}
		
		if (!exifArr[index].megapixels && isOpen) {
			const response = await mainApi.getKeywordsFromPhoto(file?.tempPath)
			const rawExif = response.data
			newExif = prepareExif(rawExif, file)
		} else {
			newExif = exifArr[index]
		}
		newExif = { ...newExif, ...exifArr[index] } // Переносим в newExif данные, которые могли быть изменены
		
		file?.name && updateExifArr(
			{ originalName: file.name },
			newExif,
			openDrawerByEditSelectedClick,
			exifArr,
			selectedArr,
			setExifDataArr,
		)
		setDrawer({
			file,
			exif: newExif,
			isOpen,
		})
	}
	
	const handleSelect = (index: number) => {
		const updatedSelectedArr = [...selectedArr]
		updatedSelectedArr[index] = !selectedArr[index]
		setSelectedArr(updatedSelectedArr)
	}
	
	useEffect(() => {
		setDrawer({
			isOpen: openDrawerByEditSelectedClick.isOpen,
			file: { preview: '' },
			exif: { name: '' },
		})
	}, [openDrawerByEditSelectedClick.isOpen])
	
	if (files.length === 0) return <div />
	
	return (
		<div className={classes.root}>
			<GridList cellHeight={180} className={classes.gridList}>
				{files.map((tile, i) =>
					tile.preview ? (
						<GridListTile
							className={classes.gridListTile}
							key={tile.preview + i}
							cols={0.25}
						>
							<img
								src={tile.preview}
								alt={exifArr[i]?.name || tile.name}
								className={classes.image}
								onClick={() => handleSelect(i)}
							/>
							<GridListTileBar
								className={selectedArr[i] ? classes.gridListMenuSelected : ''}
								title={exifArr[i]?.name || tile.name}
								actionIcon={
									<IconButton
										aria-label={`info about ${exifArr[i]?.name || tile.name}`}
										className={classes.icon}
										onClick={() => toggleDrawer(true, tile, i)}
									>
										<InfoIcon />
									</IconButton>
								}
							/>
						</GridListTile>
					) : (
						<GridListTile key={tile.preview + '-placeholder' + i} cols={0.25}>
							<div className="w-100 h-75 d-flex align-items-center justify-content-center position-relative">
								<div className="position-absolute w-100 h-100">
									<Paper
										classes={{
											root: classes.paper,
										}}
										variant="outlined"
										square
									/>
								</div>
								<CircularProgress />
							</div>
							<GridListTileBar title={tile.name} />
						</GridListTile>
					),
				)}
			</GridList>
			<Drawer
				anchor="left"
				open={drawer.isOpen}
				onClose={() => toggleDrawer(false)}
			>
				{drawer && drawer.file && drawer.exif ? (
					<DrawerMenu
						defaultKeywords={defaultKeywords}
						exif={drawer.exif}
						openDrawerByEditSelectedClick={openDrawerByEditSelectedClick}
						exifArr={exifArr}
						selectedArr={selectedArr}
						setExifDataArr={setExifDataArr}
					/>
				) : (
					''
				)}
			</Drawer>
		</div>
	)
}
