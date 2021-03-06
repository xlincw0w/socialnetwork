import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Infos from './Informations'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    section1: {
        margin: theme.spacing(3, 2),
    },
    section2: {
        margin: theme.spacing(2),
    },
    section3: {
        margin: theme.spacing(3, 1, 1),
    },
}))

export default function Carte({ user, profile }) {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <div className={classes.section1}>
                <Typography color='textSecondary' variant='body2'></Typography>

                <Divider My Line variant='middle' />
                <br />
                <Typography color='textSecondary' variant='body2'>
                    <Infos user={user} profile={profile} />
                </Typography>
            </div>
            <Divider variant='middle' />
        </div>
    )
}
