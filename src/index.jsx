/*!

=========================================================
* Akelax Technologie React - v1.9.0
=========================================================

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';
import ReactDOM from 'react-dom';

import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';
import PortableWifiOffIcon from '@mui/icons-material/PortableWifiOff';

import Button from '@mui/material/Button';

// core components
import App from './App';
import 'assets/css/material-dashboard-react.css';

const webSocket = new WebSocket(`ws://${window.location.hostname}:8000/ws/lax_medic/personal/`);

const Init = () => {
  const [connectWebSocket, setConnectWebSocket] = React.useState(null);
  const [wsState, setWsState] = React.useState('');

  React.useEffect(() => {
    webSocket.onopen = () => setConnectWebSocket(webSocket);
    webSocket.onclose = () => {
      setConnectWebSocket(null);
      setWsState('disconnect');
    };
  }, []);

  return (
    <>
      {connectWebSocket ? (
        <App webSocket={connectWebSocket} />
      ) : wsState === 'disconnect' ? (
        <Disconnect setConnectWebSocket={setConnectWebSocket} setWsState={setWsState} />
      ) : (
        <LinearBuffer />
      )}
    </>
  );
};

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
      <CircularProgress disableShrink />
    </div>
  );
}

function Disconnect({ setConnectWebSocket, setWsState }) {
  const useStyles = makeStyles({
    root: {
      position: 'fixed',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: 'white',
      alignItems: 'center'
    }
  });
  const classes = useStyles();

  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      setCounter(counter + 1);
    }, 999);
  }, [counter]);

  const handleRetry = () => {
    const webSocket = new WebSocket(`ws://${window.location.hostname}:8000/ws/lax_medic/personal/`);
    webSocket.onopen = () => setConnectWebSocket(webSocket);
    webSocket.onclose = () => {
      setConnectWebSocket(null);
      setWsState('disconnect');
    };
  };

  return (
    <div className={classes.root}>
      <PortableWifiOffIcon style={{ fontSize: 100 }} />
      <h3>{counter}s passées</h3>
      <p>Vous étes deconnectés du serveur !</p>
      <Button variant="outlined" color="primary" onClick={handleRetry}>
        Réessayer
      </Button>
    </div>
  );
}

ReactDOM.render(<Init />, document.getElementById('root'));
