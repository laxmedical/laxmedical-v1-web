import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SuccessIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/PersonTwoTone';

import CircularProgress from '@mui/material/CircularProgress';
import { green, cyan } from '@mui/material/colors';

import { useHistory, useLocation } from 'react-router-dom';

import bgImage from 'assets/img/login1.jpg';
import axiosInstance from '../axios.js';

import { useAuth } from '../App';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="">
        Akelax technologie
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 450
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: cyan[400]
  },
  avatarSuccess: {
    margin: theme.spacing(1),
    backgroundColor: green[400]
  },
  avatarWarning: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  // preload
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));

export default function SignInSide({ webSocket, ...props }) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const auth = useAuth();

  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('Identifiez-vous');
  const [saveDataForm, setSaveDataForm] = React.useState(true);

  const initialFormData = Object.freeze({
    username: '',
    password: ''
  });

  const [values, setValues] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
    }

    console.log('login user lalalal');
    axiosInstance
      .post('/token/', {
        username: formData.username,
        password: formData.password
      })
      .then((res) => {
        console.log('success');
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        axiosInstance.defaults.headers.Authorization = `JWT ${localStorage.getItem('access_token')}`;

        webSocketLogin();
      })
      .catch((res) => {
        webSocketLogin();
        console.log('login error lalalalll');
      });
  };

  const webSocketLogin = () => {
    setTimeout(() => {
      webSocket.send(
        JSON.stringify({
          type: 'login',
          content: formData
        })
      );
    }, 100);

    webSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);

      if (data.type === 'login') {
        console.log(data.content);

        if (data.status === 'success') {
          console.log('welcome');
          setStatus(data.status);
          handleLogin(data.content.user);
        } else if (data.status === 'not allowed') {
          setStatus(data.status);
          setLoading(false);
        } else {
          setStatus(data.status);
          console.log('vous are not connect');
          setLoading(false);
        }
      }
    };
  };

  const handleLogin = (user) => {
    const { from } = location.state || { from: { pathname: '/lax_medic' } };
    auth.signin(() => {
      setTimeout(() => {
        history.replace(from);
      }, 1000);
      return user;
    });
    if (saveDataForm) {
      localStorage.setItem('azerty', formData.username);
      localStorage.setItem('querty', formData.password);
    }
  };

  return (
    <div>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.container}>
            <div className={classes.paper}>
              {status === 'Identifiez-vous' ? (
                <>
                  <Avatar className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                  <Typography component="p" variant="h5">
                    {status}
                  </Typography>
                </>
              ) : status === 'success' ? (
                <>
                  <Avatar className={classes.avatarSuccess}>
                    <SuccessIcon />
                  </Avatar>
                  <Typography component="p" variant="h5">
                    Bienvenu(e) !!!
                  </Typography>
                </>
              ) : status === 'not allowed' ? (
                <>
                  <Avatar className={classes.avatarWarning}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="p" variant="h5">
                    Vous êtes pas permi d'entrer
                  </Typography>
                </>
              ) : (
                <>
                  <Avatar className={classes.avatarWarning}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="p" variant="h5">
                    Identifiant incorrect
                  </Typography>
                </>
              )}
              <form className={classes.form} method="POST" action="." onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Votre nom"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={values.showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {values.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <FormControlLabel
                  control={<Checkbox checked={saveDataForm} onChange={() => setSaveDataForm((v) => !v)} color="primary" name="remember" />}
                  label="se rappeler de moi"
                />
                <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} className={classes.submit}>
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  Se connecter
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      Don't have an account? Sign Up
                    </Link>
                  </Grid>
                </Grid>
                <Box mt={5}>
                  <Copyright />
                </Box>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
