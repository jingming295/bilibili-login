import { CreateDatabase } from './create-database';
export class Update extends CreateDatabase
{

  async setBilibiliAccountData(csrf: string, refresh_token: string, SESSDATA: string, DedeUserID: string, DedeUserID__ckMd5: string, bv3: string, bv4: string)
  {
    const row = {
      csrf: csrf,
      refresh_token: refresh_token,
      SESSDATA: SESSDATA,
      DedeUserID: DedeUserID,
      DedeUserID__ckMd5: DedeUserID__ckMd5,
      buvid3: bv3,
      buvid4: bv4
    };
    await this.ctx.database.set('BilibiliAccount', 1, row);
  }

  async deleteBilibiliAccountData()
  {
    await this.ctx.database.remove('BilibiliAccount', [1]);
  }


}