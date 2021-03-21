import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		selectBtn: {
			minWidth: 132,
		},
	}),
)

interface IProps {
	selectedArr: boolean[]
	setSelectedArr: React.Dispatch<React.SetStateAction<boolean[]>>
	setEditSelectedClick: React.Dispatch<React.SetStateAction<boolean>>
	files: any[]
}

const SelectAll = ({
	                   selectedArr,
	                   setSelectedArr,
	                   setEditSelectedClick,
	                   files,
                   }: IProps) => {
	const classes = useStyles()
	const [showSelectAllBtn, setShowSelectAllBtn] = useState<boolean>(false)
	const [showEditSelectedBtn, setShowEditSelectedBtn] = useState<boolean>(false)
	
	const handleSelectAll = () => {
		setSelectedArr(prevState =>
			new Array(prevState.length).fill(showSelectAllBtn))
	}
	
	useEffect(() => {
		if (files.length) {
			setShowSelectAllBtn(true)
			setSelectedArr(prevState => {
				if (prevState.length !== files.length)
					return new Array(files.length).fill(false)
				else return prevState
			})
		}
	}, [files, setSelectedArr])
	
	useEffect(() => {
		setShowSelectAllBtn(selectedArr.includes(false))
		setShowEditSelectedBtn(selectedArr.includes(true))
	}, [selectedArr])
	
	return (
		<div className="d-flex align-items-center">
			<ButtonGroup color="primary" className="mr-3">
				<Button
					className={classes.selectBtn}
					onClick={handleSelectAll}
					disabled={!files.length}
				>
					{showSelectAllBtn || !files.length ? 'select all' : 'deselect all'}
				</Button>
				<Button
					disabled={!showEditSelectedBtn}
					onClick={() => setEditSelectedClick(true)}
				>
					edit selected
				</Button>
			</ButtonGroup>
			<Typography color="textPrimary" component="span">
				{`selected: ${selectedArr.filter(i => i).length}/${files.length}`}
			</Typography>
		</div>
	)
}

export default SelectAll
