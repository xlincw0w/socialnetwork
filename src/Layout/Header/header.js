import React from 'react'
import { useHistory } from 'react-router-dom'
import firebase from 'firebase/app'
import { FirebaseAuthProvider, FirebaseAuthConsumer, IfFirebaseAuthed, IfFirebaseAuthedAnd } from '@react-firebase/auth'

export default function Header() {
    const history = useHistory()
    return (
        <FirebaseAuthConsumer>
            {({ isSignedIn, user, providerId }) => {
                if (isSignedIn) {
                    return (
                        <div className='w-screen h-16 bg-gray-50 shadow-lg select-none'>
                            <div className='grid grid-cols-4 h-full'>
                                <div className='flex'>
                                    <p
                                        onClick={() => {
                                            history.push('/')
                                        }}
                                        className='text-lg text-gray-700 my-auto ml-5 cursor-pointer'>
                                        Reseau Social
                                    </p>
                                </div>
                                <div className=''>
                                    <p></p>
                                </div>
                                <div className=''>
                                    <p></p>
                                </div>
                                <div className='flex flex-row-reverse'>
                                    <p
                                        onClick={() => {
                                            firebase
                                                .auth()
                                                .signOut()
                                                .then(() => {
                                                    history.push('/')
                                                })
                                                .catch((error) => {
                                                    history.push('/')
                                                })
                                        }}
                                        className='text-md text-gray-500 my-auto mr-8 cursor-pointer'>
                                        Se déconnecter
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div className='w-screen h-16 bg-gray-50 shadow-lg select-none'>
                            <div className='grid grid-cols-4 h-full'>
                                <div className='flex'>
                                    <p
                                        onClick={() => {
                                            history.push('/')
                                        }}
                                        className='text-lg text-gray-700 my-auto ml-5 cursor-pointer'>
                                        Reseau Social
                                    </p>
                                </div>
                                <div className=''>
                                    <p></p>
                                </div>
                                <div className=''>
                                    <p></p>
                                </div>
                                <div className='flex flex-row-reverse'>
                                    <p
                                        onClick={() => {
                                            history.push('/auth')
                                        }}
                                        className='text-md text-gray-500 my-auto mr-8 cursor-pointer'>
                                        Se connecter
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }
            }}
        </FirebaseAuthConsumer>
    )
}
