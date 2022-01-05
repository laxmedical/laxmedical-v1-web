import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
// core components
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardAvatar from 'components/Card/CardAvatar';
import CardBody from 'components/Card/CardBody';
import CardFooter from 'components/Card/CardFooter';
import GridContainer from 'components/Grid/GridContainer';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';

import { useHistory } from 'react-router-dom';

import SaveIcon from '@mui/icons-material/Save';

import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  margin: {},
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
  },
  formControl: {
    margin: '10px 0'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  }
}));

function getSteps() {
  return ['Résumé de la consultation', 'Récommandations'];
}

function getStepContent(step, classes) {
  switch (step) {
    case 0:
      return (
        <CardBody>
          <FormControl fullWidth className={classes.formControl}>
            <TextField required id="description-basic" name="note" label="Note" />
          </FormControl>
          <FormControl fullWidth className={classes.formControl}>
            <TextField required id="description-basic" name="conclusion" label="Conclusion" />
          </FormControl>
          <br />
          <br />
        </CardBody>
      );
    case 1:
      return 'An ad group contains one or more ads which target a shared set of keywords.';
    case 2:
      return `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`;
    default:
      return 'Unknown step';
  }
}

function VerticalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {/*
               */}

              {getStepContent(index, classes)}
              <div className={classes.actionsContainer}>
                <div>
                  <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                    Precedent
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
                    {activeStep === steps.length - 1 ? 'terminer' : 'Suivant'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <CardFooter>
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item>
                <Button onClick={handleReset} className={classes.button}>
                  Reset
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  className={classes.button}
                  startIcon={<SaveIcon />}
                >
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  Enregistrer
                </Button>
              </Grid>
            </Grid>
          </CardFooter>
        </Paper>
      )}
    </div>
  );
}

const data = {};

export default function ConsultationForm({ ficheId, patientId, addCallBack, deleteCallBack, webSocket }) {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(addCallBack);
    addCallBack({
      id: 'ConsultationForm',
      type: ['create_consultation'],

      run: (data) => {
        console.log('je suis la depuis ConsultationForm');
        console.log(data);
        if (data.type === 'create_consultation' && data.status === 'success') {
          setTimeout(() => {
            history.push(`/lax_medic/work-place/patient-profiles-${patientId}/fiche-${ficheId}/consultation`);
          }, 700);
        }
      }
    });
    return () => {
      deleteCallBack('ConsultationForm');
    };
  }, []);

  const handleChange = (event) => {
    data[event.target.name] = event.target.value;
    console.log(data);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    console.log('submit patient');
    console.log(webSocket);
    webSocket.send(
      JSON.stringify({
        type: 'create_consultation',
        content: {
          fiche_id: ficheId,
          ...data
        }
      })
    );
  };

  return (
    <div>
      <h3>Enregistrer une consultation</h3>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <form className={classes.root} onChange={handleChange} onSubmit={handleSubmit}>
            <VerticalLinearStepper />
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
