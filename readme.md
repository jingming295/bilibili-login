# koishi-plugin-bilibili-login

[![npm](https://img.shields.io/npm/v/koishi-plugin-bilibili-login?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-bilibili-login)

Bilibili Login



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/initialencounter/mykoishi">
    <a href="https://koishi.chat/" target="_blank">
    <img width="160" src="https://koishi.chat/logo.png" alt="logo">
  </a>
  </a>

<h3 align="center">koishi-plugin-bilibili-login</h3>

  <p align="center">
    B站登录
  </p>
</div>

[![npm](https://img.shields.io/npm/v/koishi-plugin-bilibili-login?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-bilibili-login)

# 🎉B站登录

## [bilibili-login](https://github.com/jingming295/bilibili-login)

## 📝简介

使用cookie来登录b站，登陆后提供b站账号需要用到的SESSDATA，csrf和refresh_token
插件将会定期检查cookie是否需要刷新，如果需要刷新就执行刷新操作并且保存最新的SESSDATA，csrf和refresh_token

## 👀如何使用
```typescript
import { Context } from 'koishi'
import { } from 'koishi-plugin-bilibili-login'
export const inject = ['bilibiliLogin'];
export const name = 'example'
export async function apply(ctx: Context)
{
  const bilibiliAccountData = await ctx.bilibiliLogin.getBilibiliAccountData() // 获取sessdata, csrf, refresh_token
  console.log(bilibiliAccountData)
}
```
