import React, { Suspense } from 'react';
import { useHistory } from 'react-router-dom';

import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

// @mui/material
import Button from '@mui/material/Button';
// @mui/icons-material
import PatientIcon from '@mui/icons-material/PersonOutline';
import FicheIcon from '@mui/icons-material/NoteAddOutlined';

// core components
import GridItem from 'components/Grid/GridItem';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }
}))(InputBase);

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'green'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none'
      },
      '&:hover fieldset': {
        borderColor: 'yellow'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green'
      }
    }
  }
})(TextField);

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

export default function Reseach({ seachPatientsList }) {
  const classes = useStyle();
  const classe = useStyle();
  const [searchBy, setSearchBy] = React.useState('patient');

  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const history = useHistory();

  const defaultProps = {
    options: seachPatientsList,
    getOptionLabel: (option) => option.name
  };

  const handleChange = (event) => {
    setSearchBy(event.target.value);
  };

  return (
    <div className={classe.center}>
      <GridItem xs={12} sm={12} md={6}>
        <br />
        <Paper component="form" className={classe.root}>
          <IconButton className={classe.iconButton} aria-label="menu" size="large">
            {searchBy === 'patient' ? <PatientIcon /> : <FicheIcon />}
          </IconButton>

          <Autocomplete
            {...defaultProps}
            freeSolo
            value={value}
            onChange={(event, newValue) => {
              history.push(`/lax_medic/work-place/patient-profiles-${newValue.id}`);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="controllable-states-demo"
            style={{ width: '70%' }}
            renderInput={(params) => (
              <CssTextField
                {...params}
                placeholder={searchBy === 'patient' ? 'Recherhcer un patient' : 'Rechercher une fiche'}
                variant="outlined"
                id="outlined-size-small"
                size="small"
              />
            )}
          />
          {/*
    <IconButton type="submit" className={classe.iconButton} aria-label="search">
      <SearchIcon />
    </IconButton> */}
          <Divider orientation="vertical" />
          <FormControl>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={searchBy}
              onChange={handleChange}
              input={<BootstrapInput />}
            >
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="fiche">Fiche</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </GridItem>
    </div>
  );
}
