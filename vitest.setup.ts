/**
 * The globals Nuxt and Nitro auto-import, installed for the plain Node test run.
 *
 * Two kinds live here. The h3 helpers are the real ones — re-exported so the
 * server modules behave exactly as they do in production. The runtime config is
 * a fixture, pinned on purpose: with `authEnabled` read from a developer's
 * `.env`, every authorization test would pass without asserting anything on the
 * machine that has auth turned off.
 */
import * as h3 from 'h3'
import { vi } from 'vitest'
import * as vue from 'vue'

const TEST_RUNTIME_CONFIG = {
  authApiBaseUrl: 'https://auth.test',
  authCookieDomain: '',
  authCookieSecure: true,
  authCookieSameSite: 'lax',
  authCookieMaxAge: 604800,
  public: {
    apiBaseUrl: 'https://api.test',
    authEnabled: true,
    authPasswordEnabled: true,
    authGoogleEnabled: false,
    googleClientId: '',
  },
}

const GLOBALS: Record<string, unknown> = {
  useRuntimeConfig: () => TEST_RUNTIME_CONFIG,

  defineEventHandler: h3.defineEventHandler,
  createError: h3.createError,
  getCookie: h3.getCookie,
  setCookie: h3.setCookie,
  deleteCookie: h3.deleteCookie,
  getQuery: h3.getQuery,
  getRouterParam: h3.getRouterParam,
  getRequestURL: h3.getRequestURL,
  readBody: h3.readBody,
  sendRedirect: h3.sendRedirect,
  setResponseStatus: h3.setResponseStatus,

  ref: vue.ref,
  shallowRef: vue.shallowRef,
  computed: vue.computed,
  reactive: vue.reactive,
}

for (const [name, value] of Object.entries(GLOBALS)) {
  vi.stubGlobal(name, value)
}
