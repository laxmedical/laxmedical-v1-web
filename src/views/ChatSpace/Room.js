import React, { useRef, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import Paper from '@mui/material/Paper';
import { blue, grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import CancelIcon from '@mui/icons-material/ArrowBackIos';
import CallIcon from '@mui/icons-material/Call';
import VideoIcon from '@mui/icons-material/VideoCall';
import MenuIcon from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';

import useStream from 'hooks/useStream';
import useRemoteStreams from 'hooks/useRemoteStream';
import useUserMedia from 'hooks/useUserMedia';

import Ullistration from './Ullistration';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '87vh',
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  header: {
    position: 'relative',
    zIndex: 1,
    padding: '2px 2px',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  title: {
    flex: 1
  },
  body: {
    flex: 1,
    overflow: 'auto'
  },
  messageContainer: {
    margin: '10px 0px',
    display: 'flex',
    flexDirection: 'column'
  },
  messageRight: {
    padding: '6px 13px',
    maxWidth: '80%',
    color: 'black',
    alignSelf: 'flex-end !important',
    backgroundColor: blue[50]
  },
  messageLeft: {
    padding: '6px 13px',
    maxWidth: '80%',
    alignSelf: 'flex-start !important',
    backgroundColor: '#fff'
  },
  form: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    '& .MuiTextField-root': {
      margin: theme.spacing(0.5),
      flex: 1
    }
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

let message = {
  type: 'text',
  content: ''
};
let conn = null;
export default function Room({ myPeer, currentRoom, sendChatMessage }) {
  const classes = useStyles();
  const [value, setValue] = React.useState();
  const [calling, setCallings] = React.useState(null);
  const localstream = useUserMedia();
  const [setLocalStream, localVideoRef, handleCanPlayLocal] = useStream();

  React.useEffect(() => {
    console.log('je suis la');
    console.log(currentRoom);

    if (currentRoom) {
      /*
      messagesEndRef.current.scrollIntoView() */
      messagesEndRef.current.scrollTop += 5000;
    }
  }, [currentRoom]);

  const handleChange = (event) => {
    message = {
      ...message,
      content: event.target.value.trim()
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(message);
    sendChatMessage(message, currentRoom.room);
    message = {
      type: 'text',
      content: ''
    };
    setValue('');
    setValue(null);
  };

  const makeCall = () => {
    setLocalStream(localstream);
    console.log('make calling: ', currentRoom.room);
    console.log(myPeer);
    if (myPeer) {
      setCallings(true);
      join(currentRoom.room);
      const thisCall = myPeer.call(currentRoom.room, localstream);
      thisCall.on('stream', (remoteStream) => {
        console.log(`Connected to ${thisCall.peer}`);
      });

      thisCall.on('close', () => {
        console.log('call closed');
      });

      thisCall.on('error', (error) => {
        console.log('call error', error);
      });
    }
  };
  function join(remoteId) {
    // Close old connection
    if (conn) {
      conn.close();
    }

    // Create connection to destination peer specified in the input field
    console.log('connecting remote peer: ', remoteId);
    conn = myPeer.connect(remoteId, {
      reliable: true
    });

    conn.on('open', () => {
      console.log(`Connected to: ${conn.peer}`);
    });
    // Handle incoming data (messages only since this is the signal sender)
    conn.on('data', (data) => {
      console.log(`receive data from Peer:${data}`);
    });
    conn.on('close', () => {
      console.log('Connection closed');
    });
  }

  const messagesEndRef = useRef(null);

  return (
    <div className={classes.root}>
      {currentRoom ? (
        !calling ? (
          <>
            <Paper className={classes.header}>
              <IconButton size="large">
                <CancelIcon />
              </IconButton>
              <div className={classes.title}>
                <Button>{currentRoom.room_name}</Button>
              </div>
              <IconButton onClick={(e) => makeCall()} size="large">
                <VideoIcon />
              </IconButton>
              <Divider orientation="vertical" flexItem />
              <IconButton onClick={(e) => makeCall()} size="large">
                <CallIcon />
              </IconButton>
            </Paper>
            <div className={classes.body} ref={messagesEndRef}>
              {currentRoom.messages !== []
                ? currentRoom.messages.map((message, key) => {
                    const date = new Date(message.date);
                    return (
                      <div key={key} className={classes.messageContainer}>
                        <Paper className={currentRoom.room !== message.author.id ? classes.messageRight : classes.messageLeft}>
                          <strong className={classes.right}>{message.author.username}</strong>
                          <p>{message.message}</p>
                          <p style={{ textAlign: 'right', fontSize: 14 }}>
                            <small>{date.toLocaleString()}</small>
                          </p>
                        </Paper>
                      </div>
                    );
                  })
                : null}
              <div />
            </div>
            <Paper component="form" className={classes.form} onChange={handleChange} onSubmit={handleSubmit}>
              <IconButton className={classes.iconButton} aria-label="menu" size="large">
                <MenuIcon />
              </IconButton>
              <TextField
                required
                id="filled-multiline-flexible"
                name="text"
                label="Message"
                multiline
                maxRows={4}
                value={value}
                variant="outlined"
              />
              <IconButton type="submit" aria-label="directions" size="large">
                <SendIcon style={{ fontSize: 30 }} />
              </IconButton>
            </Paper>
          </>
        ) : (
          <div className={classes.body} ref={messagesEndRef}>
            <div className="main-stream">
              <video ref={localVideoRef} onCanPlay={handleCanPlayLocal} autoPlay playsInline muted />
            </div>
          </div>
        )
      ) : (
        <Ullistration />
      )}
    </div>
  );
}
