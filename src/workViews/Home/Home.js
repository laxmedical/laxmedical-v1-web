import React, { Suspense } from 'react';
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
import PatientIcon from '@mui/icons-material/PersonOutline';

// core components
import Table from 'components/Table/Table';
import Tasks from 'components/Tasks/Tasks';
import CustomTabs from 'components/CustomTabs/CustomTabs';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';

import { bugs, website, server } from 'variables/general';
import styles from 'assets/jss/material-dashboard-react/views/dashboardStyle';
import Reseach from '../Reseach';
import { useAuth } from '../../App';

const PatientList = React.lazy(() => import('../Reception/PatientList'));

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

  const auth = useAuth();

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
      <br />
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          {auth.user.permisions.includes('workplace.add_patient') ? (
            <Link to="/lax_medic/work-place/enregistrer-un-patient">
              <Button variant="contained" color="primary" startIcon={<EditIcon />}>
                Enregistrer un patient
              </Button>
            </Link>
          ) : null}
        </Grid>
        <Grid item>
          <Link to="/lax_medic/work-place/Patient-list">
            <Button variant="outlined" color="primary" startIcon={<PatientIcon />}>
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
          <Route path="/lax_medic/work-place/Patient-list">
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
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>Nouveaux patients</h4>
              <p className={classes.cardCategoryWhite}>New employees on 15th September, 2016</p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={['ID', 'Name', 'Sex', 'Age']}
                tableData={[
                  ['1', 'Merdi Rice', 'F', '23 ans'],
                  ['2', 'Elie Hooper', 'M', '40 ans'],
                  ['3', 'Sage Rodriguez', 'M', '36 ans'],
                  ['4', 'Philip Chaney', 'F', '28 ans']
                ]}
              />
            </CardBody>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <CustomTabs
            title=""
            headerColor="success"
            tabs={[
              {
                tabName: 'Ambulatoire',
                tabIcon: BugReport,
                tabContent: (
                  <Table
                    tableHeaderColor="warning"
                    tableHead={['ID', 'Name', 'Sex', 'Age']}
                    tableData={[
                      ['1', 'Dakota Rice', 'F', '23 ans'],
                      ['2', 'Minerva Hooper', 'M', '40 ans'],
                      ['3', 'Sage Rodriguez', 'M', '36 ans'],
                      ['4', 'Philip Chaney', 'F', '28 ans']
                    ]}
                  />
                )
              },
              {
                tabName: 'urgence',
                tabIcon: Code,
                tabContent: <Tasks checkedIndexes={[0]} tasksIndexes={[0, 1]} tasks={website} />
              },
              {
                tabName: 'Décédé',
                tabIcon: Cloud,
                tabContent: (
                  <Table
                    tableHeaderColor="warning"
                    tableHead={['ID', 'Name', 'Sex', 'Age']}
                    tableData={[
                      ['1', 'Dakota Rice', 'F', '23 ans'],
                      ['2', 'Minerva Hooper', 'M', '40 ans'],
                      ['3', 'Sage Rodriguez', 'M', '36 ans'],
                      ['4', 'Philip Chaney', 'F', '28 ans']
                    ]}
                  />
                )
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
      height: 'calc(100vh - 223px)',
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
