# Vue Router 4.0 路由拦截中间件

## 使用
假设已经定义了一下中间件:   
``` ts
/**
 * 设置标题中间件
 */
export const titleMiddleware: BeforeMiddlewareFn = (to, from, next) => {
  document.title = to.meta.title
  next()
}

/**
 * 判断白名单中间件
 */
export const whiteListMiddleware: BeforeMiddlewareFn = (to, from, next) => {
  // 获取白名单列表
  const whiteList = getWhiteList(routes)

  // 如果是白名单内的路由直接通行
  if (to.name && whiteList.includes(to.name as string)) {
    return next(false)
  }
  next()
}
```

那么使用执行如下：
``` ts
import { beforeEachHook } from 'path/to/hooks'
import { titleMiddleware, whiteListMiddleware } from 'path/to/middleware'

// 前置路由守卫
beforeEachHook.use(
  titleMiddleware,
  whiteListMiddleware,
)
beforeEachHook.register(router)
```