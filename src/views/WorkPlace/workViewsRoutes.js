import HomeIcon from '@mui/icons-material/HomeWorkTwoTone';
import CaisseIcon from '@mui/icons-material/AttachMoneyTwoTone';
import PharmaIcon from '@mui/icons-material/LocalHospitalTwoTone';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
// core components/views for Admin layout
import Home from 'workViews/Home/Home'; /*
import Reception from "workViews/Reception/Reception.js"; */
import Caisse from 'workViews/Caisse/Caisse';
import RegisterPatient from 'workViews/RegisterPatient';
import PatientProfile from 'workViews/PatientProfile';
// core components/views for RTL layout

const workViewsRoutes = [
  {
    path: '/patient-profiles-:patientId',
    name: 'profil',
    rtlName: 'لوحة القيادة',
    icon: PharmaIcon,
    component: PatientProfile,
    layout: '/lax_medic/work-place',
    hidden: true
  },
  {
    path: '/enregistrer-un-patient',
    name: 'RegisterPatient',
    rtlName: 'لوحة القيادة',
    icon: HomeIcon,
    component: RegisterPatient,
    layout: '/lax_medic/work-place',
    hidden: false
  },
  {
    path: '/caisse',
    name: 'Caisse',
    rtlName: 'لوحة القيادة',
    icon: CaisseIcon,
    component: Caisse,
    layout: '/lax_medic/work-place',
    hidden: false
  },
  {
    path: '/consultation',
    name: 'Consultation',
    rtlName: 'لوحة القيادة',
    icon: AirlineSeatReclineExtraIcon,
    component: Caisse,
    layout: '/lax_medic/work-place',
    hidden: false
  },
  {
    path: '/',
    name: 'profil',
    rtlName: 'لوحة القيادة',
    icon: PharmaIcon,
    component: Home,
    layout: '/lax_medic/work-place',
    hidden: false
  }
];

export default workViewsRoutes;
