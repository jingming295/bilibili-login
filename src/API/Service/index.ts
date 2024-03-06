import { Context, Service } from "koishi";
import { Select } from "../Database/select-database";
import { BiliBiliVideoApi } from "../BiliBiliAPI/BiliBiliVideoAPI";
import { BilibiliAccountData } from "../Database/interface";
import { BVideoDetail, BVideoStream, LikeVideo, Snapshot, videoStatus } from "../..";

export * from '../BiliBiliAPI/BiliBiliVideoAPI/ActionInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/StreamInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/VideoDetailInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/videoStatusInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/VideoSnapshotInterface';

export * from '../Database/interface';

declare module 'koishi' {
  interface Context
  {
    bilibiliLogin: bilibiliLogin;
    bilibiliVideo: bilibiliVideo;
  }
}

export class bilibiliLogin extends Service
{
  constructor(ctx: Context)
  {
    super(ctx, 'bilibiliLogin', true);
    this.ctx = ctx;
  }
  /**
   * 获取Bilibili账号数据
   * @returns BilibiliAccountData[]
   */
  public async getBilibiliAccountData(): Promise<BilibiliAccountData>
  {
    const select = new Select(this.ctx);
    const data: BilibiliAccountData[] = await select.select() as unknown as BilibiliAccountData[];
    const bilibiliAccountData: BilibiliAccountData = data[0];
    return bilibiliAccountData;
  }

}

export class bilibiliVideo extends Service
{
  constructor(ctx: Context)
  {
    super(ctx, 'bilibiliVideo', true);
    this.ctx = ctx;
  }

  private async getBilibiliAccountData(): Promise<BilibiliAccountData>
  {
    const select = new Select(this.ctx);
    const bilibiliAccountDataD: BilibiliAccountData[] = await select.select() as unknown as BilibiliAccountData[];
    const bilibiliAccountData: BilibiliAccountData = bilibiliAccountDataD[0];
    return bilibiliAccountData;
  }

  /**
   * 获取Bilibili视频的基本信息
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/info.md}
   * @param {string} bvid 
   * @returns {Promise<BVideoDetail | null>} 视频的基本信息
   */
  async getBilibiliVideoDetail(bvid: string): Promise<BVideoDetail | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getBilibiliVideoData(bvid);
  }

  /**
   * 获取Bilibili视频的流
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/videostream_url.md}
   * @param {number} avid 
   * @param {string} bvid 
   * @param {string} cid 
   * @param {'html5'|'pc'} platform 
   * @param {number} biliBiliqn 
   * @returns 
   */
  async getBilibiliVideoStream(avid: number, bvid: string, cid: string, platform: 'html5' | 'pc', biliBiliqn: number): Promise<BVideoStream | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getBilibiliVideoStream(avid, bvid, cid, platform, biliBiliqn);
  }

  /**
   * 获取Bilibili视频的流 (使用函数计算)
   * @param avid 
   * @param bvid 
   * @param cid 
   * @param platform 
   * @param biliBiliqn 
   * @param remoteUrl 
   * @returns 
   */
  async getBilibiliVideoStreamFromFunctionCompute(avid: string, bvid: string, cid: string, platform: 'html5' | 'pc', biliBiliqn: number, remoteUrl: string): Promise<BVideoStream | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getBilibiliVideoStreamFromFunctionCompute(avid, bvid, cid, platform, biliBiliqn, remoteUrl);
  }

  /**
   * 获取视频状态数
   * 疑似不再可用
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/status_number.md}
   * @deprecated 这个接口疑似不再可用, 你应该使用getBilibiliVideoDetail
   * @param avid 
   * @returns 
   */
  async getBilibiliVideoStatus(avid: number): Promise<videoStatus | null>
{
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getBilibiliVideoStatus(avid);
  }

  /**
   * 获取Bilibili视频的快照
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/snapshot.md}
   * @param avid 
   * @param bvid 
   * @param cid 
   * @param index json数组截取时间表	1：需要, 0：不需要
   * @returns 
   */
  async getBilibiliVideoSnapshot(avid: number, bvid: string, cid: string | null = null, index: 1 | 0 = 0): Promise<Snapshot | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getBilibiliVideoSnapshot(avid, bvid, cid, index);
  }

  /**
   * 执行点赞/点踩操作
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/action.md}
   * @param {number} aid 
   * @param {string} bvid 
   * @param {1|2|3|4} like 1: 点赞, 2: 取消点赞, 3: 点踩, 4: 取消点踩
   * @returns 
   */
  async likeOrDislikeBilibiliVideo(aid: number, bvid: string, like: 1 | 2 | 3 | 4): Promise<LikeVideo | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.likeOrDislikeBilibiliVideo(aid, bvid, like);
  }

}
