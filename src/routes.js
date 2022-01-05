/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React from 'react';

// @mui/icons-material
/*
import Home from "@mui/icons-material/HomeWorkTwoTone"; */
import TaskIcon from '@mui/icons-material/WorkTwoTone';
import Notifications from '@mui/icons-material/NotificationsActiveTwoTone';
import Person from '@mui/icons-material/PersonTwoTone';
import ChatIcon from '@mui/icons-material/ChatBubbleTwoTone';
import LoginIcon from '@mui/icons-material/ExitToAppTwoTone';
import HomeIcon from '@mui/icons-material/HomeTwoTone';
import EqualizerSharpIcon from '@mui/icons-material/EqualizerSharp';
// core components/views for Admin layout
// const Login = React.lazy(() => import("layouts/Login"));
const Logout = React.lazy(() => import('layouts/Logout'));
const WorkPlace = React.lazy(() => import('views/WorkPlace/WorkPlace'));
const ChatSpace = React.lazy(() => import('views/ChatSpace/ChatSpace'));
const HomePage = React.lazy(() => import('views/Home/Home'));
const UserProfile = React.lazy(() => import('views/UserProfile/UserProfile'));
const Typography = React.lazy(() => import('views/Typography/Typography'));
const NotificationsPage = React.lazy(() => import('views/Notifications/Notifications'));
// core components/views for RTL layout

const dashboardRoutes = [
  {
    path: '/acceuil',
    name: 'Acceuil',
    rtlName: 'طباعة',
    icon: HomeIcon,
    component: Typography,
    layout: '/lax_medic'
  },
  {
    path: '/work-place',
    name: 'Lieu de Travail',
    rtlName: 'قائمة الجدول',
    icon: TaskIcon,
    component: WorkPlace,
    layout: '/lax_medic'
  },
  {
    path: '/statics',
    name: 'Statiques',
    rtlName: 'لوحة القيادة',
    icon: EqualizerSharpIcon,
    component: HomePage,
    layout: '/lax_medic'
  },
  {
    path: '/notifications',
    name: 'Notifications',
    rtlName: 'إخطارات',
    icon: Notifications,
    component: NotificationsPage,
    layout: '/lax_medic'
  },
  {
    path: '/chat-space',
    name: 'Chat espace',
    rtlName: 'الرموز',
    icon: ChatIcon,
    component: ChatSpace,
    layout: '/lax_medic'
  },
  {
    path: '/user',
    name: 'Mon compte',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: Person,
    component: UserProfile,
    layout: '/lax_medic'
  } /*
  {
    path: "/login",
    name: "Deconnexion",
    rtlName: "لوحة القيادة",
    icon: LoginIcon,
    component: Login,
    layout: ""
  }, */,
  {
    path: '/logout',
    name: 'Deconnexion',
    rtlName: 'لوحة القيادة',
    icon: LoginIcon,
    component: Logout,
    layout: '/lax_medic'
  }
];

export default dashboardRoutes;
