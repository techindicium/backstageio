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

import mockFs from 'mock-fs';
import { Lockfile } from './Lockfile';

const LEGACY_HEADER = `# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1

`;

const MODERN_HEADER = `# This file is generated by running "yarn install" inside your project.
# Manual changes might be lost - proceed with caution!

__metadata:
  version: 6
  cacheKey: 8
`;

describe('New Lockfile', () => {
  afterEach(() => {
    mockFs.restore();
  });

  describe('diff', () => {
    const lockfileLegacyA = Lockfile.parse(`${LEGACY_HEADER}
a@^1:
  version "1.0.1"
  resolved "https://my-registry/a-1.0.01.tgz#abc123"
  integrity sha512-xyz
  dependencies:
    b "^2"

b@3:
  version "3.0.1"
  integrity sha512-abc1

b@2.0.x:
  version "2.0.1"
  integrity sha512-abc2

b@^2:
  version "2.0.0"
  integrity sha512-abc3

c@^1:
  version "1.0.1"
  integrity x
`);

    const lockfileLegacyB = Lockfile.parse(`${LEGACY_HEADER}
a@^1:
  version "1.0.1"
  resolved "https://my-registry/a-1.0.01.tgz#abc123"
  integrity sha512-xyz-other
  dependencies:
    b "^2"

b@2.0.x, b@^2:
  version "2.0.0"
  integrity sha512-abc3

b@4:
  version "4.0.0"
  integrity sha512-abc

d@^1:
  version "1.0.1"
  integrity x
`);

    const lockfileModernA = Lockfile.parse(`${MODERN_HEADER}
"a@npm:^1":
  version: "1.0.1"
  resolved: "https://my-registry/a-1.0.01.tgz#abc123"
  checksum: sha512-xyz
  dependencies:
    b: "^2"

"b@npm:3":
  version: "3.0.1"
  checksum: sha512-abc1

"b@npm:2.0.x":
  version: "2.0.1"
  checksum: sha512-abc2

"b@npm:^2":
  version: "2.0.0"
  checksum: sha512-abc3

"c@npm:^1":
  version: "1.0.1"
  checksum: x
`);

    const lockfileModernB = Lockfile.parse(`${MODERN_HEADER}
"a@npm:^1":
  version: "1.0.1"
  resolution: "a@npm:1.0.1"
  checksum: sha512-xyz-other
  dependencies:
    b: "^2"

"b@npm:2.0.x, b@npm:^2":
  version: "2.0.0"
  checksum: sha512-abc3

"b@npm:4":
  version: "4.0.0"
  checksum: sha512-abc

"d@npm:^1":
  version: "1.0.1"
  checksum: x
`);

    it('should diff two legacy lockfiles', async () => {
      expect(lockfileLegacyA.diff(lockfileLegacyB)).toEqual({
        added: [
          { name: 'b', range: '3' },
          { name: 'c', range: '^1' },
        ],
        changed: [
          { name: 'a', range: '^1' },
          { name: 'b', range: '2.0.x' },
        ],
        removed: [
          { name: 'b', range: '4' },
          { name: 'd', range: '^1' },
        ],
      });
      expect(lockfileLegacyB.diff(lockfileLegacyA)).toEqual({
        added: [
          { name: 'b', range: '4' },
          { name: 'd', range: '^1' },
        ],
        changed: [
          { name: 'a', range: '^1' },
          { name: 'b', range: '2.0.x' },
        ],
        removed: [
          { name: 'b', range: '3' },
          { name: 'c', range: '^1' },
        ],
      });
    });

    it('should diff two modern lockfiles', async () => {
      expect(lockfileModernA.diff(lockfileModernB)).toEqual({
        added: [
          { name: 'b', range: '3' },
          { name: 'c', range: '^1' },
        ],
        changed: [
          { name: 'a', range: '^1' },
          { name: 'b', range: '2.0.x' },
        ],
        removed: [
          { name: 'b', range: '4' },
          { name: 'd', range: '^1' },
        ],
      });
      expect(lockfileModernB.diff(lockfileModernA)).toEqual({
        added: [
          { name: 'b', range: '4' },
          { name: 'd', range: '^1' },
        ],
        changed: [
          { name: 'a', range: '^1' },
          { name: 'b', range: '2.0.x' },
        ],
        removed: [
          { name: 'b', range: '3' },
          { name: 'c', range: '^1' },
        ],
      });
    });

    it('should diff legacy and modern lockfiles', async () => {
      expect(lockfileLegacyA.diff(lockfileModernB)).toEqual({
        added: [
          { name: 'b', range: '3' },
          { name: 'c', range: '^1' },
        ],
        changed: [
          { name: 'a', range: '^1' },
          { name: 'b', range: '2.0.x' },
        ],
        removed: [
          { name: 'b', range: '4' },
          { name: 'd', range: '^1' },
        ],
      });
      expect(lockfileLegacyB.diff(lockfileModernA)).toEqual({
        added: [
          { name: 'b', range: '4' },
          { name: 'd', range: '^1' },
        ],
        changed: [
          { name: 'a', range: '^1' },
          { name: 'b', range: '2.0.x' },
        ],
        removed: [
          { name: 'b', range: '3' },
          { name: 'c', range: '^1' },
        ],
      });
    });

    it('should diff modern and legacy lockfiles', async () => {
      expect(lockfileModernA.diff(lockfileLegacyB)).toEqual({
        added: [
          { name: 'b', range: '3' },
          { name: 'c', range: '^1' },
        ],
        changed: [
          { name: 'a', range: '^1' },
          { name: 'b', range: '2.0.x' },
        ],
        removed: [
          { name: 'b', range: '4' },
          { name: 'd', range: '^1' },
        ],
      });
      expect(lockfileModernB.diff(lockfileLegacyA)).toEqual({
        added: [
          { name: 'b', range: '4' },
          { name: 'd', range: '^1' },
        ],
        changed: [
          { name: 'a', range: '^1' },
          { name: 'b', range: '2.0.x' },
        ],
        removed: [
          { name: 'b', range: '3' },
          { name: 'c', range: '^1' },
        ],
      });
    });

    it('should handle workspace ranges', async () => {
      const lockfile = `${MODERN_HEADER}
"@backstage/app-defaults@workspace:^, @backstage/app-defaults@workspace:packages/app-defaults":
  version: 0.0.0-use.local
  resolution: "@backstage/app-defaults@workspace:packages/app-defaults"
  dependencies:
    "@backstage/cli": "workspace:^"
    "@backstage/core-app-api": "workspace:^"
    "@techindicium/core-components": "workspace:^"
    "@backstage/core-plugin-api": "workspace:^"
    "@backstage/plugin-permission-react": "workspace:^"
    "@backstage/test-utils": "workspace:^"
    "@backstage/theme": "workspace:^"
    "@material-ui/core": ^4.12.2
    "@material-ui/icons": ^4.9.1
    "@testing-library/jest-dom": ^5.10.1
    "@testing-library/react": ^12.1.3
    "@types/node": ^16.11.26
    "@types/react": ^16.13.1 || ^17.0.0
  peerDependencies:
    react: ^16.13.1 || ^17.0.0
    react-dom: ^16.13.1 || ^17.0.0
    react-router-dom: 6.0.0-beta.0 || ^6.3.0
  languageName: unknown
  linkType: soft

"@backstage/backend-app-api@workspace:^, @backstage/backend-app-api@workspace:packages/backend-app-api":
  version: 0.0.0-use.local
  resolution: "@backstage/backend-app-api@workspace:packages/backend-app-api"
  dependencies:
    "@backstage/backend-common": "workspace:^"
    "@backstage/backend-plugin-api": "workspace:^"
    "@backstage/backend-tasks": "workspace:^"
    "@backstage/cli": "workspace:^"
    "@backstage/errors": "workspace:^"
    "@backstage/plugin-permission-node": "workspace:^"
    express: ^4.17.1
    express-promise-router: ^4.1.0
    winston: ^3.2.1
  languageName: unknown
  linkType: soft
`;
      expect(Lockfile.parse(lockfile).diff(Lockfile.parse(lockfile))).toEqual({
        added: [],
        changed: [],
        removed: [],
      });
    });
  });

  describe('createSimplifiedDependencyGraph', () => {
    it('for modern lockfile', () => {
      expect(
        Lockfile.parse(
          `${MODERN_HEADER}
"@backstage/app-defaults@workspace:^, @backstage/app-defaults@workspace:packages/app-defaults":
  version: 0.0.0-use.local
  resolution: "@backstage/app-defaults@workspace:packages/app-defaults"
  dependencies:
    "@backstage/cli": "workspace:^"
    "@backstage/core-app-api": "workspace:^"
    "@techindicium/core-components": "workspace:^"
    "@backstage/core-plugin-api": "workspace:^"
    "@backstage/plugin-permission-react": "workspace:^"
    "@backstage/test-utils": "workspace:^"
    "@backstage/theme": "workspace:^"
    "@material-ui/core": ^4.12.2
    "@material-ui/icons": ^4.9.1
    "@testing-library/jest-dom": ^5.10.1
    "@testing-library/react": ^12.1.3
    "@types/node": ^16.11.26
    "@types/react": ^16.13.1 || ^17.0.0
  peerDependencies:
    react: ^16.13.1 || ^17.0.0
    react-dom: ^16.13.1 || ^17.0.0
    react-router-dom: 6.0.0-beta.0 || ^6.3.0
  languageName: unknown
  linkType: soft

"@backstage/backend-app-api@workspace:^, @backstage/backend-app-api@workspace:packages/backend-app-api":
  version: 0.0.0-use.local
  resolution: "@backstage/backend-app-api@workspace:packages/backend-app-api"
  dependencies:
    "@backstage/backend-common": "workspace:^"
    "@backstage/backend-plugin-api": "workspace:^"
    "@backstage/backend-tasks": "workspace:^"
    "@backstage/cli": "workspace:^"
    "@backstage/errors": "workspace:^"
    "@backstage/plugin-permission-node": "workspace:^"
    express: ^4.17.1
    express-promise-router: ^4.1.0
    winston: ^3.2.1
  languageName: unknown
  linkType: soft
`,
        ).createSimplifiedDependencyGraph(),
      ).toEqual(
        new Map([
          [
            '@backstage/app-defaults',
            new Set([
              '@backstage/cli',
              '@backstage/core-app-api',
              '@backstage/core-components',
              '@backstage/core-plugin-api',
              '@backstage/plugin-permission-react',
              '@backstage/test-utils',
              '@backstage/theme',
              '@material-ui/core',
              '@material-ui/icons',
              '@testing-library/jest-dom',
              '@testing-library/react',
              '@types/node',
              '@types/react',
              'react',
              'react-dom',
              'react-router-dom',
            ]),
          ],
          [
            '@backstage/backend-app-api',
            new Set([
              '@backstage/backend-common',
              '@backstage/backend-plugin-api',
              '@backstage/backend-tasks',
              '@backstage/cli',
              '@backstage/errors',
              '@backstage/plugin-permission-node',
              'express',
              'express-promise-router',
              'winston',
            ]),
          ],
        ]),
      );
    });

    it('for simple lockfile without dependencies', () => {
      expect(
        Lockfile.parse(
          `${MODERN_HEADER}
"a@npm:^1":
  version: "1.0.1"

"b@npm:3":
  version: "3.0.1"

"b@npm:2.0.x":
  version: "2.0.1"
  checksum: sha512-abc2
`,
        ).createSimplifiedDependencyGraph(),
      ).toEqual(
        new Map([
          ['a', new Set()],
          ['b', new Set()],
        ]),
      );
    });

    it('for lockfile with dependencies', () => {
      expect(
        Lockfile.parse(
          `${MODERN_HEADER}
"a@npm:^1":
  version: "1.0.1"
  dependencies:
    b: "^2"

"b@npm:3":
  version: "3.0.1"
  checksum: sha512-abc1

"b@npm:2.0.x":
  version: "2.0.1"
  checksum: sha512-abc2
  dependencies:
    c: "^1"

"b@npm:^2":
  version: "2.0.0"
  checksum: sha512-abc3
  peerDependencies:
    d: "^1"

"c@npm:^1":
  version: "1.0.1"

"d@npm:^1":
  version: "1.0.2"
`,
        ).createSimplifiedDependencyGraph(),
      ).toEqual(
        new Map([
          ['a', new Set(['b'])],
          ['b', new Set(['c', 'd'])],
          ['c', new Set()],
          ['d', new Set()],
        ]),
      );
    });

    it('for legacy lockfile', () => {
      expect(
        Lockfile.parse(
          `${LEGACY_HEADER}
a@^1:
  version "1.0.1"
  dependencies:
    b "^2"

b@3:
  version "3.0.1"
  integrity sha512-abc1

b@2.0.x:
  version "2.0.1"
  integrity sha512-abc2
  dependencies:
    c "^1"

b@^2:
  version "2.0.0"
  integrity sha512-abc3
  dependencies:
    d "^1"

c@^1:
  version "1.0.1"
  integrity x

d@^1:
  version "1.0.1"
  integrity x
`,
        ).createSimplifiedDependencyGraph(),
      ).toEqual(
        new Map([
          ['a', new Set(['b'])],
          ['b', new Set(['c', 'd'])],
          ['c', new Set()],
          ['d', new Set()],
        ]),
      );
    });
  });
});
