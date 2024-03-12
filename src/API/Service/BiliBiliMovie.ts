import { Context, Service } from "koishi";
import { MovieDetailEPSS, MovieDetailMDID, MovieSeasonSection, MovieStreamFormat, BilibiliAccountData } from "../..";
import { Select } from "../Database/select-database";
import { BiliBiliMovieApi } from "../BiliBiliAPI/BiliBiliMovie";

export * from '../BiliBiliAPI/BiliBiliMovie/MovieStreamInterface';
export * from '../BiliBiliAPI/BiliBiliMovie/MovieDetailInterface';

export class BiliBiliMovie extends Service
{
    constructor(ctx: Context)
    {
        super(ctx, 'BiliBiliMovie', true);
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
     * @returns {Promise<MovieDetailMDID | null>}
     */
    public async getMovieDetailMDID(media_id: string): Promise<MovieDetailMDID | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliMovieAPI = new BiliBiliMovieApi(bilibiliAccountData);
        return bilibiliMovieAPI.getMovieDetailMDID(media_id);
    }

    /**
     * 获取剧集明细（web端）（ssid/epid方式）
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/bangumi/info.md}
     * @param season_id 必要 (season_id 和 ep_id 二选一)
     * @param ep_id  必要 (season_id 和 ep_id 二选一)
     * @returns 
     */
    public async getMovieDetailEPSS
        (
            season_id: number | null = null,
            ep_id: number | null = null,
        ): Promise<MovieDetailEPSS | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliMovieAPI = new BiliBiliMovieApi(bilibiliAccountData);
        return bilibiliMovieAPI.getMovieDetailEPSS(season_id, ep_id);
    }

    /**
     * 获取剧集分集信息
     * @see{@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/bangumi/info.md}
     * @param season_id 必要，剧集ssid
     * @returns {Promise<MovieSeasonSection | null>}
     */
    public async getMovieSeasonSection(season_id: number): Promise<MovieSeasonSection | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliMovieAPI = new BiliBiliMovieApi(bilibiliAccountData);
        return bilibiliMovieAPI.getMovieSeasonSection(season_id);
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
    public async getMovieStream
        (
            avid: number | null = null,
            bvid: number | null = null,
            ep_id: number | null = null,
            cid: number | null = null,
            qn: number,
            fnval: number = 1
        ) : Promise<MovieStreamFormat | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliMovieAPI = new BiliBiliMovieApi(bilibiliAccountData);
        return bilibiliMovieAPI.getMovieStream(avid, bvid, ep_id, cid, qn, fnval);
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
    public async getMovieStreamFromFunctionCompute(ep: number, biliBiliSessData: string, biliBiliqn: number, remoteUrl: string): Promise<MovieStreamFormat | null>{
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const bilibiliMovieAPI = new BiliBiliMovieApi(bilibiliAccountData);
        return bilibiliMovieAPI.getMovieStreamFromFunctionCompute(ep, biliBiliSessData, biliBiliqn, remoteUrl);
    }

}