/*eslint-disable*/
import React, {useState, useCallback} from "react";
import {
  Link
} from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import makeStyles from '@mui/styles/makeStyles';
import Drawer from "@mui/material/Drawer";
import Hidden from "@mui/material/Hidden";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";

const useStyles = makeStyles(styles);

const CustomLinkMemo = ({layout, path, handleClick, activePro, listItemClasses, whiteFontClasses, Icon, name}) =>{
  
  const classes = useStyles();
  
  return(
  <NavLink
  onClick={() => handleClick(name)}
  to={layout + path}
  className={activePro + classes.item}
  activeClassName="active"
>{
  console.log('render CustomLinkMemo')
}
  <ListItem button className={classes.itemLink + listItemClasses}>
      <Icon
        className={classNames(classes.itemIcon, whiteFontClasses)}
      />
    <ListItemText
      primary={name}
      className={classNames(classes.itemText, whiteFontClasses)}
      disableTypography={true}
    />
  </ListItem>
</NavLink>
)}
const  CustomLink = React.memo(CustomLinkMemo)

const MainLinks = ({ color, logo, image, logoText, routes, handleDrawerToggle, ...props}) => {
  const [currentComponent, setCurrentComponent] = useState(window.location.href)
  const classes = useStyles();

  function activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }

  const handleClick = useCallback((name) => {
    window.innerWidth <= 960 ? handleDrawerToggle() : null
    setCurrentComponent(name)
  }, [])
  console.log('render MainLinks')
  return(
  <List className={classes.list}>
    {routes.map((prop, key) => {
      var activePro = " ";
      var listItemClasses;

      if (routes.length === key+1) {
        activePro = classes.activePro + " ";
        listItemClasses = classNames({
          [" " + classes['red']]: true
        });
      } else{
        listItemClasses = classNames({
          [" " + classes[color]]: activeRoute(prop.layout + prop.path)
        });
      }
      
      const whiteFontClasses = useCallback( classNames({
        [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path)
      }), [])
      return (
        <CustomLink 
          key={key} 
          handleClick={handleClick} 
          activePro={activePro} 
          listItemClasses={listItemClasses} 
          whiteFontClasses={whiteFontClasses}
          Icon={prop.icon}
          layout={prop.layout} path={prop.path}
          name={prop.name} 
        />
      );
    })}
  </List>
);}

export default function Sidebar(props) {
  const classes = useStyles();

    console.log('render sideBar')
  // verifies if routeName is the one active (in browser input)

  const { color, logo, image, logoText, routes} = props;

  var brand = (
    <div className={classes.logo}>
          <Link to="/lax_medic/acceuil" className={classNames(classes.logoLink)}>
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
          </Link>
    </div>
  );

  return (
    <div>
      {
        window.innerWidth <= 900
        ? (
            <Hidden mdUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={"right"}
              open={props.open}
              classes={{
                paper: classNames(classes.drawerPaper)
              }}
              onClose={props.handleDrawerToggle}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              {brand}
              <div className={classes.sidebarWrapper}>
              <AdminNavbarLinks />
              {console.log('after')}
              <MainLinks {...props}/>
            </div>
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
        )

        :(<Hidden mdDown implementation="css">
          <Drawer
            anchor={"left"}
            variant="permanent"
            open
            classes={{
              paper: classNames(classes.drawerPaper)
            }}
          >
            {brand}
            <div className={classes.sidebarWrapper}>
            
            {console.log('after')}
            <MainLinks {...props}/></div>
            {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>)
      }
    </div>
  );
}

Sidebar.propTypes = {
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool
};
