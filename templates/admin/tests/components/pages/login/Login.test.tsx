import { cleanup, fireEvent, render } from '@testing-library/react';
import { http, HttpHandler, HttpResponse } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { configureGlobalInjector, Injector } from 'plume-ts-di';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import Login from '../../../../src/components/features/login/Login';
import { createInjector } from '../../../TestUtils';
import installI18nModule from '@i18n/i18n-module';

// Set up mock HTTP server with default handler
const restHandlers: HttpHandler[] = [
  http.post('/api/admin/session', () => {
    return HttpResponse.json(
      {
        errorCode: 'WRONG_LOGIN_OR_PASSWORD',
        statusArguments: [],
      },
      {
        status: 400,
      },
    );
  }),
];

const server: SetupServerApi = setupServer(...restHandlers);

describe('Login', () => {
  // Set up DI and mock server
  beforeAll(() => {
    const injector: Injector = createInjector();

    installI18nModule(injector);
    configureGlobalInjector(injector);

    server.listen({ onUnhandledRequest: 'error' });
  });

  // Clean up after tests
  afterAll(() => server.close());

  // Reset handlers after each test
  afterEach(() => {
    cleanup();

    server.resetHandlers();
  });

  it('should render a not disabled button', () => {
    const wrapper = render(
      <Login />,
    );
    const button: HTMLElement | null = wrapper.queryByTestId('login-form-submit');

    expect(button).toHaveProperty('disabled', false);
    expect(button).toBeDefined();
  });

  it('should not render an alert box', () => {
    const wrapper = render(
      <Login />,
    );
    const alert: HTMLElement | null = wrapper.queryByTestId('login-alert');
    expect(alert).toBeNull();
  });

  it('should render an alert box', async () => {
    const wrapper = render(
      <Login />,
    );

    // Get input and fill values
    const userName: HTMLElement = await wrapper.findByTestId('login-form-username');
    fireEvent.change(userName.querySelector('input')!, { target: { value: 'jdoe' } });
    const password: HTMLElement = await wrapper.findByTestId('login-form-password');
    fireEvent.change(password.querySelector('input')!, { target: { value: 'password' } });

    // Submit form
    const form: HTMLElement = await wrapper.findByTestId('login-form');
    fireEvent.submit(form);

    const alert: HTMLElement = await wrapper.findByTestId('login-alert');
    expect(alert).toBeDefined();
    expect(alert.textContent).toBe('User name or password incorrect');
  });
});
