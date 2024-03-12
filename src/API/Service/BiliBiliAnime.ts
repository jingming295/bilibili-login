import { Context, Service } from "koishi";
import { AnimeDetailEPSS, AnimeDetailMDID, AnimeSeasonSection, AnimeStreamFormat, BilibiliAccountData } from "../..";
import { Select } from "../Database/select-database";
import { BiliBiliAnimeApi } from "../BiliBiliAPI/BiliBiliAnime";
import { promises } from "dns";

export * from '../BiliBiliAPI/BiliBiliAnime/AnimeStreamInterface';
export * from '../BiliBiliAPI/BiliBiliAnime/AnimeDetailInterface';

export class BiliBiliAnime extends Service
{
    constructor(ctx: Context)
    {
        super(ctx, 'BiliBiliAnime', true);
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
     * 获取剧集明细（web端）（mdid方式）
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/bangumi/info.md}
     * @param media_id 必要，剧集mdid
     * @returns {Promise<AnimeDetailMDID | null>}
     */
    public async getAnimeDetailMDID(media_id: string): Promise<AnimeDetailMDID | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliAnimeAPI = new BiliBiliAnimeApi(bilibiliAccountData);
        return bilibiliAnimeAPI.getAnimeDetailMDID(media_id);
    }

    /**
     * 获取剧集明细（web端）（ssid/epid方式）
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/bangumi/info.md}
     * @param season_id 必要 (season_id 和 ep_id 二选一)
     * @param ep_id  必要 (season_id 和 ep_id 二选一)
     * @returns 
     */
    public async getAnimeDetailEPSS
        (
            season_id: number | null = null,
            ep_id: number | null = null,
        ): Promise<AnimeDetailEPSS | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliAnimeAPI = new BiliBiliAnimeApi(bilibiliAccountData);
        return bilibiliAnimeAPI.getAnimeDetailEPSS(season_id, ep_id);
    }

    /**
     * 获取剧集分集信息
     * @see{@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/bangumi/info.md}
     * @param season_id 必要，剧集ssid
     * @returns {Promise<AnimeSeasonSection | null>}
     */
    public async getAnimeSeasonSection(season_id: number): Promise<AnimeSeasonSection | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliAnimeAPI = new BiliBiliAnimeApi(bilibiliAccountData);
        return bilibiliAnimeAPI.getAnimeSeasonSection(season_id);
    }

    /**
     * @{@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/bangumi/videostream_url.md}
     * @param avid 
     * @param bvid 
     * @param ep_id 
     * @param cid 
     * @param qn 
     * @param fnval 
     * @returns 
     */
    public async getAnimeStream
        (
            avid: number | null = null,
            bvid: number | null = null,
            ep_id: number | null = null,
            cid: number | null = null,
            qn: number,
            fnval: number = 1
        ) : Promise<AnimeStreamFormat | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliAnimeAPI = new BiliBiliAnimeApi(bilibiliAccountData);
        return bilibiliAnimeAPI.getAnimeStream(avid, bvid, ep_id, cid, qn, fnval);
    }

    /**
     * 从function compute获取动画的playurl，自用，想知道可以和作者说
     * @{@link }
     * @param ep 
     * @param biliBiliSessData 
     * @param biliBiliqn 
     * @param remoteUrl 
     * @returns 
     */
    public async getAnimeStreamFromFunctionCompute(ep: number, biliBiliSessData: string, biliBiliqn: number, remoteUrl: string): Promise<AnimeStreamFormat | null>{
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliAnimeAPI = new BiliBiliAnimeApi(bilibiliAccountData);
        return bilibiliAnimeAPI.getAnimeStreamFromFunctionCompute(ep, biliBiliSessData, biliBiliqn, remoteUrl);
    }

}