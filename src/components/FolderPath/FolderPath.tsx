import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

interface Props {
	finalPath: string
	setFinalPath: (path: string) => void
}

export default function DetailedAccordion({
	                                          finalPath,
	                                          setFinalPath,
                                          }: Props) {
	const [inputValue, setInputValue] = useState(finalPath)
	const [popupOpen, setPopupOpen] = useState<boolean>(false)
	const [pathArr, setPathArr] = useState<string[]>(['bom', 'title'])
	
	const addPath = () => {
		const currentPathSet = new Set([...pathArr, inputValue])
		currentPathSet.delete('')
		setPathArr(Array.from(currentPathSet))
		setFinalPath(inputValue)
	}
	
	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		if (e.key === 'Enter') addPath()
	}
	
	return (
		<div className="d-flex mb-3 align-items-end">
			<Autocomplete
				freeSolo
				inputValue={inputValue}
				onInputChange={(event, newInputValue) => {
					setInputValue(newInputValue)
				}}
				onOpen={() => setPopupOpen(true)}
				onClose={() => setPopupOpen(false)}
				onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
					if (!popupOpen) handleKeyDown(e)
				}}
				options={pathArr}
				style={{ width: 300 }}
				renderInput={(params) => (
					<TextField {...params} label="Directory" />
				)}
			/>
			<Typography className="ml-4" color="primary" variant="body1">
				<span className="mr-2">Current folder:</span>
				<span>{finalPath}</span>
			</Typography>
		</div>
	)
}
