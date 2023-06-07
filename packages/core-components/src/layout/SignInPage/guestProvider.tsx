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
import Typography from '@material-ui/core/Typography';
import { ProviderComponent, ProviderLoader, SignInProvider } from './types';
import { GuestUserIdentity } from './GuestUserIdentity';
import { useStyles } from './styles';
import IndiciumLogo from './assets/company_logo_vertical.png';

const Component: ProviderComponent = ({ onSignInStarted, onSignInSuccess }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.card}>
          <div className={classes.cardImage}>
            <img src={IndiciumLogo} height={140} alt="Company Logo" />
          </div>
          <div className={classes.cardText}>
            <Typography>
              Para acessar o App você precisa entrar com a sua conta Google
              empresarial (@indicium.tech)
            </Typography>
            <button
              className={classes.button}
              onClick={() => {
                onSignInStarted();
                onSignInSuccess(new GuestUserIdentity());
              }}
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const loader: ProviderLoader = async () => {
  return new GuestUserIdentity();
};

export const guestProvider: SignInProvider = { Component, loader };
