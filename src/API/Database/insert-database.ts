import { Select } from './select-database'
import { CreateDatabase } from './create-database'

export class Insert extends CreateDatabase{
    
    async insertIntoBilibiliAccountData(SESSDATA:string, csrf:string, refresh_token:string, DedeUserID: string, DedeUserID__ckMd5: string, sid: string){
      const row = {
        id: 1,
        csrf: csrf,
        refresh_token: refresh_token,
        SESSDATA: SESSDATA,
        DedeUserID: DedeUserID,
        DedeUserID__ckMd5: DedeUserID__ckMd5,
        sid: sid
      }
      await this.ctx.database.create('BilibiliAccount', row)
    }
  }