import { Context, Logger } from "koishi";
import { Select } from "./Database/select-database";
import { BilibiliAccount } from "./BilibiliAccount";
import { bilibiliLogin } from "./Service";


export async function apply(ctx: Context, Config: Config)
{
  const logger = new Logger('bilibili-login');
  ctx.plugin(bilibiliLogin);
  ctx.bilibiliLogin.config = Config;
  ctx.bilibiliLogin.bilibiliAccountData
  try
  {
    const select = new Select(ctx);
    const bilibiliAccount = new BilibiliAccount(ctx);
    const bilibiliAccountData = await select.select();
    if (bilibiliAccountData.length !== 1)
    {
      await bilibiliAccount.init(Config);
      const bilibiliAccountData = await select.select();
      ctx.bilibiliLogin.bilibiliAccountData = bilibiliAccount.returnBilibiliAccountData
        (
          bilibiliAccountData[0].SESSDATA,
          bilibiliAccountData[0].csrf,
          bilibiliAccountData[0].refresh_token
        );
    }
    // console.log(ctx.bilibiliLogin);
    // 设置定时任务，每隔24小时执行一次
    let randomInterval = Math.floor(Math.random() * (3600000 * 1));
    let interval = 12 * 3600000 + randomInterval;
    ctx.setInterval(async () =>
    {
      try
      {
        randomInterval = Math.floor(Math.random() * (3600000 * 1));
        interval = 12 * 3600000 + randomInterval;
        await bilibiliAccount.DairyCheckRefresh(bilibiliAccountData[0].csrf, bilibiliAccountData[0].refresh_token, bilibiliAccountData[0].SESSDATA);
        ctx.bilibiliLogin.bilibiliAccountData = bilibiliAccount.returnBilibiliAccountData
        (
          bilibiliAccountData[0].SESSDATA,
          bilibiliAccountData[0].csrf,
          bilibiliAccountData[0].refresh_token
        );
      } catch (error)
      {
        logger.warn(error);
      }

    }, interval);
  } catch (error)
  {
    logger.warn(error);
  }
}

