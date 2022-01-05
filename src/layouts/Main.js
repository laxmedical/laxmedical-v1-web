import React, { useRef, Suspense, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// creates a beautiful scrollbar
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from 'components/Snackbar/Snackbar';
import AddAlert from '@mui/icons-material/AddAlert';
// core components
import Navbar from 'components/Navbars/Navbar';
import Footer from 'components/Footer/Footer';
import Sidebar from 'components/Sidebar/Sidebar';
import FixedPlugin from 'components/FixedPlugin/FixedPlugin';

import routes from 'routes';

import styles from 'assets/jss/material-dashboard-react/layouts/adminStyle';

import audio from 'assets/audio/lives.mp3';
import bgImage from 'assets/img/sidebar-4.jpg';
import logo from 'assets/img/reactlogo.png';

import ConnectedPeers from 'components/connectedPeers/connectedPeers';
import Chat from 'components/chat/chat';
import useWebSocket from 'hooks/useWebSocket';
import usePeer from 'hooks/usePeer';
import useStream from 'hooks/useStream';
import useRemoteStreams from 'hooks/useRemoteStream';
import useUserMedia from 'hooks/useUserMedia';

import { useAuth } from '../App';

let ps;

const SwitchRoutes = (props) => (
  <Suspense fallback={<LinearBuffer />}>
    <Switch>
      {routes.map((prop, key) => {
        if (prop.layout === '/lax_medic') {
          return (
            <Route path={prop.layout + prop.path} key={key}>
              <prop.component {...props} />
            </Route>
          );
        }
        return null;
      })}
      <Redirect from="/lax_medic" to="/lax_medic/acceuil" />
    </Switch>
  </Suspense>
);

function LinearBuffer() {
  const useStyles = makeStyles({
    root: {
      left: '0',
      height: 'calc(100vh - 123px)',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99
    }
  });
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
}

const useStyles = makeStyles(styles);

let callBackList = [];
const userMediaConfig = {
  audio: { echoCancellation: true, noiseSuppression: true },
  video: { facingMode: 'user' }
};

export default function Main({ webSocket, ...rest }) {
  console.log('-------- main inside ------------- !!!!!'); /*
  const localstream = useUserMedia();
  const [setLocalStream, localVideoRef, handleCanPlayLocal] = useStream();
  const [remoteStreams, addRemoteStream, removeRemoteStream] = useRemoteStreams();
  const refsArray = useRef([]);
  const [myPeer, myPeerID] = usePeer(addRemoteStream, removeRemoteStream);
  const [showConference, setShowConference] = useState(false); */

  const auth = useAuth();
  const [br, setBR] = React.useState({ open: false });
  const [remoteStreams, addRemoteStream, removeRemoteStream] = useRemoteStreams();
  const refsArray = useRef([]);
  const [myPeer, myPeerID] = usePeer(auth.user.id, addRemoteStream, removeRemoteStream);
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState('blue');
  const [fixedClasses, setFixedClasses] = React.useState('dropdown');
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const addCallBack = (callBack) => {
    console.log('add callBack fun !!!!!');
    callBackList.push(callBack);
  };

  const deleteCallBack = (callBackId) => {
    console.log(`delete callBack func${callBackId} !!!!!`);
    callBackList = callBackList.filter((callBack) => callBack.id !== callBackId);
    console.log(callBackList);
  };

  const audioRef = useRef(null);
  React.useEffect(() => {
    console.log('-------- main callBack useCallback ------------- ', myPeerID);
    console.log(myPeer);
    /*     if (myPeer) {
      myPeer.on('call', (call) => {
        setBR({ open: true, message: `Vous avez un appel de ${call.peer}` });
        navigator.mediaDevices
          .getUserMedia(userMediaConfig)
          .then((localstream) => {
            if (localstream && localVideoRef.current && !localVideoRef.current.srcObject) {
              localVideoRef.current.srcObject = localstream;
            }
            setCall(call);
            call.answer(localstream);
            call.on('stream', (remoteStream) => {
              if (remoteStream && remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
                remoteVideoRef.current.srcObject = remoteStream;
              }
            });

            call.on('close', () => {
              console.log('The call has ended');
            });

            call.on('error', (error) => {
              console.log(error);
            });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } */
    return () => {
      deleteCallBack('NotificationSound');
    };
  }, [myPeer]);
  React.useEffect(() => {
    console.log('-------- main callBack useCallback ------------- !!!!!');
    console.log(myPeer);
    addCallBack({
      id: 'NotificationSound',
      type: ['chat'],
      run: (data) => {
        console.log('je suis là depuis ReceptionHome');
        console.log(data);
        if (auth.user.id !== data.content.message.author.id) {
          audioRef.current.play();
          setBR({
            open: true,
            message: `Vous avez un message de ${data.content.message.author.username}: ${data.content.message.message}`
          });
        }
      }
    });
    return () => {
      deleteCallBack('NotificationSound');
    };
  }, []);

  useEffect(() => {
    webSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      console.log(callBackList);
      callBackList.forEach((callBack) => {
        if (callBack.type.includes(data.type)) {
          callBack.run(data);
        }
      });
    };
  }, [webSocket.onmessage]);

  const handleImageClick = (image) => {
    setImage(image);
  };
  const handleColorClick = (color) => {
    setColor(color);
  };
  const handleFixedClick = () => {
    if (fixedClasses === 'dropdown') {
      setFixedClasses('dropdown show');
    } else {
      setFixedClasses('dropdown');
    }
  };
  const handleDrawerToggle = () => {
    console.log(`modile = ${mobileOpen}`);
    setMobileOpen((value) => !value);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = 'hidden';
    }
    window.addEventListener('resize', resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf('Win') > -1) {
        ps.destroy();
      }
      window.removeEventListener('resize', resizeFunction);
    };
  }, [mainPanel]);
  return (
    <div className={classes.wrapper}>
      {console.log('render main')}
      <Sidebar
        routes={routes}
        logoText="lax_medic"
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar routes={routes} handleDrawerToggle={handleDrawerToggle} color="white" {...rest} />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}

        <div className={classes.content}>
          <div className={classes.container}>
            <SwitchRoutes addCallBack={addCallBack} deleteCallBack={deleteCallBack} webSocket={webSocket} myPeer={myPeer} />
          </div>
        </div>

        <Snackbar
          place="br"
          color="info"
          icon={AddAlert}
          message={br.message}
          open={br.open}
          closeNotification={() => setBR((b) => ({ ...b, open: false }))}
          close
        />

        <Footer />
        {/*
        <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          bgColor={color}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
        /> */}
      </div>
      <audio ref={audioRef}>
        <source src={audio} />
      </audio>
    </div>
  );
}
