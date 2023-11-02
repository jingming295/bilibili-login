import { Context, Service } from "koishi";

declare module 'koishi' {
    interface Context {
        bilibiliLogin: bilibiliLogin;
    }
  }
  export class bilibiliLogin extends Service{
    config!: Config;
    bilibiliAccountData!: BilibiliAccountData;


    constructor(ctx: Context) {
        // 这样写你就不需要手动给 ctx 赋值了
        super(ctx, 'bilibiliLogin', true)
    }
  }
