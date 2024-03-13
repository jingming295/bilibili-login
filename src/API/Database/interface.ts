export interface BilibiliAccountData
{
  id: number,
  csrf: string,
  refresh_token: string,
  SESSDATA: string,
  DedeUserID: string,
  DedeUserID__ckMd5: string,
  bili_ticket_expires: string
  bili_ticket: string
  bmg_af_switch: string
  FEED_LIVE_VERSION: string
  browser_resolution: string
  header_theme_version: string
  home_feed_column: string
  bmg_src_def_domain: string
  enable_web_push: string
  _uuid: string
  'i-wanna-go-back': string
  b_lsid: string
  buvid3: string
  b_ut: string
  buvid_fp: string
  b_nut: string
  buvid4: string
}

declare module 'koishi' {
  interface Tables
  {
    BilibiliAccount: BilibiliAccountData;
  }
}