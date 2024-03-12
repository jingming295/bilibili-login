import { Context, Service } from "koishi";
import { BilibiliAccountData, NavUserInfo } from "../..";
import { Select } from "../Database/select-database";
import { BiliBiliLoginApi } from "../BiliBiliAPI/LoginAPI";

export * from '../Database/interface';
export * from '../BiliBiliAPI/LoginAPI/LoginInfoInterface';

export class BiliBiliLogin extends Service
{
  constructor(ctx: Context)
  {
    super(ctx, 'BiliBiliLogin', true);
    this.ctx = ctx;
  }
  /**
   * 获取Bilibili账号数据
   * @returns {Promise<BilibiliAccountData>}
   */
  public async getBilibiliAccountData(): Promise<BilibiliAccountData>
  {
    const select = new Select(this.ctx);
    const data = await select.select();
    const bilibiliAccountData = data[0];
    return bilibiliAccountData;
  }

  /**
   * 获取导航栏用户信息
   * @see{@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/login/login_info.md#%E5%AF%BC%E8%88%AA%E6%A0%8F%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF}
   * @returns {Promise<NavUserInfo|null>}
   */
  public async getNavUserData(): Promise<NavUserInfo|null>{
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliLoginAPI = new BiliBiliLoginApi(bilibiliAccountData);
    return bilibiliLoginAPI.getNavUserData();
  }

}