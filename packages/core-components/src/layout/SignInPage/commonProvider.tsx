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
import {
  ProviderComponent,
  ProviderLoader,
  SignInProvider,
  SignInProviderConfig,
} from './types';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { ForwardedError } from '@backstage/errors';
import { UserIdentity } from './UserIdentity';
import { useStyles } from './styles';
import GoogleIcon from './assets/GoogleIcon.svg';
import IndiciumLogo from './assets/company_logo_vertical.png';

const Component: ProviderComponent = ({
  config,
  onSignInStarted,
  onSignInSuccess,
  onSignInFailure,
}) => {
  const { apiRef, title } = config as SignInProviderConfig;
  const authApi = useApi(apiRef);
  const errorApi = useApi(errorApiRef);
  const classes = useStyles();

  const handleLogin = async () => {
    try {
      onSignInStarted();
      const identityResponse = await authApi.getBackstageIdentity({
        instantPopup: true,
      });
      if (!identityResponse) {
        onSignInFailure();
        throw new Error(
          `The ${title} provider is not configured to support sign-in`,
        );
      }

      const profile = await authApi.getProfile();

      onSignInSuccess(
        UserIdentity.create({
          identity: identityResponse.identity,
          profile,
          authApi,
        }),
      );
    } catch (error) {
      onSignInFailure();
      errorApi.post(new ForwardedError('Login failed', error));
    }
  };

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
            <div className={classes.buttonWrapper}>
              <div className={classes.wrapperIcon}>
                <img
                  src={GoogleIcon}
                  width={32}
                  height={32}
                  alt="Google Icon"
                />
              </div>
              <button className={classes.button} onClick={handleLogin}>
                Entrar com GOOGLE
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const loader: ProviderLoader = async (apis, apiRef) => {
  const authApi = apis.get(apiRef)!;

  const identityResponse = await authApi.getBackstageIdentity({
    optional: true,
  });

  if (!identityResponse) {
    return undefined;
  }

  const profile = await authApi.getProfile();

  return UserIdentity.create({
    identity: identityResponse.identity,
    profile,
    authApi,
  });
};

export const commonProvider: SignInProvider = { Component, loader };
