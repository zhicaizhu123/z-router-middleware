import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export type Hook = 'beforeEach' | 'beforeResolve' | 'afterEach';

export type BeforeMiddlewareFn = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => void;

export type AfterMiddlewareFn = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: (flag?: boolean) => void,
) => void;
