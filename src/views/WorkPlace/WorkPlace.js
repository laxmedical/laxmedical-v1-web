import React from 'react';
import { createBrowserHistory } from 'history';
import { Switch, Route, Link } from 'react-router-dom';

import makeStyles from '@mui/styles/makeStyles';
// @mui/material
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
// @mui/icons-material
// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardIcon from 'components/Card/CardIcon.js';
import CardFooter from 'components/Card/CardFooter.js';

import styles from 'assets/jss/material-dashboard-react/views/dashboardStyle.js';
import workViewsRoutes from './workViewsRoutes.js';

const useStyles = makeStyles(styles);

export default function WorkPlace({ addCallBack, deleteCallBack, webSocket }) {
  const classes = useStyles();
  return (
    <div>
      {' '}
      {/*
          {window.location.pathname=== "/lax_medic/work-place"
            ?       <GridContainer>
            {workViewsRoutes.map((prop, key) => {
                return !prop.hidden
                    ? (<GridItem xs={12} sm={6} md={4} key={key}>
                        <Card>
                          <CardHeader color="warning" stats icon>
                            <CardIcon color="info">
                            <Icon><prop.icon/></Icon>
                            </CardIcon>
                            <p className={classes.cardCategory}>{prop.name}</p>
                            <h3 className={classes.cardTitle}>
                            {prop.name}
                            </h3>
                          </CardHeader>
                          <CardFooter stats>
                            <div className={classes.stats}>
                              <Link to={prop.layout + prop.path}>
                              <Button color="primary">
                                Entrer
                              </Button>
                              </Link>
                            </div>
                          </CardFooter>
                        </Card>
                      </GridItem>
                    )
                    : null
                }
              )
            }
            </GridContainer>
            : ''}     */}
      <Switch>
        {workViewsRoutes.map((prop, key) => (
          <Route path={prop.layout + prop.path} key={key}>
            <prop.component addCallBack={addCallBack} deleteCallBack={deleteCallBack} webSocket={webSocket} />
          </Route>
        ))}
      </Switch>
    </div>
  );
}
