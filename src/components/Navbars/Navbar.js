import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Hidden from '@mui/material/Hidden';
// @mui/icons-material
import Menu from '@mui/icons-material/Menu';
// core components
import Button from 'components/CustomButtons/Button.js';

import styles from 'assets/jss/material-dashboard-react/components/headerStyle.js';

import { Link } from 'react-router-dom';
import RTLNavbarLinks from './RTLNavbarLinks.js';
import AdminNavbarLinks from './AdminNavbarLinks.js';

const useStyles = makeStyles(styles);

export default function Header(props) {
  const classes = useStyles();
  function makeBrand() {
    let name;
    let url = null;
    props.routes.map((prop) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        name = props.rtlActive ? prop.rtlName : prop.name;
        url = prop.layout + prop.path;
      }
      return null;
    });
    return { name, url };
  }
  const currentApp = makeBrand();
  const { color } = props;
  const appBarClasses = classNames({
    [` ${classes[color]}`]: color
  });
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Link to={currentApp.url} className={classes.title}>
            {currentApp.name}
          </Link>
        </div>
        <Hidden mdDown implementation="css">
          {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton color="inherit" aria-label="open drawer" onClick={props.handleDrawerToggle} size="large">
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object)
};
