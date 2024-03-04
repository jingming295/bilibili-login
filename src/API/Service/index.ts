import { Context, Service } from "koishi";
import { Select } from "../Database/select-database";
declare module 'koishi' {
  interface Context
  {
    bilibiliLogin: bilibiliLogin;
  }
}
export class bilibiliLogin extends Service
{
  ctx
  async getBilibiliAccountData(){
    const select = new Select(this.ctx);
    const data:BilibiliAccountData[] = await select.select() as unknown as BilibiliAccountData[];
    const bilibiliAccountData:BilibiliAccountData = data[0]
    return bilibiliAccountData;
    
  }

  constructor(ctx: Context)
  {
    super(ctx, 'bilibiliLogin', true);
    this.ctx = ctx;
  }
}
interface BilibiliAccountData
{
  SESSDATA: string;
  csrf: string;
  refresh_token: string;
  DedeUserID: string,
  DedeUserID__ckMd5: string
}
