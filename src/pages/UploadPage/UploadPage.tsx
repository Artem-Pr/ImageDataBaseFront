import React, { useState, useEffect } from 'react'
import { File, ExifData, UploadingObject } from '../../types'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import style from './UploadPage.module.scss'
import { useDropzone } from 'react-dropzone'
import mainApi from '../../api/api'
import Alert from '@material-ui/lab/Alert'
import { Button, LinearProgress } from '@material-ui/core'
import TitlebarGridList from '../../components/TitlebarGridList/TitlebarGridList'
import moment from 'moment'
import FolderPath from '../../components/FolderPath/FolderPath'
const loadImage = require('blueimp-load-image')

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			'& > * + *': {
				marginTop: theme.spacing(2),
			},
		},
	}),
)

const extractDate = async (file: File) => {
	const exifData: ExifData = {
		changeDate: file.lastModifiedDate || new Date(),
	}

	try {
		const { exif, iptc } = await loadImage(file, { meta: true })
		const keywords: string = iptc?.getText('Keywords')
		const rawOriginalDate = exif && exif[306]

		if (keywords && keywords !== 'undefined') {
			exifData.keywords = keywords.split(',').map((item) => item.trim())
		}
		if (rawOriginalDate) {
			// @ts-ignore
			exifData.originalDate = moment(rawOriginalDate, 'YYYY:MM:DD hh:mm:ss')._d
		}
		return exifData
	} catch (error) {
		console.log(`${file.name} не имеет exif`)
		exifData.error = 'LoadImage parsing error'
		return exifData
	}
}

interface IProps {
	keywords: string[]
}

interface IPreviewData {
	preview: string
	tempPath: string
}

export const UploadPage = ({ keywords: defaultKeywords }: IProps) => {
	const classes = useStyles()
	const rootFolder = 'D:/IDB/bin'
	const defaultYear = '2020'
	const [files, setFiles] = useState<Array<File>>([])
	const [numberOfPhotos, setNumberOfPhotos] = useState<number>(0)
	const [progress, setProgress] = useState<number>(0)
	const [exifDataArr, setExifDataArr] = useState<Array<ExifData>>([])
	const [responseMessage, setResponseMessage] = useState('')
	const [uploadingError, setUploadingError] = useState<boolean>(false)
	const [finalPath, setFinalPath] = useState<string>(
		rootFolder + '/' + defaultYear,
	)
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: 'image/*',
		onDrop: async (acceptedFiles) => {
			setResponseMessage('')
			let numberOfPhotos: number = 0

			const imgArr = acceptedFiles.map((file) =>
				Object.assign(file, {
					preview: '',
				}),
			)

			const fetchPhotos = async (fileItem: File, i: number) => {
				try {
					const resFile = await mainApi.sendPhoto(fileItem)
					const newArr = Object.assign(imgArr)
					newArr[i] = Object.assign(newArr[i], resFile.data)
					return newArr
				} catch (error) {
					throw error
				}
			}

			setFiles(imgArr)
			const photoArr = imgArr.map(async (fileItem, i) => {
				const response = await fetchPhotos(fileItem, i)
				const progress = ((numberOfPhotos + 1) / imgArr.length) * 100
				setFiles(response)
				setProgress(Math.round(progress))
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

	const getImageData = (imgArr: File[]) => {
		const exifDataArrPromise = imgArr.map((file) => extractDate(file))

		Promise.all(exifDataArrPromise).then((exifDataArr) =>{
			setExifDataArr(exifDataArr)
		}
		)
	}

	const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()

		if (files.length === 0) return

		const uploadingFileArr: UploadingObject[] = exifDataArr.map((item) => ({
			changeDate: moment(item.lastModifiedDate).format('DD.MM.YYYY'),
			name: item.name || '',
			tempPath: item.tempPath || '',
			type: item.type || '',
			size: item.size || 0,
			megapixels: item.megapixels || '',
			keywords: item.keywords || null,
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

	return (
		<div>
			<div>
				<FolderPath
					finalPath={finalPath}
					defaultYear={defaultYear}
					rootFolder={rootFolder}
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

			{files.length ? (
				<TitlebarGridList
					defaultKeywords={defaultKeywords}
					files={files}
					exifArr={exifDataArr}
					setExifDataArr={setExifDataArr}
				/>
			) : (
				''
			)}

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

			<Button
				className="mt-3"
				color="primary"
				variant="contained"
				onClick={handleSubmit}
				disabled={progress === 100 ? false : true}
			>
				Submit
			</Button>
		</div>
	)
}
