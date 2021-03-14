import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import DraftsIcon from '@material-ui/icons/Drafts'
import SendIcon from '@material-ui/icons/Send'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import StarBorder from '@material-ui/icons/StarBorder'
import GitHubIcon from '@material-ui/icons/GitHub'
import PictureInPictureIcon from '@material-ui/icons/PictureInPicture'
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}))

export default function Cours() {
    const classes = useStyles()
    const [open, setOpen] = React.useState(true)

    const handleClick = () => {
        setOpen(!open)
    }

    return (
        <List component='nav' aria-labelledby='nested-list-subheader' className={classes.root}>
            <ListItem button>
                <ListItemIcon>
                    <PictureAsPdfIcon />
                </ListItemIcon>
                <ListItemText primary='pdf Cours 1' />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <GitHubIcon />
                </ListItemIcon>
                <ListItemText primary='Tp1' />
            </ListItem>
            <ListItem button onClick={handleClick}>
                <ListItemIcon>
                    <PictureInPictureIcon />
                </ListItemIcon>
                <ListItemText primary='Présentation cours 1' />
            </ListItem>
        </List>
    )
}
