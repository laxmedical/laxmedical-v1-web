import React, { useState, useEffect, Suspense } from 'react';
import { Switch, Route, Link, useParams } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';

import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import PinDropIcon from '@mui/icons-material/PinDrop';
import CreateIcon from '@mui/icons-material/Create';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardAvatar from 'components/Card/CardAvatar';
import CardBody from 'components/Card/CardBody';
import CardFooter from 'components/Card/CardFooter';

import avatar from 'assets/img/profilDefault.png';

import RegisterFiche from './Reception/RegisterFiche';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import Consultation from './Consultation';
import FicheList from './FicheList';
import Fiche from './Fiche';

import { useAuth } from '../App';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
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
}));

export default function UserProfile({ addCallBack, deleteCallBack, webSocket }) {
  const classes = useStyles();
  const { patientId } = useParams();
  const [profil, setProfil] = useState(null);
  const [age, setAge] = useState(null);

  const auth = useAuth();

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    webSocket.send(
      JSON.stringify({
        type: 'get_patient_profile',
        content: {
          patient_id: patientId
        }
      })
    );

    addCallBack({
      id: 'UserProfile',
      type: ['patient_profile'],

      run: (data) => {
        console.log('je suis la depuis UserProfile');
        console.log(data);
        if (data.type === 'patient_profile' && data.status !== 'error') {
          setProfil(data.content);
        }
      }
    });
    return () => {
      deleteCallBack('UserProfile');
    };
  }, []);

  useEffect(() => {
    if (profil) {
      const patientAge = new Date(new Date() - new Date(profil.birth_date));
      setAge(patientAge.getYear() - 70);
    }
  }, [profil]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <GridContainer>
        <Grid container spacing={2} justifyContent="flex-start" style={{ margin: 10 }}>
          <Grid item>
            {auth.user.permisions.includes('workplace.add_fiche') ? (
              <Link to={`/lax_medic/work-place/patient-profiles-${patientId}/enregistrer-une-fiche`}>
                <Button variant="contained" color="primary" startIcon={<CreateIcon />}>
                  Créer une fiche
                </Button>
              </Link>
            ) : null}
          </Grid>
          <Grid item>
            <Link
              to={`/lax_medic/work-place/patient-profiles-${patientId}/fiche-${
                profil && profil.fiches.length !== 0 ? profil.fiches[0].id : -1
              }`}
            >
              <Button variant="outlined" color="primary">
                Fiche en cours
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to={`/lax_medic/work-place/patient-profiles-${patientId}/liste-des-fiches`}>
              <Button variant="outlined" color="primary">
                liste des fiches
              </Button>
            </Link>
          </Grid>
        </Grid>
        <br />
        <br />
        <br />
        <br />
        <GridItem xs={12} sm={12} md={8}>
          <Switch>
            <Route path={`/lax_medic/work-place/patient-profiles-${patientId}/enregistrer-une-fiche`}>
              <RegisterFiche patientId={patientId} addCallBack={addCallBack} deleteCallBack={deleteCallBack} webSocket={webSocket} />
            </Route>
            <Route path={`/lax_medic/work-place/patient-profiles-${patientId}/liste-des-fiches`}>
              <FicheList patientId={patientId} fichesList={profil ? profil.fiches : null} webSocket={webSocket} />
            </Route>
            <Route path={`/lax_medic/work-place/patient-profiles-${patientId}/fiche-:ficheId`}>
              <Fiche patientId={patientId} addCallBack={addCallBack} deleteCallBack={deleteCallBack} webSocket={webSocket} />
            </Route>
          </Switch>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody>
              <h4>{profil ? `${profil.username} ${profil.last_name} ${profil.first_name}` : '. . .'}</h4>
              <p>Edité par{profil ? `${profil.editor.username} ${profil.editor.last_name} ${profil.editor.first_name}` : '. . .'}</p>

              <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root} style={{ maxWidth: 340 }}>
                <ListItem button>
                  <ListItemText primary="Identifiant" />
                  {profil ? profil.id : '...'}
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Sex" />
                  {profil ? profil.sex : '...'}
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Age" />
                  {age} ans
                </ListItem>

                <ListItem button onClick={handleClick}>
                  <ListItemText primary="Adresse" />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem button className={classes.nested}>
                      <ListItemIcon>
                        <PinDropIcon />
                      </ListItemIcon>
                      <ListItemText primary={profil ? profil.adress : '...'} />
                    </ListItem>
                  </List>
                </Collapse>
              </List>

              {auth.user.permisions.includes('workplace.change_patient') ? (
                <Link to={`/lax_medic/work-place/patient-profiles-${patientId}/modifier-profile-patient`}>
                  <Button color="primary" round>
                    Modifier
                  </Button>
                </Link>
              ) : null}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
