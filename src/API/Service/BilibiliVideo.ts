import { Context, Service } from "koishi";
import { Select } from "../Database/select-database";
import { BiliBiliVideoApi } from "../BiliBiliAPI/BiliBiliVideoAPI";
import { BilibiliAccountData } from "../Database/interface";
import { AIConclusion, AddCoin, AddFavorite, AppealType, BVideoDetail, BVideoStream, HighEnergyBar, LikeTagResult, LikeVideo, MakeAppealResult, OnlineViewer, RecommandVideo, RecommendVideoFromMainPage, SeasonArchives, ShareVideo, Snapshot, VideoTags, hasLiked, interactVideoDetail, isAddFavorited, isAddedCoin, likeAndDislikeAIConclusion, likeTriple, reportResult, videoStatus } from "../..";


export * from '../BiliBiliAPI/BiliBiliVideoAPI/ActionInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/StreamInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/VideoDetailInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/VideoStatusInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/VideoSnapshotInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/VideoTagsInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/RecommendVideoInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/InteractVideoInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/HighEnergyBarListInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/ReportInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/OnlineViewersInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/AIConclusionInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/AppealInterface';
export * from '../BiliBiliAPI/BiliBiliVideoAPI/SeasonArchivesInterface';
export class BiliBiliVideo extends Service
{
  constructor(ctx: Context)
  {
    super(ctx, 'BiliBiliVideo', true);
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
   * 获取Bilibili视频的基本信息
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/info.md}
   * @param {string} bvid 视频的bvid
   * @returns {Promise<BVideoDetail | null>} 视频的基本信息
   */
  async getBilibiliVideoDetail(aid: number | null = null, bvid: string | null = null): Promise<BVideoDetail | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getBilibiliVideoData(aid, bvid);
  }

  /**
   * 获取Bilibili视频的各种各样的信息，包括视频流
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/videostream_url.md}
   * @param aid 必要 (aid和bvid二选一)
   * @param bvid 必要 (aid和bvid二选一)
   * @param cid 必要 视频的cid
   * @param qn 非必要，视频流的清晰度
   * @param platform 非必要，平台，可选 html5 或者 pc
   * @param fnval 非必要，视频流格式标识
   * @returns {Promise<BVideoStream | null>} 各种各样的信息，包括视频流
   */
  async getBilibiliVideoStream
    (
      aid: number | null = null,
      bvid: string | null = null,
      cid: number,
      qn: number,
      platform: string | null = null,
      fnval: number | null = null,
    ): Promise<BVideoStream | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getBilibiliVideoStream(aid, bvid, cid, qn, platform, fnval, this.ctx);
  }

  /**
   * 获取Bilibili视频的流 (使用函数计算)
   * @param aid 
   * @param bvid 
   * @param cid 
   * @param platform 
   * @param biliBiliqn 
   * @param remoteUrl 
   * @returns 
   */
  async getBilibiliVideoStreamFromFunctionCompute(aid: string, bvid: string, cid: string, platform: 'html5' | 'pc', biliBiliqn: number, remoteUrl: string): Promise<BVideoStream | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getBilibiliVideoStreamFromFunctionCompute(aid, bvid, cid, platform, biliBiliqn, remoteUrl);
  }

  /**
   * 获取视频状态数
   * 疑似不再可用
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/status_number.md}
   * @deprecated 这个接口疑似不再可用, 你应该使用getBilibiliVideoDetail
   * @param aid 视频的aid
   * @returns {Promise<videoStatus | null>} 返回视频的状态信息，或者返回null
   */
  async getBilibiliVideoStatus(aid: number): Promise<videoStatus | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getBilibiliVideoStatus(aid);
  }

  /**
   * 获取Bilibili视频的快照
   * 
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/snapshot.md}
   * @param {number | null = null} aid 必要 (aid和bvid二选一)
   * @param {string | null = null} bvid 必要 (aid和bvid二选一)
   * @param {string | null = null} cid 视频的cid（可选，用于分p的视频，默认为null）
   * @param {0 | 1} index 是否需要json数组截取时间表：1(需要), 0(不需要，默认为0)
   * @returns {Promise<Snapshot | null>} 返回视频的快照信息，或者返回null
   */
  async getBilibiliVideoSnapshot(
    aid: number | null = null,
    bvid: string | null = null,
    cid: string | null = null,
    index: 0 | 1 = 0
  ): Promise<Snapshot | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getBilibiliVideoSnapshot(aid, bvid, cid, index);
  }


  /**
   * 执行点赞或点踩操作
   * 
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/action.md}
   * @param {number | null = null} aid 必要 (aid和bvid二选一)
   * @param {string | null = null} bvid 必要 (aid和bvid二选一)
   * @param {1|2|3|4} like 操作类型：1(点赞), 2(取消点赞), 3(点踩), 4(取消点踩)
   * @returns {Promise<LikeVideo | null>} 返回点赞或点踩的结果信息，或者返回null
   */
  async performLikeAndDislike(aid: number | null = null, bvid: string | null = null, like: 1 | 2 | 3 | 4): Promise<LikeVideo | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.likeOrDislikeBilibiliVideo(aid, bvid, like);
  }

  /**
   * 检查是否已经点赞/点踩
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/action.md}
   * @param {number | ''} aid 必要 (aid和bvid二选一)
   * @param {number | ''} bvid 必要 (aid和bvid二选一)
   * @returns {Promise<hasLiked | null>} 如果已经点赞或点踩返回对应信息，否则返回null
   */
  async checkIsLikedAndUnliked(aid: number | null = null, bvid: string | null = null): Promise<hasLiked | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.checkIsLikedAndUnliked(aid, bvid);
  }

  /**
   * 投币视频
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/action.md}
   * @param {number | null = null} aid 必要 (aid和bvid二选一)
   * @param {string | null = null} bvid 必要 (aid和bvid二选一)
   * @param {1|2} multiply 投币数量：1(1枚), 2(2枚)
   * @param {0|1} select_like 是否同时点赞：0(否), 1(是)
   * @returns {Promise<AddCoin | null>} 返回投币的结果信息
   */
  async addCoin(aid: number | null = null, bvid: string | null = null, multiply: 1 | 2, select_like: 0 | 1): Promise<AddCoin | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.addCoin(aid, bvid, multiply, select_like);
  }

  /**
   * 检查是否已经投币，并且获得已投数量
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/action.md}
   * @param {number | ''} aid 必要 (aid和bvid二选一)
   * @param {string | ''} bvid 必要 (aid和bvid二选一)
   * @returns {Promise<isAddedCoin | null>} 返回查询的结果信息
   */
  async checkIsAddedCoin(aid: number | null = null, bvid: string | null = null): Promise<isAddedCoin | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.checkIsAddedCoin(aid, bvid);
  }

  /**
   * 收藏或者取消收藏视频
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/action.md}
   * @param {number} aid 视频的aid
   * @param {number[]} add_media_ids 需要加入的收藏夹 mlid, 如果你在这个数组混入正确的和错误的收藏夹 mlid, 视频将会收藏到正确的收藏夹, 但是会返回code: 11010
   * @param {number[]} del_media_ids 需要取消的收藏夹 mlid, 如果你在这个数组混入正确的和错误的收藏夹 mlid, 视频将会从正确的收藏夹删除, 但是会返回code: 11010
   * @returns {Promise<AddFavorite | null>} 返回收藏或者取消收藏的结果信息
   */
  async addFavorite(aid: number, add_media_ids: number[] | null = null, del_media_ids: number[] | null = null): Promise<AddFavorite | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.addFavorite(aid, add_media_ids, del_media_ids);
  }

  /**
   * 检查是否已经收藏视频
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/action.md}
   * @param {number} aid 视频的aid
   * @returns {Promise<isAddFavorited | null>} 返回查询的结果信息
   */
  async checkIsFavorite(aid: number): Promise<isAddFavorited | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.checkIsFavorite(aid);
  }

  /**
   * 一键三连视频，同时点赞投币收藏视频，收藏于默认收藏夹中
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/action.md}
   * @param {number | null = null} aid 必要 (aid和bvid二选一)
   * @param {string | null = null} bvid 必要 (aid和bvid二选一)
   * @returns {Promise<likeTriple | null>} 返回一键三连的结果信息
   */
  async likeTriple(aid: number | null = null, bvid: string | null = null): Promise<likeTriple | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.archiveLikeTriple(aid, bvid);
  }

  /**
   * 分享视频(仅仅为了增加那个分享数)
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/action.md}
   * @param {number | null = null} aid 必要 (aid和bvid二选一)
   * @param {string | null = null} bvid 必要 (aid和bvid二选一)
   * @returns {Promise<ShareVideo | null>} 返回分享的结果信息
   */
  async shareVideo(aid: number | null = null, bvid: string | null = null): Promise<ShareVideo | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.shareVideo(aid, bvid);
  }

  /**
   * 获取视频的标签信息
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/tags.md}
   * @param {number | null = null} aid 必要 (aid和bvid二选一)
   * @param {string | null = null} bvid 必要 (aid和bvid二选一)
   * @returns {Promise<VideoTags | null>} 返回视频的标签信息
   */
  async getVideoTags(aid: number | null = null, bvid: string | null = null): Promise<VideoTags | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getVideoTags(aid, bvid);
  }

  /**
   * 点赞视频标签, 重复访问为取消点赞
   * 貌似已经不再可用，不管点赞什么视频tag都会返回访问权限不足
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/tags.md}
   * @param aid 视频的aid
   * @param tag_id 视频的bvid
   * @returns {Promise<LikeTagResult | null>} 返回点赞标签的结果信息
   */
  async likeTag(aid: number, tag_id: number): Promise<LikeTagResult | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.likeTag(aid, tag_id, this.ctx);
  }

  /**
   * 点踩视频标签, 重复访问为取消点踩
   * 貌似已经不再可用，不管点踩什么视频tag都会返回访问权限不足
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/tags.md}
   * @param aid 
   * @param tag_id 
   * @returns 
   */
  async dislikeTag(aid: number, tag_id: number): Promise<LikeTagResult | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.dislikeTag(aid, tag_id);
  }

  /**
   * 根据视频获取推荐视频列表, 最多40个
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/recommend.md}
   * @param {number | null = null} aid 必要 (aid和bvid二选一)
   * @param {string | null = null} bvid 必要 (aid和bvid二选一)
   * @returns {Promise<RecommandVideo | null>}
   */
  async getRecommandVideoFromSingleVideo(aid: number | null = null, bvid: string | null = null): Promise<RecommandVideo | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    const recommandVideo = await bilibiliVideoAPI.getRecommandVideoFromSingleVideo(aid, bvid);
    return recommandVideo;
  }

  /**
   * 获取主页推荐视频，最多30条推荐视频
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/recommend.md}
   * @param fresh_type 相关性 (非必要，默认为3)
   * @param version web端新旧版本，0为旧版本，1为新版本 (非必要, 默认为1) 
   * @param ps 返回的记录条数 (非必要, 默认为10，version为1时默认为8, 最多可以填写30)
   * @param fresh_idx 翻页相关 (非必要, 默认为1)
   * @param fresh_idx_1h 翻页相关 (非必要, 默认为1)
   * @returns {Promise<RecommendVideoFromMainPage | null>} 返回主页推荐视频
   */
  async getRecommendVideoFromMainPage
    (
      fresh_type: number = 3,
      version: number = 1,
      ps: number = 8,
      fresh_idx: number = 1,
      fresh_idx_1h: number = 1
    ): Promise<RecommendVideoFromMainPage | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    const recommandVideo = await bilibiliVideoAPI.getRecommendVideoFromMainPage(fresh_type, version, ps, fresh_idx, fresh_idx_1h);
    return recommandVideo;
  }

  /**
   * 获取推荐的短视频
   * 有很多意义不明的参数
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/recommend.md}
   * @param fnval 视频流格式标识 (非必要，默认为272)
   * @param force_host 源url类型 (非必要，0:无限制 1:使用http 2:使用https)
   * @param fourk 是否允许 4K 视频 (非必要，画质最高 1080P：0 画质最高 4K：1)
   * @returns {Promise<RecommandVideo | null>} 返回推荐的短视频
   */
  async getRecommendShortVideo(
    fnval: number = 272,
    force_host: number = 2,
    fourk: number = 1
  )
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    const recommandVideo = await bilibiliVideoAPI.getRecommendShortVideo(fnval, force_host, fourk);
    return recommandVideo;
  }

  /**
   * 获取互动视频模块详细信息
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/interact_video.md}
   * @param aid 必要 (aid和bvid二选一)
   * @param bvid 必要 (aid和bvid二选一)
   * @param graph_version 位于player.so中
   * @param edge_id 0或留空为起始模块
   * @returns {Promise<interactVideoDetail | null>} 返回互动视频模块详细信息
   */
  async getInteractiveVideoDetail
    (
      aid: number | null = null,
      bvid: string | null = null,
      graph_version: number,
      edge_id: number | null = null
    ): Promise<interactVideoDetail | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    const recommandVideo = await bilibiliVideoAPI.getInteractiveVideoDetail(aid, bvid, graph_version, edge_id);
    return recommandVideo;
  }

  /**
   * 获取弹幕趋势顶点列表
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/pbp.md}
   * @param cid 必要
   * @param aid 非必要
   * @param bvid 非必要
   * @returns {Promise<HighEnergyBar | null>} 返回弹幕趋势顶点列表
   */
  async getHighEnergyBarList(cid: number, aid: number | null = null, bvid: string | null = null): Promise<HighEnergyBar | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    const recommandVideo = await bilibiliVideoAPI.getHighEnergyBarList(cid, aid, bvid);
    return recommandVideo;

  }

  /**
   * 设置视频的观看历史 (在哪一秒)
   * @see{@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/report.md}
   * @param aid 必要
   * @param cid 必要
   * @param progress 在哪一秒
   * @param platform 平台，可以填写android
   * @returns 
   */
  async setViewHistory(aid: number, cid: number, progress: number = 0, platform: string = 'android'): Promise<reportResult | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.setViewHistory(aid, cid, progress, platform);
  }

  /**
   * 上报视频播放心跳
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/report.md}
   * @param aid 必要 (aid和bvid二选一)
   * @param bvid 必要 (aid和bvid二选一)
   * @param cid 非必要
   * @param epid 非必要，番剧的epid
   * @param sid 非必要，番剧的ssid
   * @param mid 非必要，当前用户mid
   * @param played_time 非必要，视频播放的进度，单位为秒
   * @param realtime 非必要，总计播放事件，单位为秒
   * @param start_ts 非必要，开始播放时刻，时间戳
   * @param type 非必要，视频类型，3为投稿视频，4为剧集，10为课程
   * @param sub_type 非必要，剧集副类型，1为番剧，2为电影，3为纪录片，4为国创，5为电视剧，7为综艺
   * @param dt 非必要
   * @param play_type 播放动作，0为播放中，1为开始播放，2为暂停，3为继续播放 
   * @returns {Promise<reportResult | null>}
   */
  async postHeartbeat
    (
      aid: number | null = null,
      bvid: string | null = null,
      cid: number | null = null,
      epid: number | null = null,
      sid: number | null = null,
      mid: number | null = null,
      played_time: number = 0,
      realtime: number | null = null,
      start_ts: number | null = null,
      type: number | null = null,
      sub_type: number | null = null,
      dt: number | null = null,
      play_type: number | null = null,
    ): Promise<reportResult | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.postHeartbeat(aid, bvid, cid, epid, sid, mid, played_time, realtime, start_ts, type, sub_type, dt, play_type);
  }

  /**
   * 获取视频在线人数
   * @see{@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/online.md}
   * @param aid 必要 (aid和bvid二选一)
   * @param bvid 必要 (aid和bvid二选一)
   * @param cid 必要
   * @returns 
   */
  async getCurrentOnlineViewers(aid: number | null = null, bvid: string | null = null, cid: number): Promise<OnlineViewer | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getCurrentOnlineViewers(aid, bvid, cid);
  }

  /**
   * 获取AI摘要
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/summary.md}
   * @param aid 必要 (aid和bvid二选一)
   * @param bvid 必要 (aid和bvid二选一)
   * @param cid 必要
   * @param up_mid 必要
   * @returns {Promise<AIConclusion | null>}
   */
  async getAIConclusionAboutVideo(
    aid: number | null = null,
    bvid: string | null = null,
    cid: number,
    up_mid: number
  ): Promise<AIConclusion | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.getAIConclusionAboutVideo(aid, bvid, cid, up_mid, this.ctx);
  }

  /**
   * 点赞，取消点赞，点踩，取消点踩AI摘要
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/summary.md}
   * @param aid 必要 (aid和bvid二选一)
   * @param bvid 必要 (aid和bvid二选一)
   * @param cid 必要
   * @param up_mid 非必要
   * @param stid 必要，摘要 id
   * @param like_state 必要，执行操作，1为点赞，2为取消点赞，3为点踩，4为取消点踩
   * @returns {Promise<likeAndDislikeAIConclusion | null>}
   */
  async likeAndDislikeAIConclusion
    (
      aid: number | null = null,
      bvid: string | null = null,
      cid: number,
      up_mid: number | null = null,
      stid: number,
      like_state: 1 | 2 | 3 | 4
    ): Promise<likeAndDislikeAIConclusion | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return await bilibiliVideoAPI.likeAndDislikeAIConclusion(aid, bvid, cid, up_mid, stid, like_state, this.ctx);
  }

  /**
   * 获取投诉类型
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/appeal.md}
   * @returns {AppealType | null}
   */
  async getAppealType(): Promise<AppealType | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return bilibiliVideoAPI.getAppealType();
  }

  /**
   * 投诉稿件
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/appeal.md}
   * @param aid 必要
   * @param tid 必要，投诉理由tid
   * @param desc 必要，投诉理由详细描述
   * @param attach 非必要，附件（多个附件用逗号隔开）
   * @returns {Promise<MakeAppealResult | null>}
   */
  async makeAppeal
    (
      aid: number,
      tid: number,
      desc: string,
      attach: string | null = null
    ): Promise<MakeAppealResult | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return bilibiliVideoAPI.makeAppeal(aid, tid, desc, attach);
  }

  /**
   * 获取视频合集信息
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/collection.md}
   * @param mid 必要，up主的mid
   * @param season_id 必要，合集的id
   * @param sort_reverse 非必要，未知
   * @param page_num 非必要，页码索引
   * @param page_size 非必要，但也内容数量
   * @returns 
   */
  async getSeasonArchivesList
    (
      mid: number,
      season_id: number,
      sort_reverse: boolean | null = null,
      page_num: number | null = null,
      page_size: number | null = null,
    ): Promise<SeasonArchives | null>
  {
    const bilibiliAccountData = await this.getBilibiliAccountData();
    const bilibiliVideoAPI = new BiliBiliVideoApi(bilibiliAccountData);
    return bilibiliVideoAPI.getSeasonArchivesList(mid, season_id, sort_reverse, page_num, page_size);

  }
}