import React, { useState, useEffect } from 'react'
import { File, ExifData, ExifDataStringify } from '../../types'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import style from './UploadPage.module.scss'
import { useDropzone } from 'react-dropzone'
import mainApi from '../../api/api'
import Alert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
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

export const UploadPage = ({ keywords: defaultKeywords }: IProps) => {
	const classes = useStyles()
	const rootFolder = 'D:/IDB/bin'
	const defaultYear = '2020'
	const [files, setFiles] = useState<Array<File>>([])
	const [exifDataArr, setExifDataArr] = useState<Array<ExifData>>([])
	const [responseMessage, setResponseMessage] = useState('')
	const [uploadingError, setUploadingError] = useState<boolean>(false)
	const [finalPath, setFinalPath] = useState<string>(
		rootFolder + '/' + defaultYear,
	)
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: 'image/*',
		onDrop: (acceptedFiles) => {
			setResponseMessage('')

			const imgArr = acceptedFiles.map((file) =>
				Object.assign(file, {
					preview: URL.createObjectURL(file),
				}),
			)
			setFiles(imgArr)
		},
	})

	const getImageData = (imgArr: File[]) => {
		const exifDataArrPromise = imgArr.map((file) => extractDate(file))

		Promise.all(exifDataArrPromise).then((exifDataArr) =>
			setExifDataArr(exifDataArr),
		)
	}

	const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()

		if (files.length === 0) return

		const exifArrStrigify: ExifDataStringify[] = exifDataArr.map((exif) => ({
			keywords: exif.keywords,
			changeDate: moment(exif.changeDate).format('DD.MM.YYYY'),
			...(exif.originalDate && {
				originalDate: moment(exif.originalDate).format('DD.MM.YYYY'),
			}),
			...(exif.error && { error: exif.error }),
		}))

		try {
			await mainApi.sendPhotos(files, exifArrStrigify, finalPath)
			setUploadingError(false)
			setResponseMessage('Files uploaded successfully')
			setFiles([])
		} catch (error) {
			setUploadingError(true)
			setResponseMessage('Uploading error')
			console.error(error)
		}
	}

	// Создание картинки из Blob
	// setImg(URL.createObjectURL(files[0]))
	useEffect(() => {
		getImageData(files)

		return () => {
			files.forEach((file) => URL.revokeObjectURL(file.preview))
		}
	}, [files])

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
					<span className="m-0">
						Drag 'n' drop some files here, or click to select files
					</span>
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
				disabled={files.length ? false : true}
			>
				Submit
			</Button>
		</div>
	)
}
