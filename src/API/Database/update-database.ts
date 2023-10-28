import { CreateDatabase } from './create-database'
export class Update extends CreateDatabase{

    async setBilibiliAccountData(csrf, refresh_token, SESSDATA){
        const row = {
          csrf: csrf,
          refresh_token: refresh_token,
          SESSDATA: SESSDATA
        }
        await this.ctx.database.set('BilibiliAccount', 1, row)
      }


}