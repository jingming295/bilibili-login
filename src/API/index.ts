import { Context, Logger } from "koishi";
import { Select } from "./Database/select-database";
import { BilibiliAccount } from "./BilibiliAccount";
import { bilibiliLogin } from "./Service";


export async function apply(ctx: Context, Config: Config)
{
  ctx.plugin(bilibiliLogin);
  const logger = new Logger('bilibili-login');
  // const data = await ctx.bilibiliLogin.getBilibiliAccountData()
  // console.log(data[0])
  if (!Config.SESSDATA || !Config.csrf || !Config.refresh_token)
  {
    logger.warn("你还没配置设置");
    return;
  }
  try
  {
    const select = new Select(ctx);
    const bilibiliAccount = new BilibiliAccount(ctx);
    let bilibiliAccountData = await select.select();
    // 如果数据库里面还没有数据
    if (bilibiliAccountData.length !== 1)
    {
      await bilibiliAccount.init(Config);
      bilibiliAccountData = await select.select();
      if (bilibiliAccountData.length !== 1) throw new Error('数据无效');
    }

    // 刚开就设置
    bilibiliAccountData = await select.select();
    await bilibiliAccount.DairyCheckRefresh(bilibiliAccountData[0].csrf, bilibiliAccountData[0].refresh_token, bilibiliAccountData[0].SESSDATA);
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
      } catch (error)
      {
        logger.warn(error);
      }

    }, interval);
    logger.info('成功设置自动定时刷新cookie任务');
  } catch (error)
  {
    logger.warn((error as Error));
  }
}

