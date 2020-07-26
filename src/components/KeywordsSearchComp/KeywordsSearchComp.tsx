import React, { useState } from 'react'
import {
	Typography,
	TextField,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Divider,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import DeleteIcon from '@material-ui/icons/Delete'

interface IProps {
	keywordsList: Set<string>
	setKeywordsList: (keywordsList: Set<string>) => void
	title: string
}

const KeywordsSearchComp = ({
	keywordsList,
	setKeywordsList,
	title,
}: IProps) => {
	const [inputValue, setInputValue] = useState('')
	const [popupOpen, setPopupOpen] = useState<boolean>(false)
	const [currentKeywords, setCurrentKeywords] = useState<Set<string>>(
		new Set([]),
	)

	const addKeyword = (): void => {
		if (!keywordsList.has(inputValue)) return
		setCurrentKeywords(currentKeywords.add(inputValue))
		const newKeywordsList = new Set(keywordsList)
		newKeywordsList.delete(inputValue)
		setKeywordsList(newKeywordsList)
		setInputValue('')
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
		if (e.key === 'Enter') addKeyword()
	}

	const handleDelete = (
		e: React.MouseEvent<HTMLElement>,
		keyword: string,
	): void => {
		const newKeywords = new Set(currentKeywords)
		newKeywords.delete(keyword)
		setCurrentKeywords(newKeywords)

		const newKeywordsList = [...Array.from(keywordsList), keyword].sort()
		const newKeywordsListSet = new Set(newKeywordsList)
		setKeywordsList(newKeywordsListSet)
	}

	return (
		<div className="d-flex flex-column">
			<div>
				<Typography color="secondary" variant="button" component="h2">
					{title}
				</Typography>
			</div>
			<Autocomplete
				inputValue={inputValue}
				onInputChange={(event, newInputValue) => {
					setInputValue(newInputValue)
				}}
				onOpen={() => setPopupOpen(true)}
				onClose={() => setPopupOpen(false)}
				onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
					if (!popupOpen) handleKeyDown(e)
				}}
				options={Array.from(keywordsList)}
				style={{ width: 300 }}
				renderInput={(params) => (
					<TextField {...params} label="select keywords" />
				)}
			/>
			<List>
				{Array.from(currentKeywords).map((tag, i) => (
					<div key={i}>
						<ListItem>
							<ListItemText primary={tag} />
							<ListItemSecondaryAction>
								<IconButton edge="end" onClick={(e) => handleDelete(e, tag)}>
									<DeleteIcon />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
						{currentKeywords.size !== i + 1 ? <Divider /> : ''}
					</div>
				))}
			</List>
		</div>
	)
}

export default KeywordsSearchComp
