import { MainPageCookie } from '../Generate/MainPageCookieInterface';
import { CreateDatabase } from './create-database';
export class Update extends CreateDatabase
{

  async setBilibiliAccountData(csrf: string, refresh_token: string, SESSDATA: string, DedeUserID: string, DedeUserID__ckMd5: string, cookieData: MainPageCookie)
  {
    const row = {
      csrf: csrf,
      refresh_token: refresh_token,
      SESSDATA: SESSDATA,
      DedeUserID: DedeUserID,
      DedeUserID__ckMd5: DedeUserID__ckMd5,
      bili_ticket_expires: cookieData['bili_ticket_expires:']?.value,
      bili_ticket: cookieData['bili_ticket']?.value,
      bmg_af_switch: cookieData['bmg_af_switch']?.value,
      FEED_LIVE_VERSION: cookieData['FEED_LIVE_VERSION']?.value,
      browser_resolution: cookieData['browser_resolution']?.value,
      header_theme_version: cookieData['header_theme_version']?.value,
      home_feed_column: cookieData['home_feed_column']?.value,
      bmg_src_def_domain: cookieData['bmg_src_def_domain']?.value,
      enable_web_push: cookieData['enable_web_push']?.value,
      _uuid: cookieData['_uuid']?.value,
      'i-wanna-go-back': cookieData['i-wanna-go-back']?.value,
      b_lsid: cookieData['b_lsid']?.value,
      buvid3: cookieData['buvid3']?.value,
      b_ut: cookieData['b_ut']?.value,
      buvid_fp: cookieData['buvid_fp']?.value,
      b_nut: cookieData['b_nut']?.value,
      buvid4: cookieData['buvid4']?.value
    };
    await this.ctx.database.set('BilibiliAccount', 1, row);
  }

  async deleteBilibiliAccountData()
  {
    await this.ctx.database.remove('BilibiliAccount', [1]);
  }


}