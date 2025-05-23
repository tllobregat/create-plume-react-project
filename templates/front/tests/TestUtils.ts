import { Injector } from 'plume-ts-di';
import installServicesModule from '../src/services/services-module';
import installComponentsModule from '../src/components/components-module';
import installApiModule from '../src/api/api-module';

export const waitTimeout = (durationInMillis: number) => new Promise(
  (resolve: (value: (PromiseLike<unknown> | unknown)) => void) => {
    setTimeout(resolve, durationInMillis);
  },
);

export function createInjector(): Injector {
  const injector: Injector = new Injector();
  installServicesModule(injector);
  installComponentsModule(injector);
  installApiModule(injector);
  return injector;
}
