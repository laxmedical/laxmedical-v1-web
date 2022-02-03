import React, { useState, useEffect } from 'react';

const audioOnlyConfig = { audio: true, video: false };
const userMediaConfig = {
  audio: { echoCancellation: true, noiseSuppression: true },
  video: { facingMode: 'user' }
};

const config = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

const localConfig = {
  host: window.location.hostname,
  secure: false,
  port: 9000,
  path: '/peerjs'
};

export default function usePeer(myId, addRemoteStream, removeRemoteStream) {
  const [myPeer, setPeer] = useState(null);
  const [myPeerID, setMyPeerID] = useState(null);

  const cleanUp = () => {
    if (myPeer) {
      myPeer.disconnect();
      myPeer.destroy();
    }
    setPeer(null);
    setMyPeerID(null);
  };

  useEffect(() => {
    console.log('Init Peer ------', myId);
    const peer = myPeer || new Peer(myId, localConfig);

    peer.on('open', () => {
      setMyPeerID(peer.id);
      setPeer(peer);
      console.log(`open  peer  ${peer.id}`);
    });

    peer.on('connection', (conn) => {
      console.log(`Connected to: ${conn.peer}`);
    });

    peer.on('disconnected', () => {
      console.log('Peer desconnected');
      cleanUp();
    });

    peer.on('close', () => {
      console.log('Peer closed remotetly');
      cleanUp();
    });

    peer.on('error', (error) => {
      console.log('peer error', error);
      cleanUp();
    });

    return () => {
      cleanUp();
    };
  }, []);

  return [myPeer, myPeerID];
}
