import { BVideoStream, bangumiStream } from "./StreamInterface";
import { sendFetch } from "..";
import { videoStatus } from "./VideoStatusInterface";
import { BVideoDetail, BangumiVideoDetail } from "./VideoDetailInterface";
import { AddCoin, AddFavorite, LikeVideo, ShareVideo, hasLiked, isAddFavorited, isAddedCoin, likeTriple } from "./ActionInterface";
import { Snapshot } from "./VideoSnapshotInterface";
import { LikeTagResult, VideoTags } from "./VideoTagsInterface";
import { RecommandVideo, RecommendVideoFromMainPage, RecommentShortVideo } from "./RecommendVideoInterface";

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
    public async getBilibiliVideoStream(avid: number | '' = '', bvid: string | '' = '', cid: string, biliBiliPlatform: string, biliBiliqn: number)
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
    public async getBilibiliVideoSnapshot(aid: number | '' = '', bvid: string | '' = '', cid: string | null = null, index: 1 | 0 = 0)
    {
        const url = 'https://api.bilibili.com/x/player/videoshot';
        const params = new URLSearchParams({
            bvid: bvid,
            aid: aid.toString(),
            index: index.toString()
        });

        if (cid) params.set('cid', cid);

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
    public async likeOrDislikeBilibiliVideo(aid: number | '' = '', bvid: string | '' = '', like: 1 | 2 | 3 | 4)
    {
        const url = 'https://api.bilibili.com/x/web-interface/archive/like';
        const params = new URLSearchParams({
            aid: aid.toString(),
            bvid: bvid,
            like: like.toString(),
            csrf: this.BilibiliAccountData?.csrf || '',
            source: 'web_normal'
        });

        const headers = this.returnBilibiliHeaders();

        headers.set('content-type', 'application/x-www-form-urlencoded');

        const response = await this.sendPost(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: LikeVideo = await response.json();
            return data;
        } else
        {
            this.logger.warn(`likeBilibiliVideo: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 检查是否已经点赞/点踩
     * @param aid 
     * @param bvid 
     * @returns 
     */
    public async checkIsLiked(aid: number | '' = '', bvid: string | '' = ''): Promise<hasLiked | null>
    {
        const url = 'https://api.bilibili.com/x/web-interface/archive/has/like';
        const params = new URLSearchParams({
            aid: aid.toString(),
            bvid: bvid
        });

        const headers = this.returnBilibiliHeaders();

        const response = await this.sendGet(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: hasLiked = await response.json();
            return data;
        } else
        {
            this.logger.warn(`checkIsLiked: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 投币视频
     * @param aid 
     * @param bvid 
     * @param multilpy 
     * @param select_like 
     * @returns 
     */
    public async addCoin(aid: number | '' = '', bvid: string | '' = '', multilpy: 1 | 2, select_like: 0 | 1)
    {
        const url = 'https://api.bilibili.com/x/web-interface/coin/add';
        const params = new URLSearchParams({
            aid: aid.toString(),
            bvid: bvid,
            multiply: multilpy.toString(),
            select_like: select_like.toString(),
            source: 'web_normal',
            eab_x: '2', // 必要，不然无法执行投币但不点赞的操作
            csrf: this.BilibiliAccountData?.csrf || '',
        });

        const headers = this.returnBilibiliHeaders();

        headers.set('content-type', 'application/x-www-form-urlencoded');

        const response = await this.sendPost(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: AddCoin = await response.json();
            return data;
        } else
        {
            this.logger.warn(`addCoin: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 检查是否已经投币
     * @param aid 
     * @param bvid 
     * @returns 
     */
    public async checkIsAddedCoin(aid: number | '' = '', bvid: string | '' = '')
    {
        const url = 'https://api.bilibili.com/x/web-interface/archive/coins';
        const params = new URLSearchParams({
            aid: aid.toString(),
            bvid: bvid,
        });

        const headers = this.returnBilibiliHeaders();

        const response = await this.sendGet(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: isAddedCoin = await response.json();
            return data;
        } else
        {
            this.logger.warn(`checkIsAddedCoin: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 收藏或者取消收藏视频
     * @param aid 
     * @param add_media_ids 
     * @param del_media_ids 
     * @returns 
     */
    public async addFavorite(aid: number, add_media_ids: number[] | null = null, del_media_ids: number[] | null = null)
    {
        const url = 'https://api.bilibili.com/x/v3/fav/resource/deal';
        const params = new URLSearchParams({
            rid: aid.toString(),
            type: '2',
            add_media_ids: add_media_ids?.join(',') || '',
            del_media_ids: del_media_ids?.join(',') || '',
            csrf: this.BilibiliAccountData?.csrf || '',
            eab_x: '2'
        });

        const headers = this.returnBilibiliHeaders();

        headers.set('content-type', 'application/x-www-form-urlencoded');

        const response = await this.sendPost(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: AddFavorite = await response.json();
            return data;
        } else
        {
            this.logger.warn(`AddFavorite: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 检查是否已经收藏
     * @param aid 
     * @returns 
     */
    public async checkIsFavorite(aid: number): Promise<isAddFavorited | null>
    {
        const url = 'https://api.bilibili.com/x/v2/fav/video/favoured';
        const params = new URLSearchParams({
            aid: aid.toString()
        });

        const headers = this.returnBilibiliHeaders();

        const response = await this.sendGet(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: isAddFavorited = await response.json();
            return data;
        } else
        {
            this.logger.warn(`AddFavorite: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 一键三连
     * @param aid 
     * @param bvid 
     * @returns 
     */
    public async archiveLikeTriple(aid: number | '' = '', bvid: string | '' = '')
    {
        const url = 'https://api.bilibili.com/x/web-interface/archive/like/triple';
        const params = new URLSearchParams({
            aid: aid.toString(),
            bvid: bvid,
            csrf: this.BilibiliAccountData?.csrf || ''
        });

        const headers = this.returnBilibiliHeaders();

        headers.set('content-type', 'application/x-www-form-urlencoded');

        const response = await this.sendPost(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: likeTriple = await response.json();
            return data;
        } else
        {
            this.logger.warn(`archiveLikeTriple: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 分享视频（仅仅为了增加那个分享数）
     * @param aid 
     * @param bvid 
     * @returns 
     */
    public async shareVideo(aid: number | '' = '', bvid: string | '' = '')
    {
        const url = 'https://api.bilibili.com/x/web-interface/share/add';
        const params = new URLSearchParams({
            aid: aid.toString(),
            bvid: bvid,
            csrf: this.BilibiliAccountData?.csrf || ''
        });

        const headers = this.returnBilibiliHeaders();

        headers.set('content-type', 'application/x-www-form-urlencoded');

        const response = await this.sendPost(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: ShareVideo = await response.json();
            return data;
        } else
        {
            this.logger.warn(`shareVideo: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 获取视频标签
     * @param aid 
     * @param bvid 
     * @returns 
     */
    public async getVideoTags(aid: number | '' = '', bvid: string | '' = '')
    {
        const url = 'https://api.bilibili.com/x/tag/archive/tags';
        const params = new URLSearchParams({
            aid: aid.toString(),
            bvid: bvid
        });

        const headers = this.returnBilibiliHeaders();

        const response = await this.sendGet(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: VideoTags = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getVideoTags: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 点赞标签, 重复访问会取消点赞
     * @param aid 
     * @param tag_id 
     * @returns 
     */
    public async likeTag(aid: number, tag_id: number)
    {
        const url = 'https://api.bilibili.com/x/tag/archive/like2';
        const params = new URLSearchParams({
            aid: aid.toString(),
            tag_id: tag_id.toString(),
            csrf: this.BilibiliAccountData?.csrf || ''
        });

        const headers = this.returnBilibiliHeaders();

        headers.set('content-type', 'application/x-www-form-urlencoded');

        const response = await this.sendPost(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: LikeTagResult = await response.json();
            return data;
        } else
        {
            this.logger.warn(`likeTag: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 点踩标签, 重复访问会取消点踩
     * @param aid 
     * @param tag_id 
     * @returns 
     */
    public async dislikeTag(aid: number, tag_id: number)
    {
        const url = 'https://api.bilibili.com/x/tag/archive/hate2';
        const params = new URLSearchParams({
            aid: aid.toString(),
            tag_id: tag_id.toString(),
            csrf: this.BilibiliAccountData?.csrf || ''
        });

        const headers = this.returnBilibiliHeaders();

        headers.set('content-type', 'application/x-www-form-urlencoded');

        const response = await this.sendPost(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: LikeTagResult = await response.json();
            return data;
        } else
        {
            this.logger.warn(`dislikeTag: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 根据视频获取推荐视频
     * @param aid 
     * @param bvid 
     * @returns 
     */
    public async getRecommandVideoFromSingleVideo(aid: number | '' = '', bvid: string | '' = '')
    {
        const url = 'https://api.bilibili.com/x/web-interface/archive/related';
        const params = new URLSearchParams({
            aid: aid.toString(),
            bvid: bvid
        });

        const headers = this.returnBilibiliHeaders();

        const response = await this.sendGet(url, params, headers as unknown as Headers);

        if (response.ok)
        {
            const data: RecommandVideo = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getRecommandVideoFromVideo: ${response.statusText} code: ${response.status}`);
            return null;
        }

    }

    /**
     * 获取主页推荐视频
     * @param fresh_type 
     * @param version 
     * @param ps 
     * @param fresh_idx 
     * @param fresh_idx_1h 
     * @returns 
     */
    public async getRecommendVideoFromMainPage
        (
            fresh_type: number = 3,
            version: number = 1,
            ps: number = 8,
            fresh_idx: number = 1,
            fresh_idx_1h: number = 1
        ): Promise<RecommendVideoFromMainPage | null>
    {
        const url = 'https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd';
        const params = new URLSearchParams({
            fresh_type: fresh_type.toString(),
            version: version.toString(),
            ps: ps.toString(),
            fresh_idx: fresh_idx.toString(),
            fresh_idx_1h: fresh_idx_1h.toString()
        });
        const headers = this.returnBilibiliHeaders();

        const response = await this.sendGet(url, params, headers as unknown as Headers);
        if (response.ok)
        {
            const data: RecommendVideoFromMainPage = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getRecommendVideoFromMainPage: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    public async getRecommendShortVideo(
        fnval: number = 272,
        force_host: number = 2,
        fourk: number = 1
    )
    {
        const url = 'https://app.bilibili.com/x/v2/feed/index';
        const headers = this.returnBilibiliHeaders();

        const params = new URLSearchParams({
            fnval: fnval.toString(),
            fnver: '0',
            force_host: force_host.toString(),
            fourk: fourk.toString()
        });

        const response = await this.sendGet(url, params, headers as unknown as Headers);
        if (response.ok)
        {
            const data: RecommentShortVideo = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getShortVideoRecommend: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

}