import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Axios from 'axios'
import { constants } from '../../constants'
import { SetPublications } from '../../store/profile/profile'
import { FaComments } from 'react-icons/fa'
import { HiShare } from 'react-icons/hi'
import Comments from '../Dashboard/Feed/comments'
import Options from '../Dashboard/Feed/options/options'
import Avatar from '@material-ui/core/Avatar'
import moment from 'moment'
import Backdrop from '@material-ui/core/Backdrop'
import firebase from 'firebase'
import { BsFileEarmarkCheck } from 'react-icons/bs'
import { BiSend } from 'react-icons/bi'
import Loader from 'react-loader-spinner'

export default function Publications() {
    const dispatch = useDispatch()
    const user_info = useSelector((state) => state.ProfileReducer.user_info)
    const publications = useSelector((state) => state.ProfileReducer.publications)
    const refresh = useSelector((state) => state.FeedReducer.refresh)
    const user = useSelector((state) => state.AuthReducer.user)

    const storageRef = firebase.storage().ref()

    useEffect(async () => {
        if (user_info.id_user && user.id) {
            if (user_info.user_type === 'etudiant') {
                const res = await Axios.post(constants.url + '/api/amis/isFriend/', {
                    id_user: user.id,
                    id_friend: user_info.id_user,
                })

                if (res.data.friend || user_info.id_user === user.id) {
                    Axios.get(constants.url + '/api/post/get/post/oneuser/' + user_info.id_user)
                        .then((res) => {
                            dispatch(SetPublications(res.data))
                        })
                        .catch((err) => {
                            dispatch(SetPublications([]))
                        })
                } else {
                    dispatch(SetPublications([]))
                }
            } else if (user_info.user_type === 'enseignant') {
                const res = await Axios.post(constants.url + '/api/collegue/isFriend/ens', {
                    id_user: user.id,
                    id_collegue: user_info.id_user,
                })

                if (res.data.friend || user_info.id_user === user.id) {
                    Axios.get(constants.url + '/api/post/get/post_collegue/' + user_info.id_user)
                        .then((res) => {
                            dispatch(SetPublications(res.data))
                        })
                        .catch((err) => {
                            dispatch(SetPublications([]))
                        })
                } else {
                    dispatch(SetPublications([]))
                }
            } else {
                dispatch(SetPublications([]))
            }
        }
    }, [user_info.id_user, user.id, refresh])

    const ProfSkeleton = ({ elem }) => {
        const [loadComment, setLoadComment] = useState(false)

        const [comments, setComments] = useState([])
        const [payload, setPayload] = useState('')
        const [refresh, setRefresh] = useState(0)
        const [backdrop, setBackdrop] = useState(false)

        const [image, setImage] = useState(null)
        const [file, setFile] = useState(null)

        const Reload = () => {
            setRefresh(refresh + 1)
        }

        useEffect(() => {
            if (elem.image) {
                storageRef
                    .child(elem.image)
                    .getDownloadURL()
                    .then((url) => setImage(url))
                    .catch((err) => {
                        console.log(err)
                    })
            }
            if (elem.file) {
                storageRef
                    .child(elem.file)
                    .getDownloadURL()
                    .then((url) => setFile(url))
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }, [])

        useEffect(() => {
            setBackdrop(true)
            if (loadComment) {
                Axios(constants.url + '/api/commentaire/get/comments/' + elem.id_poste)
                    .then((res) => {
                        setComments(res.data)
                        setBackdrop(false)
                    })
                    .catch((err) => {
                        setComments([])
                        setBackdrop(false)
                    })
            } else {
                setBackdrop(false)
            }
        }, [loadComment, refresh])

        const handleComment = (e) => {
            e.preventDefault()
            Axios.post(constants.url + '/api/commentaire/add/comments/', {
                id_user: user.id,
                id_poste: elem.id_poste,
                payload,
            })
                .then((res) => {
                    Reload()
                    setBackdrop(false)
                    setPayload('')
                })
                .catch((err) => {
                    setBackdrop(false)
                    console.log(err)
                })
        }

        return (
            <div key={elem.id_poste} className='w-120 2xl:w-144 h-auto bg-gray-100 shadow-2xl mx-auto rounded-lg mb-20'>
                <div className='h-1/4 bg-gradient-to-r from-purple-500 to-purple-700 shadow-xl rounded-xl'>
                    <div className='grid grid-cols-5'>
                        <div className='mx-auto my-3 border-2 border-gray-100 rounded-full shadow-xl'>
                            <Avatar alt='Remy Sharp' src={elem.avatar} style={{ width: '2.5rem', height: '2.5rem' }} />
                        </div>
                        <div className='col-span-4 flex'>
                            <div className='mt-3'>
                                <p className='text-gray-200 text-sm'>{elem.nom.capitalize() + ' ' + elem.prenom.capitalize()}</p>
                                <p className='text-gray-100 text-sm'>Enseignant</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='h-auto'>
                    <div className='h-auto'>
                        <div className='mt-2 text-center'>
                            <p className='text-gray-500 text-sm'>{moment(elem.date_poste).format('DD - MM - YYYY HH:mm') + ' h'}</p>
                            <p className='text-gray-500 text-sm'>{elem.libelle_classe || 'Collégues'}</p>
                        </div>
                        <div className='mt-10 mb-10 px-10 text-left'>
                            <p className='text-gray-600 text-base break-words w-96'>{elem.payload}</p>
                            {image && (
                                <div className='my-2'>
                                    <img className='w-62 h-62 mx-auto' src={image} />
                                </div>
                            )}
                            {file && (
                                <div className='mb-2 mt-4'>
                                    <div className='ml-2 my-1 text-center'>
                                        <a href={file} target='_blank' download>
                                            <BsFileEarmarkCheck size={30} className='text-gray-800 inline cursor-pointer duration-300 hover:text-green-500' />
                                            <p className='text-gray-500 inline ml-3'>.{file.split('?alt')[0].split('.')[5]}</p>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='text-gray-600 border-t-2 border-gray-400'>
                        <div className='mt-4 flex justify-start h-10'>
                            <div
                                onClick={() => {
                                    setLoadComment(!loadComment)
                                }}
                                className='inline-block mx-4 cursor-pointer duration-300 hover:text-purple-600'>
                                <FaComments className='inline' />
                                <p className='text-gray-500 text-sm inline ml-3 duration-300 hover:text-purple-600'>Commenter</p>
                            </div>
                            <div className='inline-block mx-4 cursor-pointer duration-300 hover:text-purple-600'>
                                <HiShare className='inline' />
                                <p className='text-gray-500 text-sm inline ml-3 duration-300 hover:text-purple-600'>Partager</p>
                            </div>
                        </div>
                    </div>
                    {loadComment && (
                        <div className=' bg-gray-100 shadow rounded'>
                            <form className='w-full flex flex-row mx-auto' onSubmit={handleComment}>
                                <input
                                    type='text'
                                    required={true}
                                    onChange={(e) => setPayload(e.target.value)}
                                    value={payload}
                                    className='block w-full lg:w-2/3 2xl:w-1/2  sm:text-sm border-gray-300 rounded-md ml-5'
                                    placeholder='Ecrivez un commentaire !'
                                />
                                <button type='submit' className='focus:outline-none rounded-full w-9 h-9 hover:bg-purple-100 duration-300 '>
                                    <BiSend size={25} className='text-purple-400 mx-auto' />
                                </button>
                            </form>
                            <div className='h-auto mx-auto mt-2 border-2 border-gray-200 shadow rounded' style={{ width: '95%' }}>
                                <Backdrop open={backdrop} style={{ display: 'contents' }}>
                                    {backdrop && (
                                        <div className='h-32 flex justify-center'>
                                            <div className='mt-10'>
                                                <Loader type='Circles' color='#00BFFF' height={50} width={50} />
                                            </div>
                                        </div>
                                    )}
                                </Backdrop>
                                <div className='w-full h-auto'>
                                    {comments.map((elem) => {
                                        return <Comments elem={elem} Reload={Reload} />
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const StudSkeleton = ({ elem }) => {
        const [loadComment, setLoadComment] = useState(false)
        const [comments, setComments] = useState([])
        const [payload, setPayload] = useState('')
        const [refresh, setRefresh] = useState(0)
        const [backdrop, setBackdrop] = useState(false)
        const user = useSelector((state) => state.AuthReducer.user)

        const [image, setImage] = useState(null)
        const [file, setFile] = useState(null)

        const Reload = () => {
            setRefresh(refresh + 1)
        }

        useEffect(() => {
            if (elem.image) {
                storageRef
                    .child(elem.image)
                    .getDownloadURL()
                    .then((url) => setImage(url))
                    .catch((err) => {
                        console.log(err)
                    })
            }
            if (elem.file) {
                storageRef
                    .child(elem.file)
                    .getDownloadURL()
                    .then((url) => setFile(url))
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }, [])

        useEffect(() => {
            setBackdrop(true)
            if (loadComment) {
                Axios(constants.url + '/api/commentaire/get/comments/' + elem.id_poste)
                    .then((res) => {
                        setBackdrop(false)
                        setComments(res.data)
                    })
                    .catch((err) => {
                        setBackdrop(true)
                        setComments([])
                    })
            }
        }, [loadComment, refresh])

        const handleComment = (e) => {
            e.preventDefault()
            setBackdrop(true)
            Axios.post(constants.url + '/api/commentaire/add/comments/', {
                id_user: user.id,
                id_poste: elem.id_poste,
                payload,
            })
                .then((res) => {
                    Reload()
                    setBackdrop(false)
                    setPayload('')
                })
                .catch((err) => {
                    console.log(err)
                    setBackdrop(false)
                })
        }

        return (
            <div key={elem.id_poste} className='w-100 2xl:w-144 h-auto bg-gray-100 shadow-2xl mx-auto rounded-lg mb-20'>
                <div
                    className='h-1/4 shadow-xl rounded-xl cursor-pointer
                        bg-gradient-to-r from-green-600 to-green-400'>
                    <div className='grid grid-cols-5'>
                        <div className='mx-auto my-3 border-2 border-gray-100 rounded-full shadow-xl'>
                            <Avatar alt='Remy Sharp' src={elem.avatar} style={{ width: '2.5rem', height: '2.5rem' }} />
                        </div>
                        <div className='col-span-3 flex'>
                            <div className='mt-3'>
                                <p className='text-gray-200 text-sm'>{elem.nom.capitalize() + ' ' + elem.prenom.capitalize()}</p>
                                <p className='text-gray-100 text-sm'>Etudiant</p>
                            </div>
                        </div>
                        {elem.id_user === user.id && (
                            <div className='flex flex-row-reverse'>
                                <div className='mt-5 mr-4'>
                                    <Options elem={elem} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='h-auto'>
                    <div className='h-auto'>
                        <div className='mt-2 text-center'>
                            <p className='text-gray-500 text-sm'>{moment(elem.date_poste).format('DD - MM - YYYY HH:mm') + ' h'}</p>
                        </div>
                        <div className='mt-10 mb-10 px-10 text-left'>
                            <p className='text-gray-600 text-base break-words w-96'>{elem.payload}</p>
                            {image && (
                                <div className='my-2'>
                                    <img className='w-62 h-62 mx-auto' src={image} />
                                </div>
                            )}
                            {file && (
                                <div className='mb-2 mt-4'>
                                    <div className='ml-2 my-1 text-center'>
                                        <a href={file} target='_blank' download>
                                            <BsFileEarmarkCheck size={30} className='text-gray-800 inline cursor-pointer duration-300 hover:text-green-500' />
                                            <p className='text-gray-500 inline ml-3'>.{file.split('?alt')[0].split('.')[5]}</p>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='text-gray-600 border-t-2 border-gray-400'>
                        <div className='mt-4 flex justify-start h-10'>
                            <div onClick={() => setLoadComment(!loadComment)} className='inline-block mx-4 cursor-pointer duration-300 hover:text-green-600'>
                                <FaComments className='inline' />
                                <p className='text-gray-500 text-sm inline ml-3 duration-300 hover:text-green-600'>Commenter</p>
                            </div>
                            <div className='inline-block mx-4 cursor-pointer duration-300 hover:text-green-600'>
                                <HiShare className='inline' />
                                <p className='text-gray-500 text-sm inline ml-3 duration-300 hover:text-green-600'>Partager</p>
                            </div>
                        </div>
                    </div>
                    {loadComment && (
                        <div className=' bg-gray-100 shadow rounded'>
                            <form className='w-full flex flex-row mx-auto' onSubmit={handleComment}>
                                <input
                                    type='text'
                                    required={true}
                                    onChange={(e) => setPayload(e.target.value)}
                                    value={payload}
                                    className='block w-full lg:w-2/3 2xl:w-1/2  sm:text-sm border-gray-300 rounded-md ml-5'
                                    placeholder='Ecrivez un commentaire !'
                                />
                                <button type='submit' className=' focus:outline-none rounded-full w-9 h-9 hover:bg-green-100 duration-300 '>
                                    <BiSend size={25} className='text-green-400 mx-auto' />
                                </button>
                            </form>
                            <div className='h-auto mx-auto mt-2 border-2 border-gray-200 shadow rounded' style={{ width: '95%' }}>
                                <Backdrop open={backdrop} style={{ display: 'contents' }}>
                                    {backdrop && (
                                        <div className='h-32 flex justify-center'>
                                            <div className='mt-10'>
                                                <Loader type='Circles' color='#00BFFF' height={50} width={50} />
                                            </div>
                                        </div>
                                    )}
                                </Backdrop>
                                <div className='w-full h-auto'>
                                    {comments.map((elem) => {
                                        return <Comments elem={elem} Reload={Reload} />
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
            <div>
                {user_info.user_type === 'etudiant' &&
                    publications.map((elem, index) => {
                        if (index % 2 === 0) {
                            return <StudSkeleton key={elem.id_poste} elem={elem} />
                        }
                    })}
                {user_info.user_type === 'enseignant' &&
                    publications.map((elem, index) => {
                        if (index % 2 === 0) {
                            return <ProfSkeleton key={elem.id_poste} elem={elem} />
                        }
                    })}
            </div>
            <div>
                {user_info.user_type === 'etudiant' &&
                    publications.map((elem, index) => {
                        if (index % 2 === 1) {
                            return <StudSkeleton key={elem.id_poste} elem={elem} />
                        }
                    })}
                {user_info.user_type === 'enseignant' &&
                    publications.map((elem, index) => {
                        if (index % 2 === 1) {
                            return <ProfSkeleton key={elem.id_poste} elem={elem} />
                        }
                    })}
            </div>
        </div>
    )
}
