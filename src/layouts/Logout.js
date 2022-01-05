import React, { useState, useEffect, Suspense, useContext, createContext, useCallback } from 'react';
import { createBrowserHistory } from 'history';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation } from 'react-router-dom';

import makeStyles from '@mui/styles/makeStyles';

import CircularProgress from '@mui/material/CircularProgress';

import { useAuth } from '../App';

export default function App({ webSocket }) {
  const location = useLocation();
  const auth = useAuth();
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      webSocket.send(
        JSON.stringify({
          type: 'logout'
        })
      );
    }, 100);

    const handleLogout = () => {
      console.log('handleLogout');
      const { from } = location.state || { from: { pathname: '/lax_medic' } };
      auth.signout(() => {
        setTimeout(() => {
          history.push('/login');
        }, 100);

        localStorage.clear('azerty');
        localStorage.clear('querty');
      });
    };
    webSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('handleLogout');
      console.log(data);
      if (data.type === 'logout') {
        console.log(data.status);

        if (data.status === 'success') {
          console.log('vous deconnecter cote serveur');
          handleLogout();
        } else {
          console.log('erreur de deconnection coté serveur');
        }
      }
    };
  }, []);

  return <LinearBuffer />;
}

function LinearBuffer() {
  const useStyles = makeStyles({
    root: {
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: '#fff9',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99
    }
  });

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress disableShrink />
    </div>
  );
}
