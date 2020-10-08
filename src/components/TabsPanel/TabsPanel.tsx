import React, { useState, useEffect } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import { UploadPage } from '../../pages/UploadPage/UploadPage'
import { SearchPage } from '../../pages/SearchPage/SearchPage'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/rootReducer'
import { fetchKeywordsList } from '../../redux/sliceReducer'

interface TabPanelProps {
	children?: React.ReactNode
	index: any
	value: any
}

interface LinkTabProps {
	label?: string
	href?: string
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`nav-tabpanel-${index}`}
			aria-labelledby={`nav-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	)
}

function a11yProps(index: any) {
	return {
		id: `nav-tab-${index}`,
		'aria-controls': `nav-tabpanel-${index}`,
	}
}

function LinkTab(props: LinkTabProps) {
	return (
		<Tab
			component="a"
			onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
				event.preventDefault()
			}}
			{...props}
		/>
	)
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
}))

const sameArr = function(a1: string[], a2: string[]) {
	if (a1.length === 0 && a2.length === 0) return true
	return a1.length === a2.length && a1.every((v,i)=>v === a2[i])
}

export default function TabsPanel() {
	const classes = useStyles()
	const [value, setValue] = useState(0)
	const [tempKeywordsList, setTempKeywordsList] = useState<string[]>([])
	const dispatch = useDispatch()
	const { keywordsList } = useSelector((state: RootState) => state.mainReducer)

	useEffect(() => {
		setTempKeywordsList(prevState => {
			if (!sameArr(prevState, keywordsList)) {
				return keywordsList
			} else {
				return prevState
			}
		})
	}, [dispatch, keywordsList, tempKeywordsList])
	
	useEffect(() => {
		dispatch(fetchKeywordsList())
	}, [dispatch, tempKeywordsList])

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue)
	}

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Tabs
					variant="standard"
					value={value}
					onChange={handleChange}
					aria-label="nav tabs example"
				>
					<LinkTab label="Upload images" {...a11yProps(0)} />
					<LinkTab label="Search images" {...a11yProps(1)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<UploadPage keywords={keywordsList || []} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<SearchPage defaultKeywords={keywordsList || []} />
			</TabPanel>
		</div>
	)
}
