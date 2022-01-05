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
import DraftsIcon from '@mui/icons-material/Drafts';
import CreateIcon from '@mui/icons-material/Create';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

// core components
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardAvatar from 'components/Card/CardAvatar';
import CardBody from 'components/Card/CardBody';
import CardFooter from 'components/Card/CardFooter';

import avatar from 'assets/img/profilDefault.png';

import RegisterFiche from './Reception/RegisterFiche';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import Consultation from './Consultation';
import ConsultationForm from './ConsultationForm';
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

export default function Fiche({ patientId, addCallBack, deleteCallBack, webSocket }) {
  const classes = useStyles();
  const { ficheId } = useParams();
  const [fiche, setFiche] = useState(null);

  const auth = useAuth();

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    webSocket.send(
      JSON.stringify({
        type: 'get_fiche',
        content: {
          fiche_id: ficheId
        }
      })
    );

    addCallBack({
      id: 'Fiche',
      type: ['fiche'],

      run: (data) => {
        console.log('je suis la depuis Fiche');
        console.log(data);
        if (data.type === 'fiche' && data.status !== '404') {
          setFiche(data.content);
        }
      }
    });
    return () => {
      deleteCallBack('Fiche');
    };
  }, []);

  return (
    <div>
      <Switch>
        <Route path={`/lax_medic/work-place/patient-profiles-${patientId}/fiche-${ficheId}/paiemment`}>
          <RegisterFiche patientId={patientId} addCallBack={addCallBack} deleteCallBack={deleteCallBack} webSocket={webSocket} />
        </Route>
        <Route path="">
          <Card>
            <CardHeader color="info">
              <Grid container spacing={1} justifyContent="space-between">
                <Grid item>
                  <h3>Fiche en cours</h3>
                </Grid>
                <Grid item>
                  <h4>N°{fiche ? fiche.id : null}</h4>
                </Grid>
              </Grid>
              <p className={classes.cardCategoryWhite}>
                {fiche ? `Enrégistrée le ${new Date(fiche.created_date).toLocaleString()}` : null}
              </p>
            </CardHeader>
            <CardBody>
              <br />
              <Grid container spacing={2} justifyContent="space-between">
                {auth.user.permisions.includes('workplace.add_consultation') ? (
                  <Grid item>
                    <Link to={`/lax_medic/work-place/patient-profiles-${patientId}/fiche-${ficheId}/consultation_form`}>
                      <Button variant="outlined" color="primary" startIcon={<CreateIcon />}>
                        Consulter
                      </Button>
                    </Link>
                  </Grid>
                ) : null}
                <Grid item>
                  <Link to={`/lax_medic/work-place/patient-profiles-${patientId}/fiche-${4}`}>
                    <Button variant="outlined" color="primary">
                      Examiner
                    </Button>
                  </Link>
                </Grid>
              </Grid>
              <br />
              {fiche ? (
                <div>
                  <Switch>
                    <Route path={`/lax_medic/work-place/patient-profiles-${patientId}/fiche-:ficheId/paiement`}>
                      <Grid container spacing={2} justifyContent="flex-end">
                        <Link to={`/lax_medic/work-place/patient-profiles-${patientId}`}>
                          <Button variant="outlined">Retour</Button>
                        </Link>
                      </Grid>
                      <RegisterFiche
                        patientId={patientId}
                        addCallBack={addCallBack}
                        deleteCallBack={deleteCallBack}
                        webSocket={webSocket}
                      />
                    </Route>
                    <Route path={`/lax_medic/work-place/patient-profiles-${patientId}/fiche-${ficheId}/consultation_form`}>
                      <ConsultationForm
                        ficheId={ficheId}
                        patientId={patientId}
                        addCallBack={addCallBack}
                        deleteCallBack={deleteCallBack}
                        webSocket={webSocket}
                      />
                    </Route>
                    <Route path={`/lax_medic/work-place/patient-profiles-${patientId}/fiche-:ficheId/consultation`}>
                      <Consultation
                        patientId={patientId}
                        ficheId={ficheId}
                        fichesList={null}
                        addCallBack={addCallBack}
                        deleteCallBack={deleteCallBack}
                        webSocket={webSocket}
                      />
                    </Route>

                    <Route path="">
                      <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
                        <ListItem button onClick={handleClick}>
                          <ListItemText primary="Données à l'arrivé" />
                          {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            <ListItem button className={classes.nested}>
                              <div>
                                <strong>Description</strong>
                                <blockquote>{fiche.description}</blockquote>
                              </div>
                            </ListItem>
                            <ListItem button className={classes.nested}>
                              <ListItemIcon>
                                <DraftsIcon />
                              </ListItemIcon>
                              <ListItemText primary="temperature" />
                              {fiche.temperature}
                            </ListItem>
                            <ListItem button className={classes.nested}>
                              <ListItemIcon>
                                <DraftsIcon />
                              </ListItemIcon>
                              <ListItemText primary="poid" />
                              {fiche.poid}
                            </ListItem>
                          </List>
                        </Collapse>
                      </List>

                      <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                          <ListSubheader component="div" id="nested-list-subheader">
                            Options
                          </ListSubheader>
                        }
                        className={classes.root}
                      >
                        <Link to={`/lax_medic/work-place/patient-profiles-${patientId}/paiement`}>
                          <ListItem button>
                            <ListItemIcon>
                              <AccountBalanceWalletIcon />
                            </ListItemIcon>
                            <ListItemText primary="Paiement" />
                          </ListItem>
                        </Link>
                        <Link to={`/lax_medic/work-place/patient-profiles-${patientId}/fiche-${ficheId}/consultation`}>
                          <ListItem button>
                            <ListItemIcon>
                              <AccessibilityNewIcon />
                            </ListItemIcon>
                            <ListItemText primary="Consultation" />
                          </ListItem>
                        </Link>
                      </List>
                    </Route>
                  </Switch>
                </div>
              ) : null}
            </CardBody>
            <CardFooter />
          </Card>
        </Route>
      </Switch>
    </div>
  );
}
