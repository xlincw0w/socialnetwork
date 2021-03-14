import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { HiStatusOnline } from 'react-icons/hi'
import { SetFriends } from '../../store/auth/auth'
import Online from './Online/online'
import Axios from 'axios'
import { constants } from '../../constants'

export default function Feature2() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.AuthReducer.user)
    const friends = useSelector((state) => state.AuthReducer.friends)

    useEffect(() => {
        if (user.user_type === 'etudiant') {
            Axios.get(constants.url + '/api/amis/get/amis/' + user.id)
                .then((res) => {
                    console.log(res.data)
                    dispatch(SetFriends(res.data))
                })
                .catch((err) => {
                    dispatch(SetFriends([]))
                })
        }
    }, [user.id])

    return (
        <div className='bg-gray-50 h-4/6 w-5/6 mx-1 mt-5 shadow-2xl overflow-y-scroll'>
            <div className='text-gray-700 text-base'>
                <div className='inline-block ml-4 mt-4'>
                    <HiStatusOnline className='inline-block' size={25} />
                    <p className='inline ml-3'>En ligne</p>
                </div>
            </div>
            <div className='border-b-2 mt-3 border-green-400 w-48'></div>
            <div className='mt-5 ml-5'>
                {user.user_type === 'etudiant' &&
                    friends.map((elem) => {
                        return <Online id={elem.id_user} nom={elem.nom} prenom={elem.prenom} avatar={elem.avatar} user_type={elem.user_type} />
                    })}
            </div>
        </div>
    )
}
