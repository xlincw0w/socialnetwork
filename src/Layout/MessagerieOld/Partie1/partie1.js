import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { constants } from '../../../constants'
import { SetFriends } from '../../../store/auth/auth'
import { deepPurple } from '@material-ui/core/colors'
import Axios from 'axios'
import img from '../img/1.jpg'
import img2 from '../img/2.jpg'
import img3 from '../img/3.jpg'
import img4 from '../img/4.jpg'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'

import './partie1.css'
import Users from './users'

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },
}))

export default function partie1(props) {
    const { onclick2 } = props

    const [searchUser, setsearchUser] = useState('')
    const dispatch = useDispatch()
    const user = useSelector((state) => state.AuthReducer.user)
    const friends = useSelector((state) => state.AuthReducer.friends)

    const users = {
        utilisateurs: [
            {
                id: 1,
                prenom: 'Naim',
                nom: 'Bessaha',
                avatar: img4,
                user_type: 'Etudiant(e)',
            },
            {
                id: 2,
                prenom: 'Malik',
                nom: 'Si-Mohamed',
                avatar: img3,
                user_type: 'Professeur',
            },
            {
                id: 3,
                prenom: 'Franck',
                nom: 'Lampard',
                avatar: img2,
                user_type: 'Etudiant(e)',
            },
            {
                id: 4,
                prenom: 'Naim',
                nom: 'Bessaha',
                avatar: img4,
                user_type: 'Etudiant(e)',
            },
            {
                id: 5,
                prenom: 'Malik',
                nom: 'Si-Mohamed',
                avatar: img3,
                user_type: 'Professeur',
            },
            {
                id: 6,
                prenom: 'Franck',
                nom: 'Lampard',
                avatar: img2,
                user_type: 'Etudiant(e)',
            },
            {
                id: 7,
                prenom: 'Naim',
                nom: 'Bessaha',
                avatar: img4,
                user_type: 'Etudiant(e)',
            },
            {
                id: 8,
                prenom: 'Malik',
                nom: 'Si-Mohamed',
                avatar: img3,
                user_type: 'Professeur',
            },
            {
                id: 9,
                prenom: 'Franck',
                nom: 'Lampard',
                avatar: img2,
                user_type: 'Etudiant(e)',
            },
        ],
    }

    const classes = useStyles()
    const lent = friends.length

    return (
        <Grid container xs={3} style={{ height: '89vh', borderRight: '1px solid rgb(202, 202, 202)' }}>
            <Grid container className='' xs={12} style={{ height: '23%', borderBottom: '1px solid rgb(202, 202, 202)', borderRadius: '10px' }}>
                <Grid container xs={12}>
                    <Grid className='myAvatar bg-gradient-to-r from-white to-blue-600'>
                        <Avatar alt={user.prenom} src={user.avatar} className={classes.large} />
                        <h1>Ma Messagerie</h1>
                    </Grid>
                    <Grid xs={12} className='form1'>
                        <input
                            className='usersInput outline-none focus:outline-none'
                            placeholder='Recherche Contacts...'
                            onChange={(event) => {
                                setsearchUser(event.target.value)
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid xs={12} className='over' style={{ height: '77%' }}>
                {lent != 0 ? (
                    friends
                        .filter((user) => {
                            const rech = user.nom + ' ' + user.prenom + ' ' + user.nom
                            const rech2 = user.nom + user.prenom
                            const rech3 = user.prenom + user.nom

                            if (searchUser === '') {
                                return user
                            } else if (
                                rech.toLowerCase().includes(searchUser.toLowerCase()) ||
                                rech2.toLowerCase().includes(searchUser.toLowerCase()) ||
                                rech3.toLowerCase().includes(searchUser.toLowerCase())
                            ) {
                                return user
                            }
                        })
                        .map((user) => <Users user={user} onclick={onclick2} />)
                ) : (
                    <h1 style={{ textAlign: 'center' }}>Aucun ami disponible</h1>
                )}
            </Grid>
        </Grid>
    )
}
