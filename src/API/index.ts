import { Context } from "koishi";
import { BiliBiliApi } from "./BiliBiliAPI";
import { Select } from "./Database/select-database";

export async function apply(ctx: Context, Config: Config)
{
  async function init()
  {

    const BilibiliAccountData = await select.select();
    if (BilibiliAccountData.length !== 1)
    {
      const refreshData = await biliBiliApi.checkNeedRefresh(Config.csrf, Config.SESSDATA);
      if (refreshData.code === 0)
      {
        const timestamp = refreshData.data.timestamp;
        const correspondPath = await biliBiliApi.GenerateCrorrespondPath(timestamp);
        const refreshCsrf = await biliBiliApi.getrefresh_csfr(correspondPath, Config.SESSDATA);
        const refreshCookie = await biliBiliApi.refreshCookie(Config.csrf, refreshCsrf, Config.refresh_token, Config.SESSDATA);
        if(refreshCookie && refreshCookie.data.code === 0){
          console.log(refreshCookie)
        }
        
      }
    }
  }
  const select = new Select(ctx);
  const biliBiliApi = new BiliBiliApi();
  const refreshData = await biliBiliApi.checkNeedRefresh(Config.csrf, Config.SESSDATA);
  console.log(`refreshData: ${JSON.stringify(refreshData)}`);
  if (refreshData !== null && refreshData.data.refresh === true)
  {
    const timestamp = refreshData.data.timestamp;
    // console.log(`timestamp: ${timestamp}`)
    const correspondPath = await biliBiliApi.GenerateCrorrespondPath(timestamp);
    // console.log(`correspondPath: ${correspondPath}`)
    const refreshCsrf = await biliBiliApi.getrefresh_csfr(correspondPath, Config.SESSDATA);
    // console.log(`refreshCsrf: ${refreshCsrf}`)
    const refreshCookie = await biliBiliApi.refreshCookie(Config.csrf, refreshCsrf, Config.refresh_token, Config.SESSDATA);
    // console.log(refreshCookie)
  }

  init();


}
