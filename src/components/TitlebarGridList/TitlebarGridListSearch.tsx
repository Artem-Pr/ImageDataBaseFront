import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Drawer, GridList, GridListTile, GridListTileBar, IconButton } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import { ExifData, File, IDBFileObject, IDrawer, IIdentifierObject, UpdatedObject } from '../../types'
import DrawerMenu from '../DrawerMenu/DrawerMenu'
import moment from 'moment'
import { isDifferentKeywords, formatDate, updateExifArr } from '../../common/utils'
import { useModal } from '../../common/Hooks'
import Modal from '../Modal/Modal'
import { setSearchPhotosArr } from '../../redux/sliceReducer'
import mainApi from '../../api/api'

interface Props {
	IDBFilesArr: IDBFileObject[]
	keywordsList: Set<string>
	imageClick: (isGalleryShow: boolean, index: number) => void
	selectedArr: boolean[]
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
		gridListTile: {
			width: '200px !important',
			// 	textAlign: 'center',
			// 	overflow: 'hidden',
			// 	// height: '133px !important',
			// 	'&:hover .grid-list-tile-bar': {
			// 		transform: 'translateY(0%)',
		},
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

const getDuplicateNames = (arr1: IIdentifierObject[], arr2: IIdentifierObject[]): IIdentifierObject[] => {
	return arr1.filter(item => {
		const duplicateElem = arr2.filter(item2 => {
			if (
				item2.name === item.name &&
				item2.id !== item.id
			) {
				const path1 = item.originalPath.slice(0, -item.originalName.length)
				const path2 = item2.originalPath.slice(0, -item2.originalName.length)
				return path1 === path2
			}
			return false
		})
		
		return duplicateElem.length
	})
}

// Сравниваем имена, даты и ключевые слова, чтобы понять, надо ли вызывать модальное окно
const getUpdatedFilesArr = (IDBFilesArr: IDBFileObject[], exifArr: ExifData[]): UpdatedObject[] | null => {
	const updatingFilesArr: UpdatedObject[] = []
	IDBFilesArr.forEach(({
		                     _id,
		                     originalName,
		                     originalDate,
		                     keywords,
	                     }, i) => {
		const isNameChanged = originalName !== exifArr[i].name
		const isDateChanged = originalDate !== formatDate(exifArr[i]?.originalDate)
		const isKeywordsChanged = isDifferentKeywords(keywords, exifArr[i].keywords)
		
		const updatedFields = new Map<string, string | string[] | null>()
		isNameChanged && updatedFields.set('originalName', exifArr[i].name || '')
		isDateChanged && updatedFields.set('originalDate', originalDate)
		isKeywordsChanged && updatedFields.set('keywords', keywords)
		
		if (updatedFields.size) {
			updatingFilesArr.push({
				id: _id,
				updatedFields: Object.fromEntries(updatedFields.entries()),
			})
		}
	})
	return updatingFilesArr.length ? updatingFilesArr : null
}

const convertExif = (IDBFilesArr: IDBFileObject[]): ExifData[] => {
	return IDBFilesArr.map(({
		                        _id,
		                        size,
		                        originalName,
		                        keywords,
		                        imageSize,
		                        megapixels,
		                        originalDate,
		                        changeDate,
	                        }) => {
		const fixedOriginalDate = originalDate === '-' || originalDate === ''
			? originalDate
			// @ts-ignore
			: moment(originalDate, 'DD:MM:YYYY')._d
		const fixedChangeDate = changeDate === '-' || changeDate === ''
			? changeDate
			// @ts-ignore
			: moment(changeDate, 'DD:MM:YYYY')._d
		return {
			_id,
			size,
			keywords,
			name: originalName,
			imageSizes: imageSize,
			megapixels: megapixels ? +megapixels : undefined,
			originalDate: fixedOriginalDate,
			changeDate: fixedChangeDate,
		}
	})
}

const TitlebarGridListSearch = ({
	                                IDBFilesArr,
	                                imageClick,
	                                keywordsList,
	                                selectedArr,
	                                setSelectedArr,
	                                openDrawerByEditSelectedClick,
                                }: Props) => {
	const classes = useStyles()
	const drawerInit: IDrawer = {
		isOpen: false,
		file: { preview: '' },
		exif: {},
	}
	const [drawer, setDrawer] = useState<IDrawer>(drawerInit)
	const [exifArr, setExifArr] = useState<ExifData[]>([])
	const [changedElements, setChangedElements] = useState<UpdatedObject[]>([])
	const [duplicateNameElemArr, setDuplicateNameElemArr] = useState<IIdentifierObject[]>([])
	const { isShowing, toggle } = useModal()
	const {
		isShowing: isDuplicateNamesModalShowing,
		toggle: toggleDuplicateNamesModal,
	} = useModal()
	
	const createDuplicatesNameArr = () => {
		const preparedChangedElemArr: IIdentifierObject[] = changedElements.map(item => ({
			id: item.id,
			name: item.updatedFields.originalName || '',
			originalName: IDBFilesArr
				.find(file => item.id === file._id)
				?.originalName || '',
			originalPath: IDBFilesArr
				.find(file => item.id === file._id)
				?.originalPath || '',
		}))
		const preparedIDBFilesArr: IIdentifierObject[] = IDBFilesArr.map(({ _id, originalName, originalPath }) => ({
			id: _id,
			name: originalName,
			originalName,
			originalPath,
		}))
		return getDuplicateNames(preparedChangedElemArr, preparedIDBFilesArr)
	}
	
	const openDrawer = (
		isOpen: boolean,
		file: IDBFileObject | null = null,
		i: number | null = null,
	) => {
		const convertedFile: File = {
			name: file?.originalName || '',
			size: file?.size || 0,
			preview: file?.preview || '',
		}
		
		setDrawer({
			isOpen,
			file: convertedFile,
			exif: i === null ? {} : exifArr[i],
			...(i !== null && { index: i }),
		})
	}
	
	useEffect(() => {
		setExifArr(convertExif(IDBFilesArr))
	}, [IDBFilesArr])
	
	const handleDrawerClose = () => {
		const updatingFilesArr = getUpdatedFilesArr(IDBFilesArr, exifArr)
		if (updatingFilesArr) {
			toggle()
			setChangedElements(updatingFilesArr)
		} else {
			openDrawer(false)
		}
	}
	
	const handleDialogCancel = () => {
		setExifArr(convertExif(IDBFilesArr))
		toggle()
		openDrawer(false)
	}
	
	const handleDuplicateModalCancel = () => {
		setExifArr(convertExif(IDBFilesArr))
		toggleDuplicateNamesModal()
		openDrawer(false)
	}
	
	const handleDialogApply = async () => {
		const duplicatesArr = createDuplicatesNameArr()
		if (duplicatesArr.length) {
			setDuplicateNameElemArr(duplicatesArr)
			toggleDuplicateNamesModal()
		}
		try {
			const response = await mainApi.updatePhotos(changedElements)
			console.log('response - ', response.data)
		} catch (error) {
			console.log('error - ', error)
		}
		toggle()
		openDrawer(false)
	}
	
	
	// console.log('IDBFilesArr', IDBFilesArr)
	// console.log('exifArr', exifArr)
	// console.log('changedElements', changedElements)
	// console.log('duplicateNameElemArr', duplicateNameElemArr)
	
	return (
		<div className={classes.root}>
			<GridList cellHeight={180} className={classes.gridList}>
				{IDBFilesArr.map((tile, i) =>
					
					<GridListTile
						key={tile._id}
						cols={0.25}
						className={classes.gridListTile}
					>
						<img
							src={tile.preview}
							alt={exifArr[i]?.name || tile.originalName}
							className={classes.image}
							onClick={() => imageClick(true, i)}
						/>
						<GridListTileBar
							title={exifArr[i]?.name || tile.originalName}
							subtitle={<div>
								<div className={classes.subtitle}>{tile.mimetype}</div>
								<div>{
									formatDate(exifArr[i]?.originalDate) ||
									tile.originalDate ||
									tile.changeDate ||
									'-'
								}</div>
							</div>}
							// className={cx(classes.gridListTileBar, 'grid-list-tile-bar')}
							actionIcon={
								<IconButton
									aria-label={`info about ${exifArr[i]?.name || tile.originalName}`}
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
				onClose={handleDrawerClose}
			>
				<DrawerMenu
					defaultKeywords={Array.from(keywordsList)}
					exif={drawer.exif}
					openDrawerByEditSelectedClick={openDrawerByEditSelectedClick}
					exifArr={exifArr}
					selectedArr={selectedArr}
					setExifDataArr={setExifArr}
				/>
			</Drawer>
			
			<Modal
				isShowing={isShowing}
				cancel={handleDialogCancel}
				apply={handleDialogApply}
				type='alert'
				title='Save changes?'
			>
				You have changed some properties of the image/images. Do you want to keep these changes?
			</Modal>
			
			<Modal
				isShowing={isDuplicateNamesModalShowing}
				cancel={handleDuplicateModalCancel}
				apply={handleDialogApply}
				applyButtonText='auto rename'
				type='alert'
				title='Names are duplicated'
			>
				<div>
					<span>The following names are duplicated:</span>
					<ul>
						{duplicateNameElemArr.map(({ name, originalPath}) => (
							<li key={originalPath}>{name}</li>
						))}
					</ul>
				</div>
			</Modal>
		</div>
	)
}

export default TitlebarGridListSearch
