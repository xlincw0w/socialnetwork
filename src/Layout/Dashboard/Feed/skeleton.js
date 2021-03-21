import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import { HiShare } from 'react-icons/hi'
import { FaComments } from 'react-icons/fa'
import Comments from './comments'
import Axios from 'axios'
import { useHistory } from 'react-router-dom'
import { constants } from '../../../constants'
import { SetFeed, SetFeedProf } from '../../../store/feed/feed'
import moment from 'moment'
import cx from 'classnames'
import Options from './options/options'
import Button from '@material-ui/core/Button'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import firebase from 'firebase'
import { BsFileEarmarkCheck } from 'react-icons/bs'

const Skeleton = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.AuthReducer.user)
    const feed_friends = useSelector((state) => state.FeedReducer.feed_friends)
    const feed_prof = useSelector((state) => state.FeedReducer.feed_prof)
    const refresh = useSelector((state) => state.FeedReducer.refresh)

    const storageRef = firebase.storage().ref()

    useEffect(() => {
        if (user.user_type === 'etudiant') {
            Axios.get(constants.url + '/api/post/get/post/' + user.id)
                .then((res) => {
                    dispatch(SetFeed(res.data))
                })
                .catch((err) => {
                    dispatch(SetFeed([]))
                })
            Axios.get(constants.url + '/api/post/get/post_ens/' + user.id)
                .then((res) => {
                    dispatch(SetFeedProf(res.data))
                })
                .catch((err) => {
                    dispatch(SetFeedProf([]))
                })
        } else if (user.user_type === 'enseignant') {
            Axios.get(constants.url + '/api/post/get/post_ens/allfriends/' + user.id)
                .then((res) => {
                    dispatch(SetFeedProf(res.data))
                })
                .catch((err) => {
                    dispatch(SetFeedProf([]))
                })
        }
    }, [user.id, refresh])

    const ProfSkeleton = ({ elem }) => {
        const history = useHistory()
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
                        setBackdrop(false)
                        setComments(res.data)
                    })
                    .catch((err) => {
                        setBackdrop(false)
                        setComments([])
                    })
            } else {
                setBackdrop(false)
                setComments([])
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
                })
                .catch((err) => {
                    console.log(err)
                    setBackdrop(false)
                })
        }

        return (
            <div id={elem.id_poste} className='w-120 2xl:w-144 h-auto bg-gray-100 shadow-2xl mx-auto rounded-lg mb-20 table'>
                <div
                    className={cx('h-1/4 shadow-xl rounded-xl', {
                        'bg-gradient-to-r from-gray-500 to-gray-800': elem.id_user === user.id,
                        'bg-gradient-to-r from-purple-400 to-purple-600': elem.id_user !== user.id,
                    })}>
                    <div className='grid grid-cols-5'>
                        <div onClick={() => history.push('/profile/' + elem.id_user)} className='mx-auto my-3 border-2 border-gray-100 rounded-full shadow-xl cursor-pointer'>
                            <Avatar alt='Remy Sharp' src={elem.avatar} style={{ width: '2.5rem', height: '2.5rem' }} />
                        </div>
                        <div className='col-span-3 flex'>
                            <div className='mt-3'>
                                <p className='text-gray-200 text-sm'>{elem.nom.capitalize() + ' ' + elem.prenom.capitalize()}</p>
                                <p className='text-gray-100 text-sm'>Enseignant</p>
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
                            <p className='text-gray-500 text-sm'>{elem.libelle_classe || 'Collégues'}</p>
                        </div>
                        <div className='mt-10 mb-10 px-10 text-left'>
                            <p className='text-gray-600 text-base'>{elem.payload}</p>
                            {image && (
                                <div className='my-2'>
                                    <img className='w-62 h-62 mx-auto' src={image} />
                                </div>
                            )}
                            {file && (
                                <div className='mb-2 mt-4'>
                                    <div className='ml-2 my-1 text-center'>
                                        <a href={file} target='_blank' download>
                                            <BsFileEarmarkCheck size={30} className='text-gray-800 inline cursor-pointer duration-300 hover:text-red-500' />
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
                                className='inline-block mx-4 cursor-pointer'>
                                <FaComments className='inline' />
                                <p className='text-gray-500 text-sm inline ml-3'>Commenter</p>
                            </div>
                            <div className='inline-block mx-4 cursor-pointer'>
                                <HiShare className='inline' />
                                <p className='text-gray-500 text-sm inline ml-3'>Partager</p>
                            </div>
                        </div>
                    </div>
                    {loadComment && (
                        <div className='w-full h-auto bg-gray-100 shadow rounded'>
                            <form className='w-full' onSubmit={handleComment}>
                                <input
                                    type='text'
                                    required={true}
                                    onChange={(e) => setPayload(e.target.value)}
                                    className='focus:ring-indigo-500focus:border-indigo-500 block w-full lg:w-2/3 2xl:w-1/2 pl-7 pr-12 sm:text-sm border-gray-300 rounded-md mx-auto'
                                    placeholder='Ecrivez un commentaire !'
                                />
                                <button type='submit' className='hidden'></button>
                            </form>
                            <div className='h-auto mx-auto mt-2 border-2 border-gray-200 shadow rounded' style={{ width: '95%' }}>
                                <Backdrop open={backdrop} style={{ display: 'contents' }}>
                                    {backdrop && (
                                        <div className='h-32 flex justify-center'>
                                            <div className='mt-10'>
                                                <CircularProgress color='inherit' />
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
        const history = useHistory()
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
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        return (
            <div id={elem.id_poste} className='w-120 2xl:w-144 h-auto bg-gray-100 shadow-2xl mx-auto rounded-lg mb-20 table'>
                <div
                    className={cx('h-1/4 shadow-xl rounded-xl', {
                        'bg-gradient-to-r from-gray-500 to-gray-800': elem.id_user === user.id,
                        'bg-gradient-to-r from-green-600 to-green-400': elem.id_user !== user.id,
                    })}>
                    <div className='grid grid-cols-5'>
                        <div onClick={() => history.push('/profile/' + elem.id_user)} className='mx-auto my-3 border-2 border-gray-100 rounded-full shadow-xl cursor-pointer'>
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
                            <p className='text-gray-600 text-base'>{elem.payload}</p>
                            {image && (
                                <div className='my-2'>
                                    <img className='w-62 h-62 mx-auto' src={image} />
                                </div>
                            )}
                            {file && (
                                <div className='mb-2 mt-4'>
                                    <div className='ml-2 my-1 text-center'>
                                        <a href={file} target='_blank' download>
                                            <BsFileEarmarkCheck size={30} className='text-gray-800 inline cursor-pointer duration-300 hover:text-red-500' />
                                            <p className='text-gray-500 inline ml-3'>.{file.split('?alt')[0].split('.')[5]}</p>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='text-gray-600 border-t-2 border-gray-400'>
                        <div className='mt-4 flex justify-start h-10'>
                            <div onClick={() => setLoadComment(!loadComment)} className='inline-block mx-4 cursor-pointer'>
                                <FaComments className='inline' />
                                <p className='text-gray-500 text-sm inline ml-3'>Commenter</p>
                            </div>
                            <div className='inline-block mx-4 cursor-pointer'>
                                <HiShare className='inline' />
                                <p className='text-gray-500 text-sm inline ml-3'>Partager</p>
                            </div>
                        </div>
                    </div>
                    {loadComment && (
                        <div className='w-full h-auto bg-gray-100 shadow rounded'>
                            <form className='w-full' onSubmit={handleComment}>
                                <input
                                    type='text'
                                    required={true}
                                    onChange={(e) => setPayload(e.target.value)}
                                    className='focus:ring-indigo-500focus:border-indigo-500 block w-full lg:w-2/3 2xl:w-1/2 pl-7 pr-12 sm:text-sm border-gray-300 rounded-md mx-auto'
                                    placeholder='Ecrivez un commentaire !'
                                />
                                <button type='submit' className='hidden'></button>
                            </form>
                            <div className='h-auto mx-auto mt-2 border-2 border-gray-200 shadow rounded' style={{ width: '95%' }}>
                                <Backdrop open={backdrop} style={{ display: 'contents' }}>
                                    {backdrop && (
                                        <div className='h-32 flex justify-center'>
                                            <div className='mt-10'>
                                                <CircularProgress color='inherit' />
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

    const [feed_mobile, setFeedMobile] = useState('all')

    return (
        <div className='pt-5'>
            <div className='block xl:hidden'>
                <div className='mb-4'>
                    <div className='mx-2 inline-block'>
                        <Button onClick={() => setFeedMobile('etudiant')} variant='outlined' color='primary'>
                            Etudiant
                        </Button>
                    </div>
                    <div className='mx-2 inline-block'>
                        <Button onClick={() => setFeedMobile('enseignant')} variant='outlined' color='secondary'>
                            Enseignant
                        </Button>
                    </div>
                </div>
            </div>
            {user.user_type === 'etudiant' && (
                <div className='grid grid-cols-1 xl:grid-cols-2'>
                    {(feed_mobile === 'all' || feed_mobile === 'etudiant') && (
                        <div>
                            {feed_friends.map((elem) => {
                                return <StudSkeleton elem={elem} />
                            })}
                        </div>
                    )}
                    <div>
                        {(feed_mobile === 'all' || feed_mobile === 'enseignant') &&
                            feed_prof.map((elem) => {
                                return <ProfSkeleton elem={elem} />
                            })}
                    </div>
                </div>
            )}
            {user.user_type === 'enseignant' && (
                <div className='grid grid-cols-1 xl:grid-cols-2'>
                    {feed_prof.map((elem) => {
                        return (
                            <div>
                                <ProfSkeleton elem={elem} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Skeleton
