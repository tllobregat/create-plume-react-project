import { configureGlobalInjector, Injector } from 'plume-ts-di';
import './polyfill-loader';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'micro-observables/batchingForReactDom';
import { Logger } from 'simple-logging-system';
import installApiModule from './api/api-module';
import App from './components/App';
import installComponentsModule from './components/components-module';
import installI18nModule from './i18n/i18n-module';
import LocaleService from './i18n/locale/LocaleService';
import initializeLocalizedDate from './i18n/messages/LocalizedDate';
import { RouteProvider } from './router/Router';
import installServicesModule from './services/services-module';

const currentMillis: number = Date.now();
const logger: Logger = new Logger('index');

const injector: Injector = new Injector();
installServicesModule(injector);
installComponentsModule(injector);
installApiModule(injector);
installI18nModule(injector);

injector.initializeSingletonInstances();

configureGlobalInjector(injector);

// dayjs
initializeLocalizedDate(injector.getInstance(LocaleService));

const reactApp: JSX.Element = (
  <React.StrictMode>
    <RouteProvider>
      <App />
    </RouteProvider>
  </React.StrictMode>
);
const rootElement: HTMLElement | null = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}
createRoot(rootElement).render(reactApp);

logger.info(`Application started in ${Date.now() - currentMillis}ms`);
