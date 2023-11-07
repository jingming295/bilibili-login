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
  async getBilibiliAccountData(){
    const select = new Select(this.ctx);
    const data:BilibiliAccountData[] = await select.select() as unknown as BilibiliAccountData[];
    const bilibiliAccountData:BilibiliAccountData = data[0]
    return bilibiliAccountData
  }

  constructor(ctx: Context)
  {
    // 这样写你就不需要手动给 ctx 赋值了
    super(ctx, 'bilibiliLogin', true);
  }
}
interface BilibiliAccountData
{
  SESSDATA: string;
  csrf: string;
  refresh_token: string;
}
