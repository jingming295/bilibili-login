import { Context, Logger } from "koishi";
import { Select } from "./Database/select-database";
import { BilibiliAccount } from "./BilibiliAccount";
import { BiliBiliMovie, BiliBiliLogin, BiliBiliSearch, BiliBiliVideo, BilibiliAccountData, BiliBiliLive } from "./Service";
import { Update } from "./Database/update-database";
import { clearInterval } from "timers";
import { Config } from "./Configuration";
import { BiliBiliLoginApi } from "./BiliBiliAPI/LoginAPI";
import { BiliBiliMainPageCookie } from "./Generate/BiliBiliMainPageCookie";

export async function apply(ctx: Context, Config: Config)
{
  ctx.plugin(BiliBiliLogin);
  ctx.plugin(BiliBiliVideo);
  ctx.plugin(BiliBiliMovie);
  ctx.plugin(BiliBiliSearch);
  ctx.plugin(BiliBiliLive);

  let x;

  // const bl = ctx.bilibiliLogin
  // x = await bl.getNavUserData()

  // const bv = ctx.BiliBiliVideo
  // x = await bv.getBilibiliVideoDetail(76566179, 'BV11J411R7H5')

  // const ba = ctx.BiliBiliMovie
  // x = await ba.unfollowMovie(22088)

  // const bs = ctx.BiliBiliSearch
  // x = await bs.followMovie('1', 1)

  // const lb = ctx.BiliBiliLive
  // x = await lb.getLiveStream(732, 'web',4)

  // console.log(x?.data);

  const logger = new Logger('bilibili-login');
  const select = new Select(ctx);
  const update = new Update(ctx);
  const bilibiliAccount = new BilibiliAccount(ctx);
  let refreshAccountInterval: NodeJS.Timeout | undefined = undefined;

  try
  {
    let bilibiliAccountData: BilibiliAccountData[] = await select.select();

    // 如果发现数据库中没有Cookie信息，就执行初始化
    if (bilibiliAccountData.length !== 1)
    {
      await bilibiliAccount.init();
      bilibiliAccountData = await select.select();
      if (bilibiliAccountData.length !== 1) throw new Error('数据无效');
    }

    await bilibiliAccount.checkAccountStatus(bilibiliAccountData[0].csrf, bilibiliAccountData[0].SESSDATA);
    if (Config.refresh)
    {
      // 设置定时任务
      refreshAccountInterval = await bilibiliAccount.intervalTask(select, update, Config, refreshAccountInterval);
      logger.info('成功设置自动刷新cookie的定时任务');
    }

  } catch (error)
  {
    if ((error as Error).message === 'cannot create effect on inactive context')
    {
      return;
    }
    if ((error as Error).message === 'fetch failed')
    {
      logger.warn((error as Error).message);
      return;
    }
    logger.warn((error as Error));
    const bilibiliAccountData = await select.select();
    if (bilibiliAccountData.length === 1)
    {
      update.deleteBilibiliAccountData();
    }
    logger.warn(
      `抱歉，我们遇到了一些问题，具体是：${(error as Error).message}。
      \n这导致数据库中的数据发生错误。为了解决这个问题，我们已经自动删除了相关数据，并取消了自动任务。
      \n请您重新扫码登录
      \n如果重新扫码登录还不行，请到github页面开一个issue，附带日志输出内容 [https://github.com/jingming295/bilibili-login]
      `
    );
    bilibiliAccount.init();
    clearInterval(refreshAccountInterval);
  }
}
