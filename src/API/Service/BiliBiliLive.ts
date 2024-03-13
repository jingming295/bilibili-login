import { Context, Service } from "koishi";
import { Select } from "../Database/select-database";
import { BilibiliAccountData } from "../Database/interface";
import { BiliBiliLiveApi } from "../BiliBiliAPI/BiliBiliLive";
import { LiveRoomDetail, LiveRoomStatus } from "../..";

export * from "../BiliBiliAPI/BiliBiliLive/LiveRoomDetailInterface";

export class BiliBiliLive extends Service
{
  constructor(ctx: Context)
  {
    super(ctx, 'BiliBiliLive', true);
    this.ctx = ctx;
  }

  private async getBilibiliAccountData(): Promise<BilibiliAccountData>
  {
    const select = new Select(this.ctx);
    const bilibiliAccountDataD = await select.select();
    const bilibiliAccountData = bilibiliAccountDataD[0];
    return bilibiliAccountData;
  }

  /**
   * 获取直播间基本信息
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/live/info.md}
   * @param roomId 直播间号	(可以为短号)
   * @returns {Promise<LiveRoomDetail|null>}
   */
  public async getLiveRoomDetail(roomId: number): Promise<LiveRoomDetail|null>{
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliLiveApi = new BiliBiliLiveApi(bilibiliAccountData)
    return await bilibiliLiveApi.getLiveRoomDetail(roomId);
  }

  /**
   * 获取用户对应的直播间状态 (根据用户mid)
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/live/info.md}
   * @param mid 
   * @returns {Promise<LiveRoomStatus|null>}
   */
  public async getLiveRoomStatusByMid(mid: number): Promise<LiveRoomStatus|null>{
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliLiveApi = new BiliBiliLiveApi(bilibiliAccountData)
    return await bilibiliLiveApi.getLiveRoomStatusByMid(mid);
  }

  /**
   * 获取房间页初始化信息
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/live/info.md}
   * @param id 
   * @returns 
   */
  public async getLiveRoomInitDetail(id:number){
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliLiveApi = new BiliBiliLiveApi(bilibiliAccountData)
    return await bilibiliLiveApi.getLiveRoomInitDetail(id);
  }


}