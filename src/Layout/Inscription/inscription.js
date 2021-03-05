import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { FaFacebookSquare } from 'react-icons/fa'
import { FaGooglePlusSquare } from 'react-icons/fa'
import { FaTwitterSquare } from 'react-icons/fa'

import { FaFeatherAlt } from 'react-icons/fa'

import firebase from 'firebase/app'

import { UpdateSignupUser, UpdateSignupStep } from '../../store/signup/signupReducer'

import { constants } from '../../constants'

const Inscription = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.SignUpReducer.user)
    const step = useSelector((state) => state.SignUpReducer.step)
    const NIVEAU_ENSEIGNEMENT = [
        {
            id: 0,
            libelle: 'Collége',
        },
        {
            id: 1,
            libelle: 'Lycée',
        },
        {
            id: 2,
            libelle: 'Université',
        },
    ]
    // const [step, UpdateSignupStep] = React.useState('auth')

    const handleAuth = () => {
        let valid_data = { valid: true, reason: null }

        if (!constants.email_rg.test(user.email)) valid_data = { valid: false, reason: 'email' }
        if (user.password !== user.confirmed_password) valid_data = { valid: false, reason: 'password_not_equal' }

        firebase
            .auth()
            .createUserWithEmailAndPassword(user.email, user.password)
            .then((userCredential) => {
                dispatch(UpdateSignupStep('whoyouare'))
            })
            .catch((err) => {
                console.log(err)
                dispatch(UpdateSignupStep('error'))
            })
    }

    return (
        <div className='w-full lg:w-5/6 h-screen mx-auto shadow rounded-xl'>
            <div className='grid grid-cols-1 md:grid-cols-2 h-full rounded-xl'>
                <div className='bg-feather bg-center bg-cover h-full hidden md:block rounded-xl'>
                    <div className='h-full bg-indigo-900 bg-opacity-80 rounded-xl select-none'>
                        <p
                            className='pt-14 text-6xl text-gray-100 text-center cursor-pointer'
                            onClick={() => {
                                history.push('/')
                            }}>
                            UNIVERLINE
                        </p>
                        <p className='pt-10 px-10 lg:px-30 2xl:px-60 text-xl text-gray-300 text-center'>Restez connecté avec vos collègues et vos camarades à tout instant.</p>
                        {step === 'auth' && (
                            <div>
                                <p className='pt-40 lg:pt-60 2xl:pt-96 px-10 lg:px-30 2xl:px-60 text-xl text-gray-300 text-center'>Vous possedez déja un compte ?</p>
                                <div className='mx-auto table mt-5'>
                                    <Button variant='contained' color='secondary'>
                                        Se connecter
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {step === 'auth' && (
                    <div className='bg-gray-50 h-full rounded-xl'>
                        <p className='text-gray-800 text-4xl text-center mt-6 2xl:mt-16 font-sans font-black'>Créer un compte.</p>
                        <div className='mt-5 2xl:mt-20 flex'>
                            <div className='mx-auto'>
                                <FaGooglePlusSquare
                                    onClick={() => {
                                        const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
                                        firebase
                                            .auth()
                                            .signInWithPopup(googleAuthProvider)
                                            .then((userCred) => {
                                                dispatch(
                                                    UpdateSignupUser({
                                                        ...user,
                                                        nom_complet: userCred.user.displayName,
                                                        email: userCred.user.email,
                                                    })
                                                )
                                                dispatch(UpdateSignupStep('whoyouare'))
                                            })
                                    }}
                                    className='inline mx-5 cursor-pointer duration-300 hover:text-green-700'
                                    size={60}
                                />
                                <FaFacebookSquare
                                    onClick={() => {
                                        const facebookAuthProvider = new firebase.auth.FacebookAuthProvider()
                                        firebase.auth().signInWithPopup(facebookAuthProvider)
                                    }}
                                    className='inline mx-5 cursor-pointer duration-300 hover:text-blue-700'
                                    size={60}
                                />
                                <FaTwitterSquare
                                    onClick={() => {
                                        const twitterAuthProvider = new firebase.auth.TwitterAuthProvider()
                                        firebase.auth().signInWithPopup(twitterAuthProvider)
                                    }}
                                    className='inline mx-5 cursor-pointer duration-300 hover:text-blue-400'
                                    size={60}
                                />
                            </div>
                        </div>
                        <div className='mt-10 2xl:mt-20 text-center'>
                            <div className='my-5'>
                                <TextField
                                    onChange={(e) => {
                                        dispatch(UpdateSignupUser({ ...user, nom_complet: e.target.value }))
                                    }}
                                    className='w-3/6 shadow'
                                    label='Nom complet'
                                    variant='outlined'
                                />
                            </div>
                            <div className='my-5'>
                                <TextField
                                    onChange={(e) => {
                                        dispatch(UpdateSignupUser({ ...user, email: e.target.value }))
                                    }}
                                    className='w-3/6 shadow'
                                    label='E-mail'
                                    variant='outlined'
                                />
                            </div>
                            <div className='my-5'>
                                <TextField
                                    onChange={(e) => {
                                        dispatch(UpdateSignupUser({ ...user, password: e.target.value }))
                                    }}
                                    className='w-3/6 shadow'
                                    label='Mot de passe'
                                    type='password'
                                    variant='outlined'
                                />
                            </div>
                            <div className='my-5'>
                                <TextField
                                    onChange={(e) => {
                                        dispatch(UpdateSignupUser({ ...user, confirmed_password: e.target.value }))
                                    }}
                                    className='w-3/6 shadow'
                                    label='Confirmer mot de passe'
                                    type='password'
                                    variant='outlined'
                                />
                            </div>
                        </div>
                        <div className='mx-auto table mt-10'>
                            <Button
                                onClick={() => {
                                    handleAuth()
                                }}
                                className='shadow'
                                variant='contained'
                                color='secondary'>
                                Suivant
                            </Button>
                        </div>
                    </div>
                )}
                {step === 'whoyouare' && (
                    <div className='bg-gray-50 h-full rounded-xl'>
                        <p className='text-gray-800 text-4xl text-center mt-16 font-sans font-black'>
                            Etes vous <span className='text-purple-800'>Enseignant</span> ou <span className='text-green-600'>Etudiant </span>?
                        </p>
                        <div className='mt-40 text-center h-40'>
                            <div className='mx-10 my-5 inline-block'>
                                <Button
                                    className='h-12 w-48 shadow'
                                    onClick={() => {
                                        dispatch(UpdateSignupStep('formEns'))
                                        dispatch(
                                            UpdateSignupUser({
                                                ...user,
                                                user_type: 'enseignant',
                                            })
                                        )
                                    }}
                                    variant='contained'
                                    color='secondary'>
                                    Enseignant
                                </Button>
                            </div>
                            <div className='mx-10 my-5 inline-block'>
                                <Button
                                    className='h-12 w-48 shadow'
                                    onClick={() => {
                                        dispatch(UpdateSignupStep('formEtu'))
                                        dispatch(
                                            UpdateSignupUser({
                                                ...user,
                                                user_type: 'etudiant',
                                            })
                                        )
                                    }}
                                    variant='contained'
                                    color='secondary'>
                                    Etudiant
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {step === 'formEns' && (
                    <div className='bg-gray-50 h-full rounded-xl'>
                        <p className='text-gray-800 text-4xl text-center mt-16 font-sans font-black'>
                            Bienvenue cher <span className='text-purple-800'>Enseignant</span>!
                        </p>
                        <div className='mt-32 text-center'>
                            <div className='my-5'>
                                <Autocomplete
                                    id='combo-box-demo'
                                    className='w-3/6 mx-auto shadow'
                                    options={NIVEAU_ENSEIGNEMENT}
                                    onChange={(e, v) => {
                                        dispatch(
                                            UpdateSignupUser({
                                                ...user,
                                                niveau_ens: v.libelle,
                                            })
                                        )
                                    }}
                                    getOptionLabel={(option) => option.libelle}
                                    renderInput={(params) => <TextField {...params} label="Niveau d'enseignement" variant='outlined' />}
                                />
                            </div>
                            <div className='my-5'>
                                <TextField
                                    onChange={(e) => {
                                        dispatch(
                                            UpdateSignupUser({
                                                ...user,
                                                domaine_enseignement: e.target.value,
                                            })
                                        )
                                    }}
                                    className='w-3/6 shadow'
                                    label="Domaine d'enseignement"
                                    variant='outlined'
                                />
                            </div>
                        </div>
                        <div className='mx-auto table mt-10'>
                            <div className='mx-5 inline-block'>
                                <Button
                                    onClick={() => {
                                        dispatch(UpdateSignupStep('whoyouare'))
                                    }}
                                    className='shadow'
                                    variant='contained'
                                    color='primary'>
                                    Précédent
                                </Button>
                            </div>
                            <div className='mx-5 inline-block'>
                                <Button
                                    onClick={() => {
                                        dispatch(UpdateSignupStep('ending'))
                                    }}
                                    className='shadow'
                                    variant='contained'
                                    color='secondary'>
                                    Finaliser
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {step === 'formEtu' && (
                    <div className='bg-gray-50 h-full rounded-xl'>
                        <p className='text-gray-800 text-4xl text-center mt-16 font-sans font-black'>
                            Bienvenue cher <span className='text-green-600'>Etudiant</span> !
                        </p>
                        <div className='mt-32 text-center'>
                            <div className='my-5'>
                                <TextField
                                    onChange={(e) => {
                                        dispatch(
                                            UpdateSignupUser({
                                                ...user,
                                                etablissement: e.target.value,
                                            })
                                        )
                                    }}
                                    className='w-3/6 shadow'
                                    label="Etablissement d'etude"
                                    variant='outlined'
                                />
                            </div>
                            <div className='my-5'>
                                <Autocomplete
                                    id='combo-box-demo'
                                    className='w-3/6 mx-auto shadow'
                                    onChange={(e, v) => {
                                        dispatch(
                                            UpdateSignupUser({
                                                ...user,
                                                niveau_educatif: v.libelle,
                                            })
                                        )
                                    }}
                                    options={NIVEAU_ENSEIGNEMENT}
                                    getOptionLabel={(option) => option.libelle}
                                    renderInput={(params) => <TextField {...params} label='Niveau educatif' variant='outlined' />}
                                />
                            </div>
                            <div className='my-5'>
                                <TextField
                                    onChange={(e) => {
                                        dispatch(
                                            UpdateSignupUser({
                                                ...user,
                                                domaine_educatif: e.target.value,
                                            })
                                        )
                                    }}
                                    className='w-3/6 shadow'
                                    label='Domaine educatif'
                                    variant='outlined'
                                />
                            </div>
                        </div>
                        <div className='mx-auto table mt-10'>
                            <div className='mx-5 inline-block'>
                                <Button
                                    onClick={() => {
                                        dispatch(UpdateSignupStep('whoyouare'))
                                    }}
                                    className='shadow'
                                    variant='contained'
                                    color='primary'>
                                    Précédent
                                </Button>
                            </div>
                            <div className='mx-5 inline-block'>
                                <Button
                                    onClick={() => {
                                        dispatch(UpdateSignupStep('ending'))
                                    }}
                                    className='shadow'
                                    variant='contained'
                                    color='secondary'>
                                    Finaliser
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {step === 'ending' && (
                    <div className='bg-gray-50 h-full rounded-xl'>
                        <p className='text-gray-800 text-4xl text-center mt-16 font-sans font-black'>
                            <div className='text-gray-900 flex justify-center'>
                                <FaFeatherAlt size={200} />
                            </div>
                            <div className='mt-12'>
                                <span className='text-purple-800'>Féliciation </span>votre compte a été créé avec succés.
                            </div>
                        </p>
                        <div className='mx-auto table mt-32 2xl:mt-60'>
                            <Button
                                onClick={() => {
                                    console.log('oulach')
                                }}
                                className='shadow'
                                variant='contained'
                                color='secondary'>
                                Se connecter
                            </Button>
                        </div>
                    </div>
                )}
                {step === 'error' && (
                    <div className='bg-gray-50 h-full rounded-xl'>
                        <p className='text-gray-800 text-4xl text-center mt-16 font-sans font-black'>
                            <div className='text-gray-900 flex justify-center'>
                                <FaFeatherAlt size={200} />
                            </div>
                            <div className='mt-12'>
                                <span className='text-red-800'>Oups </span>Un problème est survenu lors de la création de votre compte veuillez réssayer ultérieurment.
                            </div>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Inscription
