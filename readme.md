# koishi-plugin-bilibili-login

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
    B站API
  </p>
</div>

[![npm](https://img.shields.io/npm/v/koishi-plugin-bilibili-login?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-bilibili-login)
[![CodeFactor](https://www.codefactor.io/repository/github/jingming295/bilibili-login/badge)](https://www.codefactor.io/repository/github/jingming295/bilibili-login)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fjingming295%2Fbilibili-login.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fjingming295%2Fbilibili-login?ref=badge_shield)

# 🎉bilibili-login

## [bilibili-login](https://github.com/jingming295/bilibili-login)

## 📝简介

可以扫码登录b站。一开始只是想做登录功能罢了，但是我决定添加更多东西！

## 👀如何使用
### 目前我提供了三个services，可以办到很多事情。具体可以参考 [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)

```typescript
import { Context } from 'koishi'
import { } from 'koishi-plugin-bilibili-login'
export const inject = ['BiliBiliLogin',  'BiliBiliVideo', 'BiliBiliAnime'];
export const name = 'example'
export async function apply(ctx: Context)
{
  const bl = ctx.BiliBiliLogin
  const bv = ctx.BiliBiliLogin
  const ba = ctx.BiliBiliAnime

  const bilibiliAccountData = await bl.getBilibiliAccountData() // 获取账号cookie
  console.log(bilibiliAccountData)

  const bvideo = await bv.getBilibiliVideoStream(834398004, null, 1359369314, 112, 'html', 1) // 获取b站视频流信息
  console.log(bvideo)

  const animeData = ba.getAnimeDetailEPSS(null, 278373) // 获取番剧基本信息
  console.log(animeData)
}
```

## ✋🏻免责声明

### 本插件仅供学习，用户做的任何事情与我无关，请在下载24小时候删除本插件。

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fjingming295%2Fbilibili-login.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fjingming295%2Fbilibili-login?ref=badge_large)