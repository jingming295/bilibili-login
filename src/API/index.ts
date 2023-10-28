import { Context, Logger } from "koishi";
import { BiliBiliApi } from "./BiliBiliAPI";
import { Select } from "./Database/select-database";
import { BilibiliAccount } from "./BilibiliAccount";

export async function apply(ctx: Context, Config: Config)
{
  const logger = new Logger('bilibili-login');
  try
  {
    const select = new Select(ctx);
    const bilibiliAccount = new BilibiliAccount(ctx);
    const BilibiliAccountData = await select.select();
    if (BilibiliAccountData.length !== 1) bilibiliAccount.init(Config);
    else
    {
      // 设置定时任务，每隔24小时执行一次
      const interval = 24 * 60 * 60 * 1000; // 24小时的毫秒数
      setInterval(async () => {
        await bilibiliAccount.DairyCheckRefresh(BilibiliAccountData[0].csrf, BilibiliAccountData[0].refresh_token, BilibiliAccountData[0].SESSDATA);
      }, interval);
      // await bilibiliAccount.DairyCheckRefresh(BilibiliAccountData[0].csrf, BilibiliAccountData[0].refresh_token, BilibiliAccountData[0].SESSDATA);
    }
  } catch (error)
  {
    logger.warn(error);
  }


}
