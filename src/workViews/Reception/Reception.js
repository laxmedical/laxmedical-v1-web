import React, { useState, useEffect, Suspense } from 'react';

import { Switch, Route } from 'react-router-dom';

import makeStyles from '@mui/styles/makeStyles';

import CircularProgress from '@mui/material/CircularProgress';

// core components
const ReceptionHome = React.lazy(() => import('./ReceptionHome'));
const RegisterPatient = React.lazy(() => import('../RegisterPatient'));
const RegisterFiche = React.lazy(() => import('./RegisterFiche'));

export default function Reception({ addCallBack, deleteCallBack, webSocket }) {
  return (
    <div>
      <Suspense fallback={<LinearBuffer />}>
        <Switch>
          <Route path="/lax_medic/work-place/reception/enregistrer-un-patient">
            <RegisterPatient addCallBack={addCallBack} deleteCallBack={deleteCallBack} webSocket={webSocket} />
          </Route>
          <Route path="">
            <ReceptionHome addCallBack={addCallBack} deleteCallBack={deleteCallBack} webSocket={webSocket} />
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
}

function LinearBuffer() {
  const useStyles = makeStyles({
    root: {
      position: 'fixed',
      height: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'white',
      alignItems: 'center'
    }
  });
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
}
