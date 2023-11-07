import { Select } from './select-database'
import { CreateDatabase } from './create-database'

export class Insert extends CreateDatabase{
    
    async insertIntoBilibiliAccountData(SESSDATA:string, csrf:string, refresh_token:string){
      const row = {
        id: 1,
        csrf: csrf,
        refresh_token: refresh_token,
        SESSDATA: SESSDATA
      }
      await this.ctx.database.create('BilibiliAccount', row)
    }
  }