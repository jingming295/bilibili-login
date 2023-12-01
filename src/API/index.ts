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

  if (!Config.SESSDATA || !Config.csrf || !Config.refresh_token)
  {
    logger.warn("你还没配置bilbili-login");
    return;
  }

  const select = new Select(ctx);
  const update = new Update(ctx);
  const bilibiliAccount = new BilibiliAccount(ctx);
  let refreshAccountInterval: NodeJS.Timeout | undefined = undefined;

  try
  {
    let bilibiliAccountData = await select.select();
    // 如果发现数据库中没有Cookie信息，就执行初始化
    if (bilibiliAccountData.length !== 1)
    {
      await bilibiliAccount.init(Config);
      bilibiliAccountData = await select.select();
      if (bilibiliAccountData.length !== 1) throw new Error('数据无效');
    }

    // 设置定时任务
    refreshAccountInterval = await bilibiliAccount.intervalTask(select,update,Config,refreshAccountInterval);
    logger.info('成功设置自动刷新cookie的定时任务');

  } catch (error)
  {
    logger.warn((error as Error));
    const bilibiliAccountData = await select.select();
    if(bilibiliAccountData.length === 1){
      update.deleteBilibiliAccountData();
    }
    logger.warn(
      `抱歉，我们遇到了一些问题，具体是：${(error as Error).message}。
      \n这导致数据库中的数据发生错误。为了解决这个问题，我们已经自动删除了相关数据，并取消了自动任务。
      \n请您按照以下步骤重新配置插件：
      \n1. 获取新的Cookie：请重新获取您的Cookie，并确保它是最新的。
      \n2. 更新配置：将新的Cookie输入到插件的配置中。
      \n3. 如果重新输入新的cookie还不行，请到github页面开一个issue，附带日志输出内容 [https://github.com/jingming295/bilibili-login]
      `
    );
    clearInterval(refreshAccountInterval);
  }
}

