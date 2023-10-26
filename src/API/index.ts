import { Context } from "koishi";
import { BiliBiliApi } from "./BiliBiliAPI";

export async function apply(ctx: Context, Config)
{
  const biliBiliApi = new BiliBiliApi();
  const refreshData = await biliBiliApi.checkNeedRefresh(Config.csrf, Config.SESSDATA)
  console.log(`refreshData: ${JSON.stringify(refreshData)}`)
  if(refreshData!==null && refreshData.data.refresh === true){

  }

  const timestamp = refreshData.data.timestamp
  // console.log(`timestamp: ${timestamp}`)
  const correspondPath = await biliBiliApi.GenerateCrorrespondPath(timestamp);
  // console.log(`correspondPath: ${correspondPath}`)
  const refreshCsrf = await biliBiliApi.getrefresh_csfr(correspondPath, Config.SESSDATA)
  // console.log(`refreshCsrf: ${refreshCsrf}`)
  const refreshCookie = await biliBiliApi.refreshCookie(Config.csrf, refreshCsrf, Config.refresh_token, Config.SESSDATA)
  console.log(refreshCookie.cookiesObject.SESSDATA)
  
  

}
