import React from 'react';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import makeStyles from '@mui/styles/makeStyles';

import { blue } from '@mui/material/colors';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    top: 'auto',
    bottom: 0,
    margin: 10,
    zIndex: 3,
    backgroundColor: blue[300],
    '&:hover': {
      backgroundColor: blue[600]
    }
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  }
}));

export default function Chat({ addWebSocketMassageHandler, sendWebSocketMessage }) {
  const classes = useStyles();

  /*   useEffect(()=>{
    sendWebSocketMessage(JSON.stringify({
      'type': 'init',
      'data': 'from chat component'
  }))
  }, []) */

  return (
    <div>
      <div className={classes.container}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
      </div>
    </div>
  );
}
