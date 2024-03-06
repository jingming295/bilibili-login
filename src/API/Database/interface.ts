export interface BilibiliAccountData {
    id: number,
    csrf: string,
    refresh_token: string,
    SESSDATA: string,
    DedeUserID: string,
    DedeUserID__ckMd5: string,
    buvid3: string,
    buvid4: string
  }
  
  declare module 'koishi' {
    interface Tables {
      BilibiliAccount: BilibiliAccountData
    }
  }