import { CreateDatabase } from './create-database'
export const using = ['database']
export class Select extends CreateDatabase{
    async select() {
      const data = await this.ctx.database.get('BilibiliAccount', {
        id: 1
      })
  
      return data;
    }
  }