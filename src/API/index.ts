import { Context, Logger } from "koishi";
import { Select } from "./Database/select-database";
import { BilibiliAccount } from "./BilibiliAccount";
import { bilibiliLogin } from "./Service";
import { Update } from "./Database/update-database";
import { clearInterval } from "timers";


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
  const select = new Select(ctx);
  const update = new Update(ctx);
  const bilibiliAccount = new BilibiliAccount(ctx);
  let refreshAccountInterval: NodeJS.Timeout | undefined = undefined;
  try
  {
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
    let interval = 3 * 3600000 + randomInterval;

    refreshAccountInterval = setInterval(async () =>
    {
      try
      {
        logger.info("检查cookie是否需要刷新中。。。。。");
        randomInterval = Math.floor(Math.random() * (3600000 * 1));
        interval = 3 * 3600000 + randomInterval;
        await bilibiliAccount.DairyCheckRefresh(bilibiliAccountData[0].csrf, bilibiliAccountData[0].refresh_token, bilibiliAccountData[0].SESSDATA);
      } catch (error)
      {
        logger.warn(error);
        update.deleteBilibiliAccountData();
        logger.warn(
          `
        抱歉，我们遇到了一些问题，导致数据库中的数据发生错误。为了解决这个问题，我们已经自动删除了相关数据，并取消了自动任务。

        请您按照以下步骤重新配置插件：
        
        1. 获取新的Cookie：请重新获取您的Cookie，并确保它是最新的。
        
        2. 更新配置：将新的Cookie输入到插件的配置中。

        3. 请到github页面开一个issue，附带日志输出内容 [https://github.com/jingming295/bilibili-login]
        `
        );
        clearInterval(refreshAccountInterval);
      }

    }, interval);

    logger.info('成功设置自动定时刷新cookie任务');
  } catch (error)
  {

    logger.warn((error as Error));
    update.deleteBilibiliAccountData();
    logger.warn(
      `
      抱歉，我们遇到了一些问题，导致数据库中的数据发生错误。为了解决这个问题，我们已经自动删除了相关数据，并取消了自动任务。

      请您按照以下步骤重新配置插件：
      
      1. 获取新的Cookie：请重新获取您的Cookie，并确保它是最新的。
      
      2. 更新配置：将新的Cookie输入到插件的配置中。

      3. 请到github页面开一个issue，附带日志输出内容 [https://github.com/jingming295/bilibili-login]
      `
    );
    clearInterval(refreshAccountInterval);
  }
}

