import React, { useState, Suspense } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import makeStyles from '@mui/styles/makeStyles';

import CircularProgress from '@mui/material/CircularProgress';

import Grid from '@mui/material/Grid';

// @mui/material
import Button from '@mui/material/Button';
// @mui/icons-material
import BugReport from '@mui/icons-material/BugReport';
import Code from '@mui/icons-material/Code';
import Cloud from '@mui/icons-material/Cloud';
import EditIcon from '@mui/icons-material/Edit';
import CreateIcon from '@mui/icons-material/NoteAddOutlined';

// core components
import GridItem from 'components/Grid/GridItem.js';
import Table from 'components/Table/Table.js';
import Tasks from 'components/Tasks/Tasks.js';
import CustomTabs from 'components/CustomTabs/CustomTabs.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';

import { bugs, website, server } from 'variables/general.js';

import styles from 'assets/jss/material-dashboard-react/views/dashboardStyle.js';
import Reseach from '../Reseach';

const PatientList = React.lazy(() => import('./PatientList'));

const useStyles = makeStyles(styles);

const useStyle = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 10
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

export default function ReceptionHome({ addCallBack, deleteCallBack, webSocket }) {
  const classes = useStyles();
  const classe = useStyle();
  const [seachPatientsList, setSeachPatientsList] = React.useState([]);

  React.useEffect(() => {
    webSocket.send(
      JSON.stringify({
        type: 'get_seach_patients_list',
        content: {}
      })
    );

    addCallBack({
      id: 'ReceptionHome',
      type: ['seach_patients_list'],

      run: (data) => {
        console.log('je suis là depuis ReceptionHome');
        console.log(data);
        if (data.type === 'seach_patients_list') {
          setSeachPatientsList(data.content.patients);
        }
      }
    });
    return () => {
      deleteCallBack('ReceptionHome');
    };
  }, []);

  return (
    <div>
      <Grid container spacing={3} justifyContent="space-between">
        <Grid item xs={12} sm={12} md={6}>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item>
              <Link to="/lax_medic/work-place/reception/enregistrer-un-patient">
                <Button variant="contained" color="primary" startIcon={<EditIcon />}>
                  Enregistrer un patient
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/lax_medic/work-place/reception/enregistrer-une-fiche">
                <Button variant="contained" color="primary" startIcon={<CreateIcon />}>
                  Créer une fiche
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Link to="/lax_medic/work-place/reception/Patient-list">
            <Button variant="outline" color="secondary" startIcon={<CreateIcon />}>
              Liste des patients
            </Button>
          </Link>
        </Grid>
      </Grid>
      <br />
      <br />

      <Reseach seachPatientsList={seachPatientsList} />

      <Suspense fallback={<LinearBuffer />}>
        <Switch>
          <Route path="/lax_medic/work-place/reception/Patient-list">
            <PatientList addCallBack={addCallBack} deleteCallBack={deleteCallBack} webSocket={webSocket} />
          </Route>
          <Route path="">
            <Home />
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
}

const Home = () => {
  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Patients internés</h4>
              <p className={classes.cardCategoryWhite}>New employees on 15th September, 2016</p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={['ID', 'Name', 'Salary', 'Country']}
                tableData={[
                  ['1', 'Dakota Rice', '$36,738', 'Niger'],
                  ['2', 'Minerva Hooper', '$23,789', 'Curaçao'],
                  ['3', 'Sage Rodriguez', '$56,142', 'Netherlands'],
                  ['4', 'Philip Chaney', '$38,735', 'Korea, South']
                ]}
              />
            </CardBody>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <CustomTabs
            title="Tasks:"
            headerColor="primary"
            tabs={[
              {
                tabName: 'Ambulatoire',
                tabIcon: BugReport,
                tabContent: <Tasks checkedIndexes={[0, 3]} tasksIndexes={[0, 1, 2, 3]} tasks={bugs} />
              },
              {
                tabName: 'Website',
                tabIcon: Code,
                tabContent: <Tasks checkedIndexes={[0]} tasksIndexes={[0, 1]} tasks={website} />
              },
              {
                tabName: 'Server',
                tabIcon: Cloud,
                tabContent: <Tasks checkedIndexes={[1]} tasksIndexes={[0, 1, 2]} tasks={server} />
              }
            ]}
          />
        </Grid>
      </Grid>
    </div>
  );
};

function LinearBuffer() {
  const useStyles = makeStyles({
    root: {
      position: 'fixed',
      height: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'white',
      alignItems: 'center'
    }
  });
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
}
