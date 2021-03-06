import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { useSelector, useDispatch } from 'react-redux'
import Axios from 'axios'
import { constants } from '../../constants'
import { SetProfileClasses } from '../../store/profile/profile'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar'
import { useHistory } from 'react-router-dom'
import { filter } from 'lodash'
import { HiOutlineTrash } from 'react-icons/hi'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { BiTimeFive } from 'react-icons/bi'
import { RiCloseFill } from 'react-icons/ri'
import Backdrop from '@material-ui/core/Backdrop'
import Button from '@material-ui/core/Button'
import { find } from 'lodash'
import { Container } from '@material-ui/core'
import Loader from 'react-loader-spinner'
import { SetAlert } from '../../store/alert/alert'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
}))

export default function Freinds() {
    const history = useHistory()
    const dispatch = useDispatch()
    const classes = useStyles()
    const user = useSelector((state) => state.AuthReducer.user)
    const user_info = useSelector((state) => state.ProfileReducer.user_info)
    const profile_classes = useSelector((state) => state.ProfileReducer.classes)

    const [user_classes, setProfileClasses] = useState([])
    const [loader, setLoader] = useState(false)

    const [refresh, setRefresh] = useState(0)

    const reload = () => {
        setRefresh(refresh + 1)
    }

    const [newClasse, setNewClasse] = useState('')
    const [classBackdrop, setClassBackdrop] = useState(false)
    const [filterWord, updateFilter] = useState('')

    useEffect(() => {
        setLoader(true)
        if (user.id && user_info.id_user) {
            if (user.user_type === 'etudiant') {
                Axios.post(constants.url + '/api/classe/get/classe/etu/adh/', {
                    id: user.id,
                    id_ens: user_info.id_user,
                })
                    .then((res) => {
                        setProfileClasses(res.data)
                        setLoader(false)
                    })
                    .catch((err) => {
                        setProfileClasses([])
                        setLoader(false)
                    })
            } else {
                setLoader(false)
            }
        }
    }, [refresh, user.id, user_info.id_user])

    useEffect(async () => {
        if (user.id && user_info.id_user) {
            if (user_info.user_type === 'etudiant') {
                if (user_info.id_user === user.id) {
                    Axios.get(constants.url + '/api/classe/get/classe/etu/' + user_info.id_user)
                        .then((res) => {
                            dispatch(SetProfileClasses(res.data))
                        })
                        .catch((err) => {
                            dispatch(SetProfileClasses([]))
                        })
                } else {
                    const res = await Axios.post(constants.url + '/api/amis/isFriend/', {
                        id_user: user.id,
                        id_friend: user_info.id_user,
                    })

                    if (res.data.friend) {
                        Axios.get(constants.url + '/api/classe/get/classe/etu/' + user_info.id_user)
                            .then((res) => {
                                dispatch(SetProfileClasses(res.data))
                            })
                            .catch((err) => {
                                dispatch(SetProfileClasses([]))
                            })
                    } else {
                        dispatch(SetProfileClasses([]))
                    }
                }
            } else {
                Axios.get(constants.url + '/api/classe/get/classe/' + user_info.id_user)
                    .then((res) => {
                        dispatch(SetProfileClasses(res.data))
                    })
                    .catch((err) => {
                        dispatch(SetProfileClasses([]))
                    })
            }
        }
    }, [user_info.id_user, user.id, refresh])

    const handleAddClass = () => {
        if (
            newClasse.toLowerCase() !== 'collegue' &&
            newClasse.toLowerCase() !== 'collégue' &&
            newClasse.toLowerCase() !== 'collegues' &&
            newClasse.toLowerCase() !== 'collégues' &&
            constants.alphanum_rg.test(newClasse) &&
            newClasse.length > 1
        ) {
            if (find(profile_classes, { libelle_classe: newClasse }) === undefined) {
                setLoader(true)
                if (user_info.id_user === user.id) {
                    Axios.post(constants.url + '/api/classe/add/classe', {
                        id_ens: user.id,
                        libelle_classe: newClasse,
                    })
                        .then((res) => {
                            SetAlert('success', 'Information', "l'ajout de la classe réalisé avec succés.", dispatch)
                            setNewClasse('')
                            setLoader(false)
                            reload()
                        })
                        .catch((err) => {
                            SetAlert(
                                'error',
                                'Erreur',
                                "Une erreur s'est produite, l'ajout n'a pas eu lieu vérifiez l'état de votre connexion sinon réessayer plus tard.",
                                dispatch
                            )
                            setLoader(false)
                        })
                }
            }
        } else {
            SetAlert(
                'warning',
                'Attention',
                'Veuillez entrer un nom de classe valide. Vous pouvez créer des classes uniquement en combinaison des léttres ou des chiffres.',
                dispatch
            )
        }
    }

    const deleteClasse = (id) => {
        setLoader(true)
        if (user_info.id_user === user.id) {
            Axios.delete(constants.url + '/api/classe/delete/classe/' + id)
                .then((res) => {
                    SetAlert('info', 'Information', 'la suppression de la classe réalisé avec succés.', dispatch)
                    setLoader(false)
                    reload()
                })
                .catch((err) => {
                    SetAlert('error', 'Erreur', "Une erreur s'est produite, la suppression n'a pas eu lieu vérifiez l'état de votre connexion sinon réessayer plus tard.", dispatch)
                    setLoader(false)
                })
        }
    }

    const JoinClass = (id_classe) => {
        setLoader(true)
        if (user.user_type === 'etudiant') {
            Axios.post(constants.url + '/api/adherent/add/adherent/', {
                id_classe: id_classe,
                id_etu: user.id,
            })
                .then((res) => {
                    SetAlert('success', 'Information', "Demande d'adhésion a la classe réalisé avec succés.", dispatch)
                    setLoader(false)
                    reload()
                })
                .catch((err) => {
                    SetAlert(
                        'error',
                        'Erreur',
                        "Une erreur s'est produite, la demande d'adhésion n'a pas eu lieu vérifiez l'état de votre connexion sinon réessayer plus tard.",
                        dispatch
                    )
                    setLoader(false)
                })
        }
    }

    const QuitClass = (id_classe) => {
        setLoader(true)
        Axios.post(constants.url + '/api/adherent/delete/adherent/', {
            id_etu: user.id,
            id_classe,
        })
            .then((res) => {
                SetAlert('info', 'Information', 'Sortie de la classe réalisé avec succés.', dispatch)
                reload()
                setLoader(false)
            })
            .catch((err) => {
                SetAlert(
                    'error',
                    'Erreur',
                    "Une erreur s'est produite, la sortie de la classe n'a pas eu lieu vérifiez l'état de votre connexion sinon réessayer plus tard.",
                    dispatch
                )
                setLoader(false)
            })
    }

    return (
        <Container maxWidth='md'>
            <Backdrop open={loader} style={{ zIndex: 10 }}>
                <Loader type='Circles' color='#00BFFF' height={120} width={120} />
            </Backdrop>

            {user_info.user_type === 'etudiant' && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Container maxWidth='sm'>
                                    <Paper className={classes.paper}>
                                        <input
                                            type='text'
                                            required={true}
                                            onChange={(e) => updateFilter(e.target.value)}
                                            className='focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md mx-auto'
                                            placeholder='Rechercher parmis les classes.'
                                        />
                                    </Paper>
                                </Container>
                            </Grid>
                        </Grid>
                    </Grid>

                    {filter(profile_classes, (o) => {
                        let searchIn = o.libelle_classe
                        return searchIn.includes(filterWord)
                    }).map((elem) => {
                        return (
                            <Grid item lg={6} sm={12} md={6} xs={12}>
                                <div
                                    className='cursor-pointer'
                                    onClick={() => {
                                        history.push('/profile/' + elem.id_user)
                                    }}>
                                    <Card className={classes.root}>
                                        <CardHeader
                                            avatar={<Avatar src={elem.avatar} alt='Travis Howard' aria-label='recipe' className={classes.avatar} />}
                                            align='left'
                                            title={elem.nom.capitalize() + ' ' + elem.prenom.capitalize()}
                                            subheader={elem.libelle_classe}
                                        />
                                    </Card>
                                </div>
                            </Grid>
                        )
                    })}
                </Grid>
            )}
            {user_info.user_type === 'enseignant' && (
                <Grid container>
                    <Grid item xs={12}>
                        <Backdrop open={classBackdrop} style={{ zIndex: 11 }}>
                            <div className='w-full lg:w-5/6 xl:w-4/6 2xl:3/6 h-40 bg-gray-100'>
                                <div className='text-center mt-3'>
                                    <p className='text-gray-500 text-lg'>Ajouter une classe.</p>
                                </div>
                                <div className='mt-4'>
                                    <div>
                                        <input
                                            type='text'
                                            required={true}
                                            onChange={(e) => setNewClasse(e.target.value)}
                                            value={newClasse}
                                            className='block w-5/6 lg:w-4/6 xl:w-3/6 2xl:w-2/6 pl-7 pr-12 sm:text-sm border-gray-300 rounded-md mx-auto'
                                            placeholder='Nom de la classe'
                                        />
                                    </div>
                                    <div className='w-full flex justify-center mt-3'>
                                        <div className='mx-1'>
                                            <Button onClick={handleAddClass} variant='contained' color='primary'>
                                                Confirmer
                                            </Button>
                                        </div>
                                        <div className='mx-1'>
                                            <Button onClick={() => setClassBackdrop(false)} variant='contained' color='secondary'>
                                                Annuler
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Backdrop>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {user_info.id_user === user.id && (
                                    <div>
                                        <div className='inline mx-auto mr-2'>
                                            <IoMdAddCircleOutline
                                                onClick={() => setClassBackdrop(true)}
                                                className='mx-auto text-gray-600 duration-300 hover:text-green-500 cursor-pointer'
                                                size={40}
                                            />
                                        </div>
                                    </div>
                                )}
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Container maxWidth='sm'>
                                            <Paper className={classes.paper}>
                                                <input
                                                    type='text'
                                                    required={true}
                                                    onChange={(e) => updateFilter(e.target.value)}
                                                    className='focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md mx-auto'
                                                    placeholder='Rechercher parmis les classes.'
                                                />
                                            </Paper>
                                        </Container>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {filter(profile_classes, (o) => {
                                let searchIn = o.libelle_classe
                                return searchIn.includes(filterWord)
                            }).map((elem) => {
                                return (
                                    <Grid item lg={6} sm={12} md={6} xs={12} id={elem.id_classe}>
                                        <div
                                            className='cursor-pointer my-1'
                                            onClick={() => {
                                                history.push('/profile/' + elem.id_user)
                                            }}>
                                            <Card className={classes.root}>
                                                <div className='grid grid-cols-6'>
                                                    <div className='col-span-5'>
                                                        <CardHeader
                                                            avatar={<Avatar src={elem.avatar} alt='Travis Howard' aria-label='recipe' className={classes.avatar} />}
                                                            align='left'
                                                            title={elem.nom.capitalize() + ' ' + elem.prenom.capitalize()}
                                                            subheader={elem.libelle_classe}
                                                        />
                                                    </div>
                                                    {user_info.id_user === user.id && (
                                                        <div className='flex flex-row-reverse mr-2 mt-3 text-gray-500 duration-300 hover:text-red-500'>
                                                            <HiOutlineTrash
                                                                onClick={() => {
                                                                    deleteClasse(elem.id_classe)
                                                                }}
                                                                size={25}
                                                            />
                                                        </div>
                                                    )}
                                                    {user.user_type === 'etudiant' && (
                                                        <div>
                                                            {find(user_classes, { id_classe: elem.id_classe, confirm: true }) !== undefined && (
                                                                <div className='flex flex-row-reverse mr-2 mt-5 text-gray-500 duration-300 hover:text-red-500'>
                                                                    <RiCloseFill
                                                                        onClick={() => QuitClass(elem.id_classe)}
                                                                        className='mx-auto text-red-400 duration-300 hover:text-red-600 cursor-pointer'
                                                                        size={30}
                                                                    />
                                                                </div>
                                                            )}
                                                            {find(user_classes, { id_classe: elem.id_classe, confirm: false }) !== undefined && (
                                                                <div className='flex flex-row-reverse mr-2 mt-5 text-gray-500 duration-300 hover:text-red-500'>
                                                                    <BiTimeFive className='mx-auto text-yellow-500 cursor-pointer' size={30} />
                                                                </div>
                                                            )}
                                                            {find(user_classes, { id_classe: elem.id_classe }) === undefined && (
                                                                <div className='flex flex-row-reverse mr-2 mt-5 text-gray-500 duration-300 hover:text-red-500'>
                                                                    <IoMdAddCircleOutline
                                                                        onClick={() => JoinClass(elem.id_classe)}
                                                                        className='mx-auto text-gray-600 duration-300 hover:text-green-500 cursor-pointer'
                                                                        size={30}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        </div>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Container>
    )
}
