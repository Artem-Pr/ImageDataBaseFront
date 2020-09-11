import React, { useEffect, useState } from 'react'
import {
	Accordion,
	AccordionSummary,
	Typography,
	AccordionDetails,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import KeywordsSearchComp from '../../components/KeywordsSearchComp/KeywordsSearchComp'
import mainApi from '../../api/api'
import { IDBFileObject } from '../../types'
import TitlebarGridListSearch from '../../components/TitlebarGridList/TitlebarGridListSearch'

interface IProps {
	defaultKeywords: string[]
}

export const SearchPage = ({ defaultKeywords }: IProps) => {
	const [keywordsList, setKeywordsList] = useState<Set<string>>(new Set(defaultKeywords))
	const [searchTags, setSearchTags] = useState<Set<string>>(new Set([]))
	const [excludeTags, setExcludeTags] = useState<Set<string>>(new Set([]))
	const [IDBFilesArr, setIDBFilesArr] = useState<IDBFileObject[]>([])

	useEffect(() => {
		const fetchPhotosByTag = async (
			searchTags: Set<string>,
			excludeTags: Set<string>,
		) => {
			try {
				const response = await mainApi.getPhotosByTags(searchTags, excludeTags)
				setIDBFilesArr(response.data)
			} catch (err) {
				console.log(err)
			}
		}
		
		fetchPhotosByTag(searchTags, excludeTags)
	},[searchTags, excludeTags])
	
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
			<TitlebarGridListSearch IDBFilesArr={IDBFilesArr} />
		</div>
	)
}
