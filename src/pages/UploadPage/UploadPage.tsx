import React, { useState, useEffect } from 'react'
import { ExifData, UploadingObject } from '../../types'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import style from './UploadPage.module.scss'
import { useDropzone } from 'react-dropzone'
import mainApi from '../../api/api'
import Alert from '@material-ui/lab/Alert'
import { Button, ButtonGroup, LinearProgress } from '@material-ui/core'
import TitlebarGridList from '../../components/TitlebarGridList/TitlebarGridList'
import FolderPath from '../../components/FolderPath/FolderPath'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/rootReducer'
import { formatDate } from '../../common/utils'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			'& > * + *': {
				marginTop: theme.spacing(2),
			},
		},
		selectBtn: {
			minWidth: 132,
		},
	}),
)

interface IProps {
	keywords: string[]
}

export const UploadPage = ({ keywords: defaultKeywords }: IProps) => {
	const classes = useStyles()
	const [files, setFiles] = useState<Array<any>>([])
	const [numberOfPhotos, setNumberOfPhotos] = useState<number>(0)
	const [progress, setProgress] = useState<number>(0)
	const [exifDataArr, setExifDataArr] = useState<Array<ExifData>>([])
	const [responseMessage, setResponseMessage] = useState('')
	const [uploadingError, setUploadingError] = useState<boolean>(false)
	const [finalPath, setFinalPath] = useState<string>('')
	const [showSelectAllBtn, setShowSelectAllBtn] = useState<boolean>(false)
	const [showEditSelectedBtn, setShowEditSelectedBtn] = useState<boolean>(false)
	const [selectedArr, setSelectedArr] = useState<boolean[]>([])
	const { pathsList } = useSelector((state: RootState) => state.mainReducer)
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: ['image/*', 'video/*'],
		onDrop: async (acceptedFiles) => {
			setResponseMessage('')
			let numberOfPhotos: number = 0
			
			const imgArr = acceptedFiles.map((file) =>
				Object.assign(file, {
					preview: '',
				}),
			)
			
			const fetchPhotos = async (fileItem: any, i: number) => {
				try {
					const resFile = await mainApi.sendPhoto(fileItem)
					const newArr = Object.assign(imgArr)
					newArr[i] = Object.assign(newArr[i], resFile.data)
					return newArr
				} catch (error) {
					throw error
				}
			}
			
			setProgress(0)
			setFiles(imgArr)
			const photoArr = imgArr.map(async (fileItem, i) => {
				const response = await fetchPhotos(fileItem, i)
				const currentProgress = ((numberOfPhotos + 1) / imgArr.length) * 100
				setFiles(response)
				setProgress(Math.round(currentProgress))
				setNumberOfPhotos(++numberOfPhotos)
				return response
			})
			
			try {
				await Promise.all(photoArr)
				setUploadingError(false)
				setResponseMessage('Previews received successfully')
			} catch (error) {
				setUploadingError(true)
				setResponseMessage('Uploading error')
				console.error(error)
			}
		},
	})
	
	const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()
		
		if (files.length === 0) return
		const uploadingFileArr: UploadingObject[] = exifDataArr.map((item, i) => ({
			originalDate: formatDate(item.originalDate),
			changeDate: formatDate(item.lastModifiedDate || item.changeDate),
			name: item.name || '',
			tempPath: item.tempPath || '',
			type: item.type || '',
			size: item.size || 0,
			megapixels: item.megapixels || '',
			keywords: item.keywords || null,
			preview: files[i].preview,
		}))
		
		try {
			await mainApi.sendPhotos(uploadingFileArr, finalPath)
			setUploadingError(false)
			setResponseMessage('Files uploaded successfully')
			setFiles([])
		} catch (error) {
			setUploadingError(true)
			setResponseMessage('Uploading error')
			console.error(error)
		}
	}
	
	const handleSelectAll = () => {
		setSelectedArr(prevState =>
			new Array(prevState.length).fill(showSelectAllBtn))
	}
	
	useEffect(() => {
		const exifArr = files.map((file) => {
			const {
				name = '',
				size = 0,
				lastModifiedDate = new Date(),
				tempPath = '',
				type = '',
			} = file
			return {
				name,
				size,
				lastModifiedDate,
				tempPath,
				type,
			}
		})
		
		setExifDataArr(exifArr)
	}, [files, progress])
	
	useEffect(() => {
		if (files.length) {
			setShowSelectAllBtn(true)
			setSelectedArr(prevState => {
				if (prevState.length !== files.length)
					return new Array(files.length).fill(false)
				else return prevState
			})
		}
	}, [files])
	
	useEffect(() => {
		setShowSelectAllBtn(selectedArr.includes(false))
		setShowEditSelectedBtn(selectedArr.includes(true))
	}, [selectedArr])
	
	return (
		<div>
			<div className="d-flex align-items-center">
				<ButtonGroup color="primary" className="mr-3">
					<Button
						className={classes.selectBtn}
						onClick={handleSelectAll}
						disabled={!files.length}
					>
						{showSelectAllBtn || !files.length ? 'select all' : 'deselect all'}
					</Button>
					<Button disabled={!showEditSelectedBtn}>edit selected</Button>
				</ButtonGroup>
				
				<FolderPath
					pathsList={pathsList}
					finalPath={finalPath}
					setFinalPath={setFinalPath}
				/>
			</div>
			<div {...getRootProps({ className: style.dropzone })}>
				<input {...getInputProps()} />
				{isDragActive ? (
					<span className="m-0">Drop the files here ...</span>
				) : (
					<div>
						<span className="m-0">
							Drag 'n' drop some files here, or click to select files
						</span>
						<div className="d-flex flex-column">
							<div className="my-2 w-100">
								<LinearProgress variant="determinate" value={progress} />
							</div>
							<div>
								{numberOfPhotos ? (
									<span>{`${numberOfPhotos} files uploaded`}</span>
								) : (
									''
								)}
							</div>
						</div>
					</div>
				)}
			</div>
			
			<div className={classes.root}>
				{uploadingError ? (
					<Alert severity="error">{responseMessage}</Alert>
				) : (
					''
				)}
				{!uploadingError && responseMessage ? (
					<Alert className="mt-3" severity="success">
						{responseMessage}
					</Alert>
				) : (
					''
				)}
			</div>
			
			{files.length ? (
				<TitlebarGridList
					defaultKeywords={defaultKeywords}
					files={files}
					exifArr={exifDataArr}
					setExifDataArr={setExifDataArr}
					selectedArr={selectedArr}
					setSelectedArr={setSelectedArr}
				/>
			) : (
				''
			)}
			
			<Button
				className="mt-3"
				color="primary"
				variant="contained"
				onClick={handleSubmit}
				disabled={progress !== 100}
			>
				Submit
			</Button>
		</div>
	)
}
