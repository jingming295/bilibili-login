import { Select } from './select-database'
import { CreateDatabase } from './create-database'

export class Insert extends CreateDatabase{
    
    async insertIntoBilibiliAccountData(SESSDATA:string, csrf:string, refresh_token:string, DedeUserID: string, DedeUserID__ckMd5: string, bv3:string, bv4:string){
      const row = {
        id: 1,
        csrf: csrf,
        refresh_token: refresh_token,
        SESSDATA: SESSDATA,
        DedeUserID: DedeUserID,
        DedeUserID__ckMd5: DedeUserID__ckMd5,
        buvid3: bv3,
        buvid4: bv4
      }
      await this.ctx.database.create('BilibiliAccount', row)
    }
  }