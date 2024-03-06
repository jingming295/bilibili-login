// import { Context, Service } from "koishi";
// import { BilibiliAccountData } from "../..";
// import { Select } from "../Database/select-database";

// export * from '../Database/interface';

// export class bilibiliLogin extends Service
// {
//   constructor(ctx: Context)
//   {
//     super(ctx, 'bilibiliLogin', true);
//     this.ctx = ctx;
//   }
//   /**
//    * 获取Bilibili账号数据
//    * @returns BilibiliAccountData[]
//    */
//   public async getBilibiliAccountData(): Promise<BilibiliAccountData>
//   {
//     const select = new Select(this.ctx);
//     const data: BilibiliAccountData[] = await select.select() as unknown as BilibiliAccountData[];
//     const bilibiliAccountData: BilibiliAccountData = data[0];
//     return bilibiliAccountData;
//   }

// }