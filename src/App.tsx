import { AppContext, AppProvider } from './AppContext';
import ReactGA from 'react-ga4';
import { Switch, Route, useLocation } from "react-router-dom";
import React, { useContext, useEffect } from 'react';import './App.css';
import Home from "./pages/Home/Home";
import Header from './components/Header/Header';
import './scss/app.scss'
import Footer from './components/Footer/Footer';

function App() {
  const location = useLocation()
  const { isLoggedIn } = useContext(AppContext)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname
    })
  }, [location, window.location.pathname])

  return (
    <Switch>
      <Route exact path="/">
        <div className={`page__wrapper`}>
          <Header />
          <div className={`page__row`}>
            <Home />
          </div>
            <Footer />
        </div>
      </Route>
      <Route>
        <div className={`page__wrapper`}>
          <Header />
          <div className={`page__row`}>
            <Home />
          </div>
            <Footer />
        </div>
      </Route>
    </Switch>
  );
}

export default App;
