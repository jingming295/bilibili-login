import { BVideoStream, bangumiStream } from "./StreamInterface";
import { sendFetch } from "..";
import { videoStatus } from "./videoStatusInterface";
import { BVideoDetail, BangumiVideoDetail } from "./VideoDetailInterface";
import { LikeVideo } from "./ActionInterface";
import { Snapshot } from "./VideoSnapshotInterface";

export class BiliBiliVideoApi extends sendFetch
{
    /**
     * 主要获取Bangumi的url
     * @param ep bilibili ep
     * @param biliBiliSessData BiliBili SessData
     * @param biliBiliqn BiliBiliqn
     * @returns 
     */
    public async getBangumiStream(ep: number, biliBiliSessData: string, biliBiliqn: number)
    {
        const url = 'https://api.bilibili.com/pgc/player/web/playurl';

        const params = new URLSearchParams({
            ep_id: ep.toString(),
            qn: biliBiliqn.toString(),
            fnval: '1',
            fourk: '1',
            fnver: '0',
        });

        const headers = this.returnBilibiliHeaders(biliBiliSessData);

        const response = await this.sendGet(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: bangumiStream = await response.json();
            if (data.code === 0)
            {
                return data;
            }
        } else
        {
            this.logger.warn('Warn:', response.statusText);
            return null;
        }
    }

    public async getBangumiStreamFromFunctionCompute(ep: number, biliBiliSessData: string, biliBiliqn: number, remoteUrl: string)
    {
        const url = remoteUrl + '/GetBiliBiliBangumiStream';
        const params = {
            ep_id: ep.toString(),
            qn: biliBiliqn.toString(),
            sessdata: biliBiliSessData
        };

        const headers: Headers = this.returnCommonHeaders();

        const response = await this.sendPost(url, new URLSearchParams(params), headers as unknown as Headers);

        if (response.ok)
        {
            const data: bangumiStream = await response.json();
            return data;
        } else
        {
            this.logger.warn('Warn:', response.statusText);
            return null;
        }
    }

    /**
     * 获取Bangumi的各种信息
     * @param ep bilibili ep
     * @returns 
     */
    public async getBangumiData(ep: number, biliBiliSessData: string): Promise<BangumiVideoDetail | null>
    {
        const url = 'https://api.bilibili.com/pgc/view/web/season';
        const params = new URLSearchParams({
            ep_id: ep.toString()
        });

        const headers = this.returnBilibiliHeaders(biliBiliSessData);

        const response = await this.sendGet(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: BangumiVideoDetail = await response.json();
            return data;
        } else
        {
            this.logger.warn('Warn:', response.statusText);
            return null;
        }
    }

    /**
     * 获取视频的各种信息
     * @param bvid bv号
     * @param biliBiliSessData BiliBili SessData 
     * @returns 
     */
    public async getBilibiliVideoData(bvid: string): Promise<BVideoDetail | null>
    {
        const url = `https://api.bilibili.com/x/web-interface/view`;

        const params = new URLSearchParams({
            bvid: bvid
        });
        const headers = this.returnBilibiliHeaders();

        const response = await this.sendGet(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: BVideoDetail = await response.json();
            return data;

        } else
        {
            this.logger.warn('getBilibiliVideoData:', response.statusText);
            return null;
        }
    }


    /**
     * 获取视频的url
     * @param avid bilibili avid
     * @param bvid bilibili bvid
     * @param cid bilibili cid
     * @returns 
     */
    public async getBilibiliVideoStream(avid: number, bvid: string, cid: string, biliBiliPlatform: string, biliBiliqn: number)
    {
        const url = 'https://api.bilibili.com/x/player/wbi/playurl';

        const params = new URLSearchParams({
            bvid: bvid,
            avid: avid.toString(),
            cid: cid,
            qn: biliBiliqn.toString(),
            fnval: (1 | 128).toString(),
            fourk: '1',
            platform: biliBiliPlatform,
            high_quality: '1'
        });

        const headers = this.returnBilibiliHeaders();

        const response = await this.sendGet(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: BVideoStream = await response.json();
            return data;
        } else
        {
            this.logger.warn('getBilibiliVideoStream:', response.statusText);
            return null;
        }
    }

    public async getBilibiliVideoStreamFromFunctionCompute(avid: string, bvid: string, cid: string, biliBiliPlatform: string, biliBiliqn: number, remoteUrl: string)
    {
        const url = remoteUrl + '/GetBiliBiliVideoStream';
        const params = new URLSearchParams({
            bvid: bvid,
            avid: avid,
            cid: cid,
            qn: biliBiliqn.toString(),
            platform: biliBiliPlatform,
            sessdata: this.BilibiliAccountData?.SESSDATA || ''
        });

        const headers: Headers = this.returnCommonHeaders();

        const response = await this.sendPost(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: BVideoStream = await response.json();
            return data;
        } else
        {
            this.logger.warn('Warn:', response.statusText);
            return null;
        }
    }

    /**
     * 获取视频状态数
     * @deprecated 这个接口疑似不再可用
     * @param avid 
     * @returns 
     */
    public async getBilibiliVideoStatus(avid: number)
    {
        const url = 'https://api.bilibili.com/archive_stat/stat';
        const params = new URLSearchParams({
            aid: avid.toString()
        });

        const headers = this.returnCommonHeaders();

        const response = await this.sendGet(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: videoStatus = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getBilibiliVideoStatus: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 获取视频快照
     * @param aid 
     * @param bvid 
     * @param cid 
     * @param index 
     * @returns 
     */
    public async getBilibiliVideoSnapshot(aid: number, bvid: string, cid: string|null = null, index: 1|0 = 0)
    {
        const url = 'https://api.bilibili.com/x/player/videoshot';
        const params = new URLSearchParams({
            bvid: bvid,
            aid: aid.toString(),
            index: index.toString()
        });

        if(cid) params.set('cid', cid);

        const headers = this.returnCommonHeaders();

        const response = await this.sendGet(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: Snapshot = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getBilibiliVideoSnapshot: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 点赞视频
     * @param aid 
     * @param bvid 
     * @param like 1: 点赞 2: 取消点赞, 3: 点踩, 4: 取消点踩
     * @returns 
     */
    public async likeOrDislikeBilibiliVideo(aid:number, bvid:string, like: 1|2|3|4){
        const url = 'https://api.bilibili.com/x/web-interface/archive/like';
        const params = new URLSearchParams({
            aid: aid.toString(),
            bvid: bvid,
            like: like.toString(),
            csrf: this.BilibiliAccountData?.csrf || '',
            source: 'web_normal'
        });

        const headers = this.returnBilibiliHeaders();

        headers.set('content-type', 'application/x-www-form-urlencoded')

        const response = await this.sendPost(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data:LikeVideo = await response.json();
            return data;
        } else
        {
            this.logger.warn(`likeBilibiliVideo: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }


}