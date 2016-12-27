import { safeConfigGet } from '../shared/utils/config';

if (process.env.NODE_ENV === 'production') {
  if (safeConfigGet(['serviceWorker', 'enabled'])) {
    const OfflinePluginRuntime = require('offline-plugin/runtime'); // eslint-disable-line global-require

    OfflinePluginRuntime.install({
      onUpdating: () => undefined,
      onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
      onUpdated: () => window.location.reload(),
      onUpdateFailed: () => undefined,
    });
  }
}
