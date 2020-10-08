import React from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import {
	GridList,
	GridListTile,
	GridListTileBar,
	IconButton,
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import { IDBFileObject } from '../../types'
import cx from 'classnames'

interface Props {
	IDBFilesArr: IDBFileObject[]
	imageClick: (isGalleryShow: boolean, index: number) => void
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			margin: '16px 0',
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: 'space-around',
			overflow: 'hidden',
			backgroundColor: theme.palette.background.paper,
		},
		gridList: {
			// поставить медиа запросы
			width: '100%',
		},
		icon: {
			color: 'rgba(255, 255, 255, 0.54)',
		},
		image: {
			objectFit: 'scale-down',
			height: '100%',
		},
		gridListTile: {
			textAlign: 'center',
			minWidth: 200,
			// border: '1px solid #e0e0e0',
			'&:hover .grid-list-tile-bar': {
				transform: 'translateY(0%)',
			},
		},
		gridListTileBar: {
			height: 'auto',
			padding: '10px 0',
			textAlign: 'start',
			transform: 'translateY(100%)',
			transition: 'all 0.2s ease',
		},
		subtitle: {
			marginTop: 10,
			marginBottom: 5,
		},
	}),
)

const TitlebarGridListSearch = ({
	                                IDBFilesArr,
	                                imageClick,
                                }: Props) => {
	const classes = useStyles()
	
	return (
		<div className={classes.root}>
			<GridList cellHeight={180} className={classes.gridList}>
				{IDBFilesArr.map((tile, i) =>
					
					<GridListTile
						key={tile._id}
						cols={0.25}
						className={classes.gridListTile}
					>
						<img
							src={tile.preview}
							alt={tile.originalName}
							className={classes.image}
							onClick={() => imageClick(true, i)}
						/>
						<GridListTileBar
							title={tile.originalName}
							subtitle={<div>
								<div className={classes.subtitle}>{tile.mimetype}</div>
								<div>{tile.originalDate || tile.changeDate}</div>
							</div>}
							className={cx(classes.gridListTileBar, 'grid-list-tile-bar')}
							actionIcon={
								<IconButton
									aria-label={`info about ${tile.originalName}`}
									className={classes.icon}
								>
									<InfoIcon />
								</IconButton>
							}
						/>
					</GridListTile>,
				)}
			</GridList>
		</div>
	)
}

export default TitlebarGridListSearch
