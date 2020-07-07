import React, { useState, useEffect } from 'react'
import { File, ExifData } from '../../types'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import style from './UploadPage.module.scss'
import { useDropzone } from 'react-dropzone'
import { mainApi } from '../../api/api'
import Alert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import TitlebarGridList from '../../components/TitlebarGridList/TitlebarGridList'
import moment from 'moment'
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
			exifData.keywords = keywords.split(', ')
		}
		if (rawOriginalDate) {
			// @ts-ignore
			exifData.originalDate = moment(rawOriginalDate, 'YYYY:MM:DD hh:mm:ss')._d
		}
		// console.log('exif', exif)
		return exifData
	} catch (error) {
		console.log(`${file.name} не имеет exif`)
		exifData.error = 'LoadImage parsing error'
		return exifData
	}
}

export const UploadPage = () => {
	const classes = useStyles()
	const [files, setFiles] = useState<Array<File>>([])
	const [exifDataArr, setExifDataArr] = useState<Array<ExifData>>([])
	const [responseMessage, setResponseMessage] = useState('')
	const [uploadingError, setUploadingError] = useState<boolean>(false)
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
		try {
			await mainApi.sendPhotos(files, exifDataArr)
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
		getImageData(files)

		return () => {
			files.forEach((file) => URL.revokeObjectURL(file.preview))
		}
	}, [files])

	return (
		<div>
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
					<Alert severity="success">{responseMessage}</Alert>
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
