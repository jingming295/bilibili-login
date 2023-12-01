export interface data {
    id: number,
    csrf: string,
    refresh_token: string,
    SESSDATA: string,
    DedeUserID: string,
    DedeUserID__ckMd5: string,
    sid: string
  }
  
  declare module 'koishi' {
    interface Tables {
      BilibiliAccount: data
    }
  }