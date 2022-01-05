import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    minHeight: '85vh',
    width: '100%',
    flexGrow: 1,
    position: 'relative'
  }
}));

export default function ChatHome({ onlinePersonalsList, getRoom }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    getRoom(newValue);
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="absolute" color="primary">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          aria-label="scrollable force tabs example"
          allowScrollButtonsMobile
        >
          {onlinePersonalsList.map((personal, key) => (
            <Tab
              key={key}
              value={personal.id}
              label={personal.username}
              icon={<Avatar alt={null} src="avatarLink" />}
              {...a11yProps(personal.id)}
            />
          ))}
        </Tabs>
      </AppBar>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          Lis
        </Grid>
        <Grid item xs={false} sm={4} md={7} />
      </Grid>
      Liste de dernière conversation
    </div>
  );
}
