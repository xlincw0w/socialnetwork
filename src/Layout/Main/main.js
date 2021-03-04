import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Header from '../Header/header'
import Auth from '../Auth/auth'
import Messagerie from '../Messagerie/messagerie'
import Inscription from '../Inscription/inscription'
import Home from '../Home/home'
import Dashbaord from '../Dashboard/dashbaord'
import Erreur from '../Erreur/erreur'
import Footer from '../Footer/footer'
import Profile from '../Profile/IndexProfile'

const Main = () => {
    return (
        <div className='font-openSans'>
            <Router>
                <div style={{ height: 'auto' }}>
                    <Switch>
                        <Route path='/dashboard'>
                            <Dashbaord />
                        </Route>
                        <Route path='/profile'>
                            <Header />
                            <Profile />
                        </Route>
                        <Route path='/messagerie'>
                            <Messagerie />
                        </Route>
                        <Route path='/auth'>
                            <Header />
                            <Auth />
                        </Route>
                        <Route path='/inscription'>
                            <Inscription />
                        </Route>
                        <Route exact path='/'>
                            <Home />
                        </Route>
                        <Route>
                            <Erreur />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    )
}

export default Main
