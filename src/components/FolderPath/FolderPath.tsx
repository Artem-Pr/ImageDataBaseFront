import React, { useState, useEffect } from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

interface Props {
	finalPath: string
	defaultYear: string
	rootFolder: string
	setFinalPath: (path: string) => void
}

export default function DetailedAccordion({
	finalPath,
	defaultYear,
	rootFolder,
	setFinalPath,
}: Props) {
	const [year, setYear] = useState<string>(defaultYear)
	const [finalFolder, setFinalFolder] = useState<string>('')
	const [extraFolder, setExtraFolder] = useState<string>('')
	const [checkboxYear, setCheckboxYear] = useState<boolean>(false)
	const [checkboxFinalFolder, setCheckboxFinalFolder] = useState<boolean>(false)
	const [checkboxExtraFolder, setCheckboxExtraFolder] = useState<boolean>(false)

	useEffect(() => {
		const newFinalPath = [
			rootFolder,
			checkboxYear || year === '' ? false : year,
			checkboxFinalFolder || finalFolder === '' ? false : finalFolder,
			checkboxExtraFolder || extraFolder === '' ? false : extraFolder,
		].filter((item) => item !== false)
		debugger
		setFinalPath(newFinalPath.join('/'))
	}, [
		year,
		rootFolder,
		finalFolder,
		extraFolder,
		checkboxYear,
		checkboxFinalFolder,
		checkboxExtraFolder,
		setFinalPath,
	])

	return (
		<div className="d-flex mb-3">
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<div>
						<Typography color="primary" variant="button" component="h2">
							Directory
						</Typography>
					</div>
				</AccordionSummary>
				<AccordionDetails className="d-flex flex-column">
					<div className="d-flex align-items-center mb-3">
						<Typography className="mr-3" color="textSecondary" variant="body1">
							Root folder:
						</Typography>
						<TextField defaultValue={rootFolder} />
					</div>
					<div className="d-flex align-items-center mb-3">
						<Typography className="mr-3" color="textSecondary" variant="body1">
							Year folder:
						</Typography>
						<TextField
							disabled={checkboxYear}
							className="mr-3"
							defaultValue={year}
							value={checkboxYear ? '' : year}
							onChange={(e) => setYear(e.target.value)}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={checkboxYear}
									onChange={() => setCheckboxYear(!checkboxYear)}
									name="isYearFolder"
									color="primary"
								/>
							}
							label="Do not use this folder"
						/>
					</div>
					<div className="d-flex align-items-center mb-3">
						<Typography className="mr-3" color="textSecondary" variant="body1">
							Add folder:
						</Typography>
						<TextField
							disabled={checkboxFinalFolder}
							className="mr-3"
							defaultValue={finalFolder}
							value={checkboxFinalFolder ? '' : finalFolder}
							onChange={(e) => setFinalFolder(e.target.value)}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={checkboxFinalFolder}
									onChange={() => setCheckboxFinalFolder(!checkboxFinalFolder)}
									name="isYearFolder"
									color="primary"
								/>
							}
							label="Do not use this folder"
						/>
					</div>
					<div className="d-flex align-items-center mb-3">
						<Typography className="mr-3" color="textSecondary" variant="body1">
							Extra folder:
						</Typography>
						<TextField
							disabled={checkboxExtraFolder}
							className="mr-3"
							defaultValue={extraFolder}
							value={checkboxExtraFolder ? '' : extraFolder}
							onChange={(e) => setExtraFolder(e.target.value)}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={checkboxExtraFolder}
									onChange={() => setCheckboxExtraFolder(!checkboxExtraFolder)}
									name="isYearFolder"
									color="primary"
								/>
							}
							label="Do not use this folder"
						/>
					</div>
					<Typography className="mr-3" color="primary" variant="body2">
						{`Final path: ${finalPath}`}
					</Typography>
				</AccordionDetails>
			</Accordion>
		</div>
	)
}
