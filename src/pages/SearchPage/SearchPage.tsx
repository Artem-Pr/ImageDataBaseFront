import React, { useState } from 'react'
import {
	Accordion,
	AccordionSummary,
	Typography,
	AccordionDetails,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import KeywordsSearchComp from '../../components/KeywordsSearchComp/KeywordsSearchComp'

interface IProps {
	defaultKeywords: string[]
}

export const SearchPage = ({ defaultKeywords }: IProps) => {
	const [keywordsList, setKeywordsList] = useState<Set<string>>(
		new Set(defaultKeywords),
	)

	return (
		<div className="d-flex my-3">
			<Accordion>
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
							setKeywordsList={setKeywordsList}
						/>
					</div>
					<div>
						<KeywordsSearchComp
							title="Exclude tags"
							keywordsList={keywordsList}
							setKeywordsList={setKeywordsList}
						/>
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	)
}
