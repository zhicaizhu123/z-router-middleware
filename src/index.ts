import {
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
} from 'vue-router';
import { Hook, BeforeMiddlewareFn, AfterMiddlewareFn } from './type';

export default class LifecycleHook {
  constructor(private hook: Hook) {}

  /**
   * 收集前置路由守卫中间件
   */
  private beforeQueue: BeforeMiddlewareFn[] = [];
  /**
   * 收集后置路由守卫中间件
   */
  private afterQueue: AfterMiddlewareFn[] = [];

  private registered = false;

  /**
   * 运行前置钩子中间件
   */
  private runBefore(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
    middleware: BeforeMiddlewareFn[],
  ) {
    if (middleware.length === 0) {
      next();
    } else {
      const fn = middleware.shift();
      if (fn) {
        fn(to, from, (params?: any) => {
          if (typeof params !== 'undefined') {
            if (params === false) {
              next();
            } else {
              next(params);
            }
          } else {
            this.runBefore(to, from, next, middleware);
          }
        });
      }
    }
  }

  /**
   * 运行后置钩子中间件
   */
  private runAfter(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: (flag?: boolean) => void,
    middleware: AfterMiddlewareFn[],
  ) {
    if (middleware.length === 0) {
      next();
    } else {
      const fn = middleware.shift();
      if (fn) {
        fn(to, from, (flag?: boolean) => {
          if (typeof flag === 'undefined' || flag) {
            this.runAfter(to, from, next, middleware);
          }
        });
      }
    }
  }

  /**
   * 采集中间件
   */
  use(...args: BeforeMiddlewareFn[] | AfterMiddlewareFn[]) {
    if (this.hook === 'beforeEach' || this.hook === 'beforeResolve') {
      this.beforeQueue = this.beforeQueue.concat(args as BeforeMiddlewareFn[]);
    } else {
      this.afterQueue = this.afterQueue.concat(args as AfterMiddlewareFn[]);
    }
  }

  /**
   * 注册路由守卫
   */
  register(router: Router) {
    if (!this.registered) {
      if (this.hook === 'beforeEach' || this.hook === 'beforeResolve') {
        router[this.hook](
          (
            to: RouteLocationNormalized,
            from: RouteLocationNormalized,
            next: NavigationGuardNext,
          ) => {
            this.runBefore(to, from, next, [...this.beforeQueue]);
          },
        );
      } else {
        router[this.hook](
          (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
            this.runAfter(to, from, () => {}, [...this.afterQueue]);
          },
        );
      }
      this.registered = true;
    }
  }
}

/**
 * 导出路由守卫处理器
 */
export const beforeEachHook = new LifecycleHook('beforeEach');
export const beforeResolveHook = new LifecycleHook('beforeResolve');
export const afterEachHook = new LifecycleHook('afterEach');
