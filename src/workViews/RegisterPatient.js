import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import Button from '@mui/material/Button';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import CardBody from 'components/Card/CardBody';
import CardFooter from 'components/Card/CardFooter';
import { green, orange } from '@mui/material/colors';

import { useHistory } from 'react-router-dom';

import SaveIcon from '@mui/icons-material/Save';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

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
  },
  margin: {
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
export default function RegisterPatient({ addCallBack, deleteCallBack, webSocket }) {
  const classes = useStyles();
  const history = useHistory();
  const [age, setAge] = useState(0);
  const [sex, setSex] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(addCallBack);
    addCallBack({
      id: 'RegisterPatient',
      type: ['create_patient'],

      run: (data) => {
        console.log('je suis la depuis RegisterPatient');
        console.log(data);
        if (data.type === 'create_patient' && data.status === 'success') {
          setTimeout(() => {
            history.push(`/lax_medic/work-place/patient-profiles-${data.content.patient_id}/enregistrer-une-fiche`);
          }, 1000);
        }
      }
    });
    return () => {
      deleteCallBack('RegisterPatient');
    };
  }, [addCallBack, deleteCallBack, history]);

  const handleChange = (event) => {
    data[event.target.name] = event.target.value;
    console.log(data);
    if (event.target.name === 'birth_date') {
      const patientAge = new Date(new Date() - new Date(event.target.value));
      setAge(patientAge.getYear() - 70);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    console.log('submit patient');
    console.log(webSocket);
    webSocket.send(
      JSON.stringify({
        type: 'create_patient',
        content: data
      })
    );
  };

  return (
    <div>
      <GridContainer container spacing={3} justify="center">
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <form className={classes.root} onChange={handleChange} onSubmit={handleSubmit}>
              <CardHeader color="info">
                <h4 className={classes.cardTitleWhite}>Enregistrer un patient</h4>
                {/*
                  <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
              </CardHeader>
              <CardBody>
                <FormControl fullWidth className={classes.margin}>
                  <TextField required id="Nome-basic" name="username" label="Nome" />
                </FormControl>
                <FormControl fullWidth className={classes.margin}>
                  <TextField required id="standard-basic" name="last_name" label="Post-nom" />
                </FormControl>
                <FormControl fullWidth className={classes.margin}>
                  <TextField required id="standard-basic" name="first_name" label="Prenom" />
                </FormControl>
                <FormControl fullWidth className={classes.margin}>
                  <TextField
                    required
                    name="sex"
                    select
                    value={sex}
                    onChange={(e) => {
                      setSex(e.target.value);
                      handleChange(e);
                    }}
                    label="Sex"
                  >
                    <MenuItem value="M">Masculin</MenuItem>
                    <MenuItem value="F">Feminin</MenuItem>
                  </TextField>
                </FormControl>
                <Grid container className={classes.margin}>
                  <Grid item xs={10} sm={10} md={10}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        id="date"
                        name="birth_date"
                        label="date de naissance"
                        type="date"
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={2} sm={2} md={2}>
                    <div
                      style={{
                        fontSize: 25,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <strong style={{ color: orange[700] }}>{age}</strong>
                      <small style={{ color: '#aaa' }}>ans</small>
                    </div>
                  </Grid>
                </Grid>
                <FormControl fullWidth className={classes.margin}>
                  <TextField required id="adresse-basic" name="adress" label="Adresse" />
                </FormControl>
              </CardBody>
              <CardFooter>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={loading}
                  className={classes.button}
                  startIcon={<SaveIcon />}
                >
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  Enregistrer
                </Button>
                <br />
              </CardFooter>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
