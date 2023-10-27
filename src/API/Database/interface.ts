export interface data {
    id: number,
    csrf: string,
    refresh_token: string,
    SESSDATA: string
  }
  
  declare module 'koishi' {
    interface Tables {
      BilibiliAccount: data
    }
  }