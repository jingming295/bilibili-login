import { Context} from 'koishi'

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
        SESSDATA: 'string',
        DedeUserID: 'string',
        DedeUserID__ckMd5: 'string'
        
      }, {
        primary: 'id',
        autoInc: true,
      })
    }
  }