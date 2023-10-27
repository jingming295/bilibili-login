import { Context} from 'koishi'

export const using = ['database']

export class CreateDatabase{
    ctx:Context

    constructor(ctx: Context) {
        this.ctx = ctx;
        this.CreateBilibiliAccountDatabase()
    }

    CreateBilibiliAccountDatabase(){
      this.ctx.model.extend('BilibiliAccount', {
        id: 'integer',
        csrf: 'string',
        refresh_token: 'string',
        SESSDATA: 'string'
        
      }, {
        primary: 'id',
        autoInc: true,
      })
    }
  }