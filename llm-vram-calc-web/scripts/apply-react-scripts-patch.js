'use strict';

/**
 * Apply the CRA 5 + webpack-dev-server 5 patch when patch-package is present.
 *
 * patch-package lives in devDependencies. Production installs such as
 * `npm ci --omit=dev` do not need the WDS 5 start-path patch (`yarn build`
 * does not load webpackDevServer.config.js). Skip instead of failing.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const webRoot = path.join(__dirname, '..');
let patchPackageCli;

try {
  patchPackageCli = require.resolve('patch-package');
} catch (err) {
  process.stdout.write(
    'patch-package is not installed (omit=dev / production install); skipping CRA webpack-dev-server patch.\n'
  );
  process.exit(0);
}

const result = spawnSync(process.execPath, [patchPackageCli, '--use-yarn'], {
  cwd: webRoot,
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
