import React from 'react';
import classNames from 'classnames';
import makeStyles from '@mui/styles/makeStyles';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Hidden from '@mui/material/Hidden';
import Poppers from '@mui/material/Popper';
import Divider from '@mui/material/Divider';
// @mui/icons-material
import Notifications from '@mui/icons-material/Notifications';

import styles from 'assets/jss/material-dashboard-react/components/headerLinksStyle.js';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import { useAuth } from '../../App';

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const classes = useStyles();

  const auth = useAuth();

  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };

  const avatarLink = `http://${window.location.hostname}:8000${auth.user.avatar}`;

  return (
    <div>
      <Hidden mdDown implementation="css">
        <div className={classes.manager}>
          <IconButton onClick={handleClickNotification} size="large">
            <Badge color="secondary" badgeContent={5} max={99}>
              <Notifications style={{ fontSize: 30 }} />
            </Badge>
          </IconButton>
          <Poppers
            open={Boolean(openNotification)}
            anchorEl={openNotification}
            transition
            disablePortal
            className={`${classNames({ [classes.popperClose]: !openNotification })} ${classes.popperNav}`}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="notification-menu-list-grow"
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleCloseNotification}>
                    <MenuList role="menu">
                      <MenuItem onClick={handleCloseNotification} className={classes.dropdownItem}>
                        Mike John responded to your email
                      </MenuItem>
                      <MenuItem onClick={handleCloseNotification} className={classes.dropdownItem}>
                        You have 5 new tasks
                      </MenuItem>
                      <MenuItem onClick={handleCloseNotification} className={classes.dropdownItem}>
                        You ' re now friend with Andrew
                      </MenuItem>
                      <MenuItem onClick={handleCloseNotification} className={classes.dropdownItem}>
                        Another Notification
                      </MenuItem>
                      <MenuItem onClick={handleCloseNotification} className={classes.dropdownItem}>
                        Another One
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
        <div className={classes.manager}>
          <div style={{ marginLeft: 15 }}>
            <Hidden lgDown implementation="css">
              <Button className={classes.button} endIcon={<Avatar alt={null} src={avatarLink} />}>
                {auth.user.username}
              </Button>
            </Hidden>
          </div>
          <Poppers
            open={Boolean(openProfile)}
            anchorEl={openProfile}
            transition
            disablePortal
            className={`${classNames({ [classes.popperClose]: !openProfile })} ${classes.popperNav}`}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="profile-menu-list-grow"
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleCloseProfile}>
                    <MenuList role="menu">
                      <MenuItem onClick={handleCloseProfile} className={classes.dropdownItem}>
                        Profile
                      </MenuItem>
                      <MenuItem onClick={handleCloseProfile} className={classes.dropdownItem}>
                        Settings
                      </MenuItem>
                      <Divider light />
                      <MenuItem onClick={handleCloseProfile} className={classes.dropdownItem}>
                        Logout
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
      </Hidden>
    </div>
  );
}
