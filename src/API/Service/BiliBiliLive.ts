import { Context, Service } from "koishi";
import { Select } from "../Database/select-database";
import { BilibiliAccountData } from "../Database/interface";
import { BiliBiliLiveApi } from "../BiliBiliAPI/BiliBiliLive";
import { LiveRoomDetail, LiveRoomInitDetail, LiveRoomPlayInfoDetail, LiveRoomStatus, LiveStream, LiveUserDetail } from "../..";

export * from "../BiliBiliAPI/BiliBiliLive/LiveDetailInterface";
export * from "../BiliBiliAPI/BiliBiliLive/LiveStreamInterface";

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
     * @param roomId 必要 直播间号 (可以为短号)
     * @returns {Promise<LiveRoomDetail|null>}
     */
    public async getLiveRoomDetail(roomId: number): Promise<LiveRoomDetail | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliLiveApi = new BiliBiliLiveApi(bilibiliAccountData);
        return await bilibiliLiveApi.getLiveRoomDetail(roomId);
    }

    /**
     * 获取用户对应的直播间状态 (根据用户mid)
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/live/info.md}
     * @param mid 必要 主播mid
     * @returns {Promise<LiveRoomStatus|null>}
     */
    public async getLiveRoomStatusByMid(mid: number): Promise<LiveRoomStatus | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliLiveApi = new BiliBiliLiveApi(bilibiliAccountData);
        return await bilibiliLiveApi.getLiveRoomStatusByMid(mid);
    }

    /**
     * 获取房间页初始化信息
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/live/info.md}
     * @param id 必要 房间号 短号
     * @returns {Promise<LiveRoomInitDetail|null>}
     */
    public async getLiveRoomInitDetail(id: number): Promise<LiveRoomInitDetail | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliLiveApi = new BiliBiliLiveApi(bilibiliAccountData);
        return await bilibiliLiveApi.getLiveRoomInitDetail(id);
    }

    /**
     * 获取主播信息
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/live/info.md}
     * @param uid 必要 主播mid 
     * @returns {Promise<LiveUserDetail|null>}
     */
    public async getLiveUserDetail(uid: number): Promise<LiveUserDetail | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliLiveApi = new BiliBiliLiveApi(bilibiliAccountData);
        return await bilibiliLiveApi.getLiveUserDetail(uid);
    }

    /**
     * 获取直播间信息
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/live/info.md}
     * @param room_id 必要 直播间id
     * @param protocol 必要 直播协议 0：http_stream 1：http_hls 可多选, 使用英文逗号分隔
     * @param format 必要 直播格式 0:flv 1：ts 2：fmp4 可多选, 使用英文逗号分隔
     * @param codec 必要 直播编码 0:avc 1：hevc 可多选, 使用英文逗号分隔
     * @param qn 非必要 清晰度 默认150
     * @param platform 非必要 平台 默认web
     * @param ptype 非必要 我不知道是什么 默认8
     * @param dolby 非必要 dolby 默认5
     * @param panorama 非必要 我不知道是什么 默认1
     * @returns {Promise<LiveRoomPlayInfoDetail|null>}
     */
    public async getLiveRoomPlayInfo
        (
            room_id: number,
            protocol: string,
            format: string,
            codec: string,
            qn: number = 150,
            platform: string = 'web',
            ptype: number = 8,
            dolby: number = 5,
            panorama: number = 1,
        ): Promise<LiveRoomPlayInfoDetail | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliLiveApi = new BiliBiliLiveApi(bilibiliAccountData);
        return await bilibiliLiveApi.getLiveRoomPlayInfo(room_id, protocol, format, codec, qn, platform, ptype, dolby, panorama);
    }

    /**
     * 根据真实直播间号获取直播视频流
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/live/live_stream.md}
     * @param cid 必要 直播间的room_id（非短号）
     * @param platform 非必要 直播流格式 默认为http-flv方式 h5：hls方式 web：http-flv方式
     * @param quality 非必要 (qn与quality任选其一) 画质代码 2：流畅 3：高清 4：原画
     * @param qn 非必要 (qn与quality任选其一) 画质代码 80：流畅 150：高清 400：蓝光 10000：原画 20000：4K 30000：杜比
     * @returns {Promise<LiveStream|null>}
     */
    public async getLiveStream
        (
            cid: number,
            platform: string | null = null,
            quality: number | null = null,
            qn: number | null = null,
        ): Promise<LiveStream | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliLiveApi = new BiliBiliLiveApi(bilibiliAccountData);
        return await bilibiliLiveApi.getLiveStream(cid, platform, quality, qn);
    }

}