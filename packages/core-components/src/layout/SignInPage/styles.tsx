/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

export type SignInPageClassKey = 'container' | 'item';

export const useStyles = makeStyles(
  {
    root: {
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#13A0DB',
    },
    content: {
      display: 'flex',
    },
    container: {
      padding: 0,
      listStyle: 'none',
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '400px',
      margin: 0,
      padding: 0,
    },
    card: {
      backgroundColor: '#FFFFFF',
      width: '600px',
      maxHeight: 'fit-content',
      padding: '2.5rem 5rem',
    },
    cardImage: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '3rem',
    },
    cardText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      fontFamily: "'Roboto', sans-serif",
      color: '#545859',
    },
    wrapper: {
      backgroundColor: '#13A0DB',
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
      width: '100%',
    },
    wrapperIcon: {
      padding: '0 16px',
      display: 'flex',
    },
    buttonWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      borderRadius: '25px',
      backgroundColor: '#F2F2F2',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      fontSize: '1.2rem',
      color: '#FFFFFF',
      backgroundColor: '#F7A600',
      width: '100%',
      padding: '.25rem 0',
      borderRadius: '1.75rem',
      border: `0.4rem solid #FFFFFF`,
      boxShadow: '0px 5px 17px rgba(0, 0, 0, 0.15)',
      textTransform: 'uppercase',
      cursor: 'pointer',
      '& button:hover': {
        backgroundColor: '#DB9300',
      },
    },
  },
  { name: 'BackstageSignInPage' },
);

export const GridItem = ({ children }: { children: JSX.Element }) => {
  const classes = useStyles();

  return (
    <Grid component="li" item classes={classes}>
      {children}
    </Grid>
  );
};
