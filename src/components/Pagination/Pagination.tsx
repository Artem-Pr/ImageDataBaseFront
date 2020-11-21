import React, { useState } from 'react'
import { Button, TextField, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Pagination } from '@material-ui/lab'

interface IProps {
	currentPage: number
	totalPages: number
	nPerPage: number
	resultsCount: number
	handleCurrentPage: (event: React.ChangeEvent<unknown>, value: number) => void
	handleNumberPerPage: (value: number) => void
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		pagination: {
			display: 'flex',
			alignItems: 'center',
			'& > *': {
				marginTop: theme.spacing(4),
				marginBottom: theme.spacing(5),
			},
		},
		nPerPage: {
			display: 'flex',
			alignItems: 'center',
		},
		numberField: {
			width: 40,
			marginLeft: 20,
		},
	}),
)

const PaginationElem = ({
	                        currentPage,
	                        nPerPage,
	                        totalPages,
	                        resultsCount,
	                        handleCurrentPage,
	                        handleNumberPerPage,
                        }: IProps) => {
	const classes = useStyles()
	const [numberPerPage, setNumberPerPage] = useState<number>(nPerPage)
	
	const handleApply = () => {
		handleNumberPerPage(numberPerPage)
	}
	
	return (
		<div className={classes.pagination}>
			<div className={classes.nPerPage}>
				<Typography className="ml-4" color="primary" variant="body1">
					Number per page:
				</Typography>
				<TextField
					className={classes.numberField}
					defaultValue={numberPerPage}
					onChange={e => setNumberPerPage(+e.target.value)}
					type="number"
					InputLabelProps={{
						shrink: true,
					}}
					variant="standard"
				/>
				<Button
					className="ml-3"
					color="primary"
					variant="contained"
					onClick={handleApply}
				>Apply</Button>
			</div>
			
			<Pagination
				className="ml-5"
				count={totalPages}
				page={currentPage}
				color="primary"
				onChange={handleCurrentPage}
			/>
			
			<Typography className="ml-4" color="primary" variant="body1">
				{`Total number: ${resultsCount}`}
			</Typography>
		</div>
	)
}

export default PaginationElem
