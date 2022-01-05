import React, { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';

import { green } from '@mui/material/colors';

import bgImage from 'assets/img/login1.jpg';

import { useAuth } from '../../App';

import ChatHome from './ChatHome';
import Room from './Room';

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    Height: '80vh'
  },
  root1: {
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper
  },
  image: {
    backgroundImage: `url(${bgImage}gh)`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
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

export default function ChatSpace({ addCallBack, deleteCallBack, webSocket, myPeer }) {
  const classes = useStyles();
  console.log(myPeer);

  const auth = useAuth();

  const [value, setValue] = React.useState(0);
  const [selectedRoom, setSelectedRoom] = React.useState(1);
  const [personalsList, setPersonalsList] = React.useState([]);
  const [currentRoom, setCurrentRoom] = React.useState();

  useEffect(() => {
    console.log(addCallBack);
    addCallBack({
      id: 'ChatSpace',
      type: ['chat', 'personals_list', 'simple_messages', 'connected_users'],

      run: (data) => {
        console.log('je suis la depuis chaspace');

        console.log(data);
        if (data.type === 'personals_list') {
          setPersonalsList(data.content);
        } else if (data.type === 'simple_messages') {
          setCurrentRoom(data.content);
          setValue(1);
        } else if (data.type === 'chat') {
          if (data.content.type === 'message') {
            setCurrentRoom((room) => {
              console.log('message set', room);
              if (room && (room.room === data.content.message.author.id || room.room === data.content.message.to.id)) {
                return { ...room, messages: [...room.messages, data.content.message] };
              }
              return room;
            });
            setPersonalsList((personal_list) =>
              personal_list.map((personal) =>
                personal.id === data.content.message.author.id || personal.id === data.content.message.to.id
                  ? { ...personal, last_message: data.content.message.message }
                  : personal
              )
            );
          }
        } else if (data.type === 'connected_users') {
          console.log('connected_users');
          const online_id = data.content.map((el) => el.id);
          console.log('online id: ', online_id);
          setPersonalsList((personal_list) =>
            personal_list.map((personal) =>
              online_id.includes(personal.id) ? { ...personal, is_online: true } : { ...personal, is_online: false }
            )
          );
        } else {
          console.log('else data', data);
        }
      }
    });
    return () => {
      deleteCallBack('ChatSpace');
    };
  }, []);

  useEffect(() => {
    webSocket.send(
      JSON.stringify({
        type: 'get_personals_list'
      })
    );
  }, []);

  const handleListItemClick = (event, index) => {
    setSelectedRoom(index);
    getRoom(index);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getRoom = (id) => {
    webSocket.send(
      JSON.stringify({
        type: 'get_simple_messages',
        content: {
          room: id
        }
      })
    );
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const sendChatMessage = (message, to) => {
    const code = new Date();

    console.log('sendChatMessage');
    webSocket.send(
      JSON.stringify({
        type: 'chat',
        content: {
          room_type: 'simple',
          author: auth.user.id,
          to,
          message_type: message.type,
          message: message.content,
          message_code: code.getTime()
        }
      })
    );
  };

  return (
    <div>
      <Grid container component={Paper} className={classes.root}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={4}>
          <Grid container>
            <List className={classes.root1}>
              {personalsList !== []
                ? personalsList.map((p, index) => {
                    const avatarLink = `http://${window.location.hostname}:8000${p.avatar}`;
                    return (
                      <>
                        <ListItem button selected={selectedRoom === p.id} onClick={(event) => handleListItemClick(event, p.id)}>
                          <ListItemAvatar>
                            {p.is_online ? (
                              <StyledBadge
                                overlap="circular"
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'right'
                                }}
                                variant="dot"
                              >
                                <Avatar alt={null} src={avatarLink} />
                              </StyledBadge>
                            ) : (
                              <Avatar alt={null} src={avatarLink} />
                            )}
                          </ListItemAvatar>
                          <ListItemText primary={p.username} secondary={p.last_message} />
                        </ListItem>
                        {/*
            <Divider variant="inset" component="li" /> */}
                      </>
                    );
                  })
                : null}
            </List>
          </Grid>
        </Grid>
        <Grid item xs={false} sm={4} md={8} className={classes.image}>
          <Room myPeer={myPeer} currentRoom={currentRoom} sendChatMessage={sendChatMessage} />
        </Grid>
      </Grid>
    </div>
  );
}

/* import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';

import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import { green, grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import MicIcon from '@mui/icons-material/Mic';

import {useAuth} from '../../App';

import ChatHome from './ChatHome';
import Room from './Room';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'relative',
    minHeight: '80vh',
    backgroundColor: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(13),
    right: theme.spacing(2),
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[600],
    },
  },
}));

export default function ChatSpace({addCallBack, deleteCallBack, webSocket}) {
  const classes = useStyles();
  const theme = useTheme();

  const auth = useAuth()

  const [value, setValue] = React.useState(0);
  const [onlinePersonalsList, setOnlinePersonalsList] = React.useState([]);
  const [currentRoom, setCurrentRoom] = React.useState();

   const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const fabs = [
    {
      color: 'primary',
      className: classes.fab,
      icon: <AddIcon />,
      label: 'Add',
    },
    {
      color: 'secondary',
      className: classes.fab,
      icon: <MicIcon />,
      label: 'Vocal',
    },
    {
      color: 'inherit',
      className: clsx(classes.fab, classes.fabGreen),
      icon: <UpIcon />,
      label: 'Expand',
    },
  ];

  return (
    <Paper className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="action tabs example"
        >
          <Tab label="messages" {...a11yProps(0)} />
          <Tab label="room" {...a11yProps(1)} />
          <Tab label="video" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <ChatHome getRoom={getRoom} onlinePersonalsList={onlinePersonalsList}/>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Room changeView={setValue} currentRoom={currentRoom} sendChatMessage={sendChatMessage}/>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Video
        </TabPanel>
      </SwipeableViews>
      {fabs.map((fab, index) => (
        <Zoom
          key={fab.color}
          in={value === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`,
          }}
          unmountOnExit
        >
          <Fab aria-label={fab.label} className={fab.className} color={fab.color}>
            {fab.icon}
          </Fab>
        </Zoom>
      ))}
    </Paper>
  );
} */
