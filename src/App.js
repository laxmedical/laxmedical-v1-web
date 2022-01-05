import React, { useState, useEffect, Suspense, useContext, createContext } from 'react';
import { createBrowserHistory } from 'history';
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory, useLocation } from 'react-router-dom';

// pages for this product
import makeStyles from '@mui/styles/makeStyles';
import { pink, blue } from '@mui/material/colors';

import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import CircularProgress from '@mui/material/CircularProgress';

// core components
const Login = React.lazy(() => import('layouts/Login'));
const Main = React.lazy(() => import('layouts/Main'));

const hist = createBrowserHistory();

export default function App({ webSocket }) {
  const [darkMode, setDarkMode] = React.useState(JSON.parse(localStorage.getItem('darkMode')) || false);

  const theme = React.useMemo(
    () =>
      createTheme(
        adaptV4Theme({
          palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: blue,
            secondary: pink
          }
        })
      ),
    [darkMode]
  );

  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div>
      <ProvideAuth>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <Suspense fallback={<LinearBuffer />}>
                <div>
                  <Switch>
                    <Route path="/login">
                      <Login webSocket={webSocket} />
                    </Route>
                    <PrivateRoute path="/lax_medic" webSocket={webSocket} Component={Main} />
                    <Redirect from="/" to="lax_medic" />
                  </Switch>
                </div>
              </Suspense>
            </Router>
          </ThemeProvider>
        </StyledEngineProvider>
      </ProvideAuth>
    </div>
  );
}

function LinearBuffer() {
  const useStyles = makeStyles({
    root: {
      position: 'fixed',
      height: '100vh',
      width: '100vw',
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

const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const authContext = createContext();

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = (cb) =>
    fakeAuth.signin(() => {
      setUser(cb());
    });

  const signout = (cb) =>
    fakeAuth.signout(() => {
      setUser(null);
      cb();
    });

  return {
    user,
    signin,
    signout
  };
}

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ webSocket, Component, ...rest }) {
  const [isLoading, setIsLoading] = useState(true);
  console.log('private');
  const history = useHistory();
  const location = useLocation();
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      setIsLoading(null);
    } else {
      setTimeout(() => {
        webSocket.send(
          JSON.stringify({
            type: 'init'
          })
        );
      }, 500);

      webSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);

        if (data.type === 'init') {
          console.log(data.content);

          if (data.content.is_auth) {
            console.log('welcome');
            handleLogin(data.content.user);
          } else if (localStorage.getItem('azerty') && localStorage.getItem('querty')) {
            console.log('tu etais sauvegarder en local');
            webSocket.send(
              JSON.stringify({
                type: 'login',
                content: {
                  username: localStorage.getItem('azerty'),
                  password: localStorage.getItem('querty')
                }
              })
            );
          } else {
            console.log('vous are not connect');
            history.push('/login');
          }
        }
        if (data.type === 'login') {
          console.log(data.content);

          if (data.status === 'success') {
            console.log('welcome');
            handleLogin(data.content.user);
          } else {
            console.log('vous are not connect');
            localStorage.clear('azerty');
            localStorage.clear('querty');
            history.push('/login');
          }
        }
      };
    }
  }, []);

  const { from } = location.state || { from: { pathname: '/' } };
  const handleLogin = (user) => {
    auth.signin(() => {
      history.replace(from);
      return user;
    });
  };

  return (
    <Route {...rest}>
      {isLoading ? (
        <div>
          <LinearBuffer />
        </div>
      ) : auth.user ? (
        <Component webSocket={webSocket} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: location }
          }}
        />
      )}
    </Route>
  );
}
