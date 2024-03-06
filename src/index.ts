import { bilibiliLogin, bilibiliVideo } from './API/Service';

export const name = 'bilibili-login'

export const using = ['database']

export * from './API'

export * from './API/Configuration'

export * from './API/Service'

declare module 'koishi' {
    interface Context
    {
      bilibiliLogin: bilibiliLogin;
      bilibiliVideo: bilibiliVideo;
    }
  }