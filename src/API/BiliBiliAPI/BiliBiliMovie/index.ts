import { sendFetch } from "..";
import { AnimeDetailEPSS, AnimeDetailMDID, AnimeSeasonSection } from "./MovieDetailInterface";
import { AnimeStreamFormat } from "./MovieStreamInterface";


export class BiliBiliAnimeApi extends sendFetch
{
    public async getAnimeDetailMDID(media_id: string)
    {
        const url = 'https://api.bilibili.com/pgc/review/user';
        const params = new URLSearchParams({
            media_id: media_id
        });
        const headers = this.returnBilibiliHeaders();
        const response = await this.sendGet(url, params, headers);
        if (response.ok)
        {
            const data: AnimeDetailMDID = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getAnimeDetailMDID: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 获取Bangumi的各种信息
     * @param season_id bilibili season_id
     * @param ep_id bilibili ep_id
     * @returns 
     */
    public async getAnimeDetailEPSS
        (
            season_id: number | null = null,
            ep_id: number | null = null,
        ): Promise<AnimeDetailEPSS | null>
    {
        const url = 'https://api.bilibili.com/pgc/view/web/season';
        const params = new URLSearchParams();

        season_id && params.set('season_id', season_id.toString());
        ep_id && params.set('ep_id', ep_id.toString());

        const headers = this.returnBilibiliHeaders();

        const response = await this.sendGet(url, params, headers);

        if (response.ok)
        {
            const data: AnimeDetailEPSS = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getAnimeDetailEPSS: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    public async getAnimeSeasonSection(season_id: number)
    {
        const url = 'https://api.bilibili.com/pgc/web/season/section';
        const params = new URLSearchParams({
            season_id: season_id.toString()
        });
        const headers = this.returnBilibiliHeaders();
        const response = await this.sendGet(url, params, headers);
        if (response.ok)
        {
            const data: AnimeSeasonSection = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getAnimeSeasonSection: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 主要获取动画的playurl
     * @param ep bilibili ep
     * @param biliBiliSessData BiliBili SessData
     * @param biliBiliqn BiliBiliqn
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
        )
    {
        const url = 'https://api.bilibili.com/pgc/player/web/playurl';

        const params = new URLSearchParams({
            qn: qn.toString(),
            fnval: fnval.toString(),
            fourk: '1',
            fnver: '0',
            from_client: 'BROWSER',
            drm_tech_type: '2',
            is_main_page: true.toString(),
            need_fragment: true.toString(),
            session: 'a6bda9c1aa2a1da81a6ef28d33c6cd8a',
            support_multi_audio: true.toString(),
        });

        avid && params.set('avid', avid.toString());
        bvid && params.set('bvid', bvid.toString());
        ep_id && params.set('ep_id', ep_id.toString());
        cid && params.set('cid', cid.toString());

        const headers = this.returnBilibiliHeaders();

        const response = await this.sendGet(url, params, headers);

        if (response.ok)
        {
            const data: AnimeStreamFormat = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getAnimeStream: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    public async getAnimeStreamFromFunctionCompute(ep: number, biliBiliSessData: string, biliBiliqn: number, remoteUrl: string)
    {
        const url = remoteUrl + '/GetBiliBiliBangumiStream';
        const params = new URLSearchParams({
            ep_id: ep.toString(),
            qn: biliBiliqn.toString(),
            sessdata: biliBiliSessData
        });

        const headers: Headers = this.returnCommonHeaders();

        headers.set('Content-Type', 'application/x-www-form-urlencoded');

        const response = await this.sendPost(url, params, headers);

        if (response.ok)
        {
            const data: AnimeStreamFormat = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getAnimeStreamFromFunctionCompute: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    


}