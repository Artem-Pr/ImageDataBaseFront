import React, { useCallback, useEffect, useState } from 'react'
import {
	Accordion,
	AccordionSummary,
	Typography,
	AccordionDetails,
	Dialog,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import KeywordsSearchComp from '../../components/KeywordsSearchComp/KeywordsSearchComp'
import { IDBFileObject, IGallery } from '../../types'
import TitlebarGridListSearch from '../../components/TitlebarGridList/TitlebarGridListSearch'
import ImageGallery from 'react-image-gallery'
import { fetchPhotosByTag, setCurrentPage, setNumberPerPage } from '../../redux/sliceReducer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/rootReducer'
import Iframe from 'react-iframe'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import PaginationElem from '../../components/Pagination/Pagination'

interface IProps {
	defaultKeywords: string[]
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		iframeStyles: {
			width: '100%',
			height: 'calc(100vh - 80px)',
		},
		playButton: {
			cursor: 'pointer',
			position: 'absolute',
			left: 0,
			top: 0,
			bottom: 0,
			right: 0,
			margin: 'auto',
			height: 60,
			width: 100,
			backgroundColor: 'rgba(0, 0, 0, .7)',
			borderRadius: 5,
			
			'&::after': {
				content: '""',
				display: 'block',
				position: 'absolute',
				top: 16.5,
				left: 40,
				margin: '0 auto',
				borderStyle: 'solid',
				borderWidth: '12.5px 0 12.5px 20px',
				borderColor: 'transparent transparent transparent rgba(255,255,255,1)',
			},
		},
	}),
)

export const SearchPage = ({ defaultKeywords }: IProps) => {
	const [keywordsList, setKeywordsList] = useState<Set<string>>(new Set(defaultKeywords))
	const [searchTags, setSearchTags] = useState<Set<string>>(new Set([]))
	const [excludeTags, setExcludeTags] = useState<Set<string>>(new Set([]))
	const [galleryArr, setGalleryArr] = useState<IGallery[]>([])
	const [isGalleryShow, setIsGalleryShow] = useState<boolean>(false)
	const [currentImage, setCurrentImage] = useState<number>(0)
	const [showVideo, setShowVideo] = useState(false)
	const [showPlayButton, setShowPlayButton] = useState(true)
	const [showFullscreenButton, setShowFullscreenButton] = useState(true)
	
	const { searchPhotosArr, searchPagination } = useSelector((state: RootState) => state.mainReducer)
	const { currentPage, totalPages, nPerPage, resultsCount } = searchPagination
	const dispatch = useDispatch()
	const classes = useStyles()
	
	const handleCurrentPage = (event: React.ChangeEvent<unknown>, value: number) => {
		dispatch(setCurrentPage(value))
	};
	
	const handleNumberPerPage = (value: number) => {
		dispatch(setNumberPerPage(value))
	}
	
	const handlePlay = () => {
		setShowVideo(true)
		setShowPlayButton(false)
		setShowFullscreenButton(false)
	}
	
	const videoItem = useCallback((originalPath: string, preview: string) => {
		return (
			<>
				{showVideo ? (
					<Iframe url={originalPath}
					        width="80vm"
					        id="myId"
					        className={classes.iframeStyles}
					        position="relative"
					/>
				) : (
					<div>
						<div className={classes.playButton} onClick={handlePlay} />
						<img src={preview} alt='video-preview' />
					</div>
				)}
			</>
		)
	}, [classes.iframeStyles, classes.playButton, showVideo])
	
	useEffect(() => {
		dispatch(fetchPhotosByTag(searchTags, excludeTags, currentPage, nPerPage))
	}, [dispatch, searchTags, excludeTags, currentPage, nPerPage])
	
	useEffect(() => {
		setGalleryArr(searchPhotosArr.map((item: IDBFileObject) => {
			const galleryItem: IGallery = {
				thumbnail: item.preview,
				original: item.originalPath,
			}
			if (item.mimetype.startsWith('video')) galleryItem.renderItem =
				() => videoItem(item.originalPath, item.preview)
			return galleryItem
		}))
	}, [searchPhotosArr, showVideo, videoItem])
	
	const imageClick = (isGalleryShow: boolean, index: number): void => {
		setIsGalleryShow(isGalleryShow)
		setCurrentImage(index)
	}
	
	const handleSlide = (currentIndex: number) => {
		setCurrentImage(currentIndex)
		setShowPlayButton(true)
		setShowFullscreenButton(true)
		setShowVideo(false)
	}
	
	return (
		<div className="d-flex flex-column my-3">
			<Accordion className="w-50">
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<div>
						<Typography color="primary" variant="button" component="h2">
							Tags
						</Typography>
					</div>
				</AccordionSummary>
				<AccordionDetails className="d-flex">
					<div className="mr-4">
						<KeywordsSearchComp
							title="Search tags"
							keywordsList={keywordsList}
							selectedTags={searchTags}
							setKeywordsList={setKeywordsList}
							setSelectedTags={setSearchTags}
						/>
					</div>
					<div>
						<KeywordsSearchComp
							title="Exclude tags"
							keywordsList={keywordsList}
							selectedTags={excludeTags}
							setKeywordsList={setKeywordsList}
							setSelectedTags={setExcludeTags}
						/>
					</div>
				</AccordionDetails>
			</Accordion>
			
			<PaginationElem
				currentPage={currentPage}
				totalPages={totalPages}
				nPerPage={nPerPage}
				resultsCount={resultsCount}
				handleCurrentPage={handleCurrentPage}
				handleNumberPerPage={handleNumberPerPage}
			/>
			
			<TitlebarGridListSearch
				IDBFilesArr={searchPhotosArr}
				imageClick={imageClick}
				keywordsList={keywordsList}
			/>
			
			<Dialog
				open={isGalleryShow}
				maxWidth="lg"
				fullWidth
				onClose={() => setIsGalleryShow(false)}
			>
				<ImageGallery
					items={galleryArr}
					slideDuration={0}
					slideInterval={3000}
					startIndex={currentImage}
					showThumbnails={false}
					onSlide={handleSlide}
					showPlayButton={showPlayButton}
					showFullscreenButton={showFullscreenButton}
					showIndex
				/>
			</Dialog>
		</div>
	)
}
