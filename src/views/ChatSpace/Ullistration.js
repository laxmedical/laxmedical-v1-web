import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';

import { ReactComponent as Ullistration } from './undraw_group_video_re_btu7 (1).svg';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fafafa',
    maxHeight: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    position: 'relative'
  },
  ullistration: {
    maxWidth: 350
  }
}));

export default function ChatHome({ onlinePersonalsList, getRoom }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Ullistration className={classes.ullistration} />
    </div>
  );
}
