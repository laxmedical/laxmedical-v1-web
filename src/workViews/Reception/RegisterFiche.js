import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
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

const marks = [
  {
    value: 10,
    label: '10°C'
  },
  {
    value: 25,
    label: '25°C'
  },
  {
    value: 35,
    label: '35°C'
  },
  {
    value: 50,
    label: '50°C'
  }
];

const styles = {
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
  }
};

const useStyles = makeStyles(styles);
const data = {};
function valuetext(value) {
  console.log(value);
  data.temperature = value;
  return `${value}°C`;
}
export default function RegisterFiche({ patientId, addCallBack, deleteCallBack, webSocket }) {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(addCallBack);
    addCallBack({
      id: 'RegisterFiche',
      type: ['create_fiche'],

      run: (data) => {
        console.log('je suis la depuis RegisterPatient');
        console.log(data);
        if (data.type === 'create_fiche' && data.status === 'success') {
          setTimeout(() => {
            history.push(`/lax_medic/work-place/patient-profiles-${patientId}`);
          }, 1000);
        }
      }
    });
    return () => {
      deleteCallBack('RegisterFiche');
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
        type: 'create_fiche',
        content: {
          patient: patientId,
          ...data
        }
      })
    );
  };

  return (
    <div>
      <Card>
        <CardBody>
          <h3>Enregistrer une fiche</h3>
          <p>pour ce patient</p>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <form className={classes.root} onChange={handleChange} onSubmit={handleSubmit}>
                <CardBody>
                  <FormControl fullWidth>
                    <TextField name="poid" id="standard-number" label="Poid" type="number" />
                  </FormControl>
                  <br />
                  <br />
                  <br />
                  <div className={classes.root}>
                    <Typography id="discrete-slider-always" gutterBottom>
                      Temparature
                    </Typography>
                    <Slider
                      defaultValue={32}
                      getAriaValueText={valuetext}
                      aria-labelledby="input-slider"
                      step={1}
                      marks={marks}
                      min={10}
                      max={50}
                      valueLabelDisplay="on"
                    />
                  </div>

                  <FormControl fullWidth className={classes.formControl}>
                    <TextField required id="description-basic" name="description" label="description" />
                  </FormControl>
                  <br />
                  <br />
                </CardBody>
                <CardFooter>
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
                </CardFooter>
              </form>
            </GridItem>
          </GridContainer>
        </CardBody>
        <CardFooter />
      </Card>
    </div>
  );
}
