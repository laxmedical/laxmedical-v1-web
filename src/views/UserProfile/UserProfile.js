import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import InputLabel from '@mui/material/InputLabel';
// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Button from 'components/CustomButtons/Button.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardAvatar from 'components/Card/CardAvatar.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import { useAuth } from '../../App';

const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0'
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none'
  }
};

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const classes = useStyles();
  const auth = useAuth();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  const avatarLink = `http://${window.location.hostname}:8000${auth.user.avatar}`;

  return (
    <div>
      <br />
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Mes Permissions</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <List component="nav" aria-label="secondary mailbox folder">
                  {auth.user.permisions.map((per, index) => (
                    <>
                      <ListItem button selected={selectedIndex === index} onClick={(event) => handleListItemClick(event, index)}>
                        <ListItemText primary={per} />
                      </ListItem>
                      <Divider />
                    </>
                  ))}
                  <ListItem button selected={selectedIndex === 300} onClick={(event) => handleListItemClick(event, 300)}>
                    <ListItemText primary="Spam" />
                  </ListItem>
                </List>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary">Update Profile</Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#" onClick={(e) => e.preventDefault()}>
                <img src={avatarLink} alt={auth.user.username} />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>{auth.user.title}</h6>
              {console.log(auth.user)}
              <h4 className={classes.cardTitle}>{`${auth.user.first_name} ${auth.user.last_name} ${auth.user.username}`}</h4>
              <p className={classes.description}>
                Don &apos; t be scared of the truth because we need to restart the human Kanye loves Kanye I love Rick Owens’ bed design but
                the back is...
              </p>
              <Button color="primary" round>
                Modifier
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
