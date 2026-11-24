import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

const win = window as Window & {
  QuadraAndroid?: unknown;
  Capacitor?: {isNativePlatform?: () => boolean};
};
const isNativeCapacitor =
  Boolean(win.QuadraAndroid) || Boolean(win.Capacitor?.isNativePlatform?.());

if (isNativeCapacitor) {
  // Capacitor bundles dist/ locally; unregister any old SW so WebView never serves stale cached HTML or reloads
  if ('serviceWorker' in navigator) {
    void navigator.serviceWorker
      .getRegistrations()
      .then((regs) => Promise.all(regs.map((r) => r.unregister())))
      .catch(() => {});
  }
} else {
  // Silent offline caching without forced controllerchange page reloads
  registerSW({
    immediate: false,
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
