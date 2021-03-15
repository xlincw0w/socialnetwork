import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import { useSelector, useDispatch } from 'react-redux'
import { constants } from '../../constants'
import Axios from 'axios'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { SetLoader } from '../../store/profile/profile'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },

    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
}))

const PendingUser = ({ elem, RefreshPending }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const user = useSelector((state) => state.AuthReducer.user)

    const handleAdd = () => {
        dispatch(SetLoader(true))
        Axios.all([
            Axios.post(constants.url + '/api/amis/confirm/amis', {
                id_user: user.id,
                id_friend: elem.id_user,
            }),

            Axios.post(constants.url + '/api/amis/confirm/amis', {
                id_user: elem.id_user,
                id_friend: user.id,
            }),
        ])
            .then(
                Axios.spread((...res) => {
                    console.log(res)
                    RefreshPending()
                    dispatch(SetLoader(false))
                })
            )
            .catch((err) => {
                RefreshPending()
                dispatch(SetLoader(false))
            })
    }

    const handleRemove = () => {
        dispatch(SetLoader(true))
        Axios.all([
            Axios.post(constants.url + '/api/amis/delete/amis', {
                id_user: user.id,
                id_ami: elem.id_user,
            }),

            Axios.post(constants.url + '/api/amis/delete/amis', {
                id_user: elem.id_user,
                id_ami: user.id,
            }),
        ])
            .then(
                Axios.spread((...res) => {
                    console.log(res)
                    RefreshPending()
                    dispatch(SetLoader(false))
                })
            )
            .catch((err) => {
                console.log(err)
                RefreshPending()
                dispatch(SetLoader(false))
            })
    }

    return (
        <div id={elem.id_user} className='grid grid-rows grid-flow-col gap-2 shadow-xl w-2/3 mx-auto mt-8'>
            <div className='border-2 rounded-xl bg-white shadow-xl'>
                <div className=' grid grid-cols-2 gap-2 place-items-end'>
                    <div className='w-24 place-self-start mt-2 ml-3'>
                        <div className={classes.root}>
                            <Avatar alt='Remy Sharp' src={elem.avatar} className={classes.large} />
                            <div className=''>
                                <p
                                    className='mt-2'
                                    style={{
                                        width: 'max-content',
                                    }}>
                                    {elem.nom.capitalize() + ' ' + elem.prenom.capitalize()}
                                </p>
                                <p className='text-center text-gray-400 text-sm'>{elem.domaine_edu.capitalize()}</p>
                                <p className='text-gray-400 text-sm text-center'>{elem.etablissement.capitalize()}</p>
                            </div>
                        </div>
                    </div>

                    <div className='mr-1 mb-3'>
                        <button onClick={handleAdd} className='bg-blue-500 w-32 mb-1 shadow-lg rounded-xl p-2 active:bg-blue-700 text-white focus:outline-none block'>
                            Accepter
                        </button>
                        <button onClick={handleRemove} className='bg-gray-200 w-32 mt-1 shadow-lg rounded-xl p-2 active:bg-green-400 focus:outline-none block'>
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PendingList = () => {
    const [pending, setPending] = useState([])
    const user = useSelector((state) => state.AuthReducer.user)
    const loader = useSelector((state) => state.ProfileReducer.loader)

    const [reset, setReset] = useState(0)

    const RefreshPending = () => {
        setReset(reset + 1)
    }

    useEffect(() => {
        Axios.get(constants.url + '/api/amis/get/pending/' + user.id)
            .then((res) => {
                setPending(res.data)
            })
            .catch((err) => {
                setPending([])
                console.log(err)
            })
    }, [user.id, reset])

    return (
        <div>
            <div className='bg-gradient-to-r from-green-400 to-purple-700' style={{ minHeight: '100vh', height: 'auto' }}>
                <Backdrop open={loader} style={{ zIndex: 10 }}>
                    <CircularProgress color='inherit' />
                </Backdrop>
                <div className='w-full h-full bg-gray-200 bg-opacity-60' style={{ minHeight: '100vh', height: 'auto' }}>
                    <div className='container bg-gray-100 mx-auto px-34 shadow-2xl border-2 w-3/6' style={{ minHeight: '90vh', height: 'auto' }}>
                        <div>
                            <p className='text-center text-gray-900 text-2xl mt-3'>Demandes d'ajout</p>
                            <p className='text-center text-gray-500'>Confirmez les personnes que vous connaissez ou supprimez les invitations.</p>
                            <hr />
                        </div>
                        {pending.map((elem) => {
                            return <PendingUser elem={elem} RefreshPending={RefreshPending} />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PendingList
