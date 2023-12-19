interface Config
{
  SESSDATA: string;
  csrf: string;
  refresh_token: string;
  RefreshTimeHours:number
  refresh:boolean
}

interface BilibiliAccountData
{
  SESSDATA: string;
  csrf: string;
  refresh_token: string;
  DedeUserID: string,
  DedeUserID__ckMd5: string,
  sid: string
}