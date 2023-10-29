import { Context, Logger } from "koishi";
import { Select } from "./Database/select-database";
import { BilibiliAccount } from "./BilibiliAccount";
import { CreateDatabase } from "./Database/create-database";

export async function apply(ctx: Context, Config: Config)
{
  const logger = new Logger('bilibili-login');
  // 不等待的话，database好像还没初始化
  await new Promise(resolve => setTimeout(resolve, 500)); // 等待2秒
  try
  {
    const createDatabase = new CreateDatabase(ctx);
    const select = new Select(ctx);
    const bilibiliAccount = new BilibiliAccount(ctx);

    createDatabase.CreateBilibiliAccountDatabase()
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
