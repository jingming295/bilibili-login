import { Context } from "koishi";
import { SendFetch } from "..";
import { WBI } from "../../Crypto/WBI";
import { SearchRequest, SearchRequestByType, SearchRequestByTypeArticle, SearchRequestByTypeLive, SearchRequestByTypeLiveRoom, SearchRequestByTypeLiveUser, SearchRequestByTypeMediaBangumiAndMediaFT, SearchRequestByTypePhoto, SearchRequestByTypeVideo } from "./SearchRequestInterface";

export class BiliBiliSearchApi extends SendFetch
{

    /**
     * 综合搜索（web端）
     * @param keyword 
     * @param ctx 
     * @returns 
     */
    public async getSearchRequestAll(keyword: string, ctx: Context)
    {
        const url = 'https://api.bilibili.com/x/web-interface/wbi/search/all/v2';
        const params = new URLSearchParams({
            keyword: keyword,
            search_type: 'article'
        });

        const wbi = new WBI(ctx);

        const { w_rid, wts } = await wbi.main(params);

        w_rid && params.append('w_rid', w_rid);
        wts && params.append('wts', wts.toString());

        const headers = this.returnBilibiliHeaders();

        const response = await this.sendGet(url, params, headers);

        if (response.ok)
        {
            const data: SearchRequest = await response.json();
            return data;

        } else
        {
            this.logger.warn(`getSearchRequestAll: ${response.statusText} code: ${response.status}`);
            return null;
        }


    }

    /**
     * 分类搜索（web端）
     * @param search_type 
     * @param keyword 
     * @param page 
     * @param order 
     * @param order_sort 
     * @param user_type 
     * @param duration 
     * @param tids 
     * @param category_id 
     * @param ctx 
     * @returns 
     */
    public async getSearchRequestByType
        (
            search_type: string,
            keyword: string,
            page: number | null = null,
            order: string | null = null,
            order_sort: string | null = null,
            user_type: number | null = null,
            duration: number | null = null,
            tids: number | null = null,
            category_id: number | null = null,
            ctx: Context
        )
    {
        const url = 'https://api.bilibili.com/x/web-interface/wbi/search/type';
        const params = new URLSearchParams({
            search_type: search_type,
            keyword: keyword
        });

        page && params.append('page', page.toString());
        order && params.append('order', order);
        order_sort && params.append('order_sort', order_sort);
        user_type && params.append('user_type', user_type.toString());
        duration && params.append('duration', duration.toString());
        tids && params.append('tids', tids.toString());
        category_id && params.append('category_id', category_id.toString());

        const wbi = new WBI(ctx);
        const { w_rid, wts } = await wbi.main(params);
        w_rid && params.append('w_rid', w_rid);
        wts && params.append('wts', wts.toString());

        const headers = this.returnBilibiliHeaders();
        const response = await this.sendGet(url, params, headers);
        if (response.ok)
        {
            const data = await response.json();
            return data;

        } else
        {
            this.logger.warn(`getSearchRequestByType: ${response.statusText} code: ${response.status}`);
            return null;
        }

    }

    /**
     * 视频搜索（web端）
     * @param keyword 
     * @param page 
     * @param order 
     * @param duration 
     * @param tids 
     * @param ctx 
     * @returns 
     */
    public async getSearchRequestByTypeVideo(
        keyword: string,
        page: number | null = null,
        order: string | null = null,
        duration: number | null = null,
        tids: number | null = null,
        ctx: Context
    )
    {
        const data: SearchRequestByTypeVideo = await this.getSearchRequestByType('video', keyword, page, order, null, null, duration, tids, null, ctx);
        return data;
    }

    /**
     * 番剧搜索（web端）
     * @param keyword // 需要搜索的关键词
     * @param page // 页码
     * @param ctx
     * @returns 
     */
    public async getSearchRequestByTypeMediaBangumi
        (
            keyword: string,
            page: number | null = null,
            ctx: Context
        )
    {
        const data: SearchRequestByTypeMediaBangumiAndMediaFT = await this.getSearchRequestByType('media_bangumi', keyword, page, null, null, null, null, null, null, ctx);
        return data;
    }

    /**
     * 影视搜索（web端）
     * @param keyword 
     * @param page 
     * @param ctx 
     * @returns 
     */
    public async getSearchRequestByTypeMediaFT
        (
            keyword: string,
            page: number | null = null,
            ctx: Context
        )
    {
        const data: SearchRequestByTypeMediaBangumiAndMediaFT = await this.getSearchRequestByType('media_ft', keyword, page, null, null, null, null, null, null, ctx);
        return data;
    }

    /**
     * 直播间和主播搜索（web端）
     * @param keyword 
     * @param page 
     * @param order 
     * @param ctx 
     * @returns 
     */
    public async getSearchRequestByTypeLiveRoomAndLiveUser(
        keyword: string,
        page: number | null = null,
        order: string | null = null,
        ctx: Context
    )
    {
        const data: SearchRequestByTypeLive = await this.getSearchRequestByType('live', keyword, page, order, null, null, null, null, null, ctx);
        return data;
    }

    /**
     * 直播间搜索（web端）
     * @param keyword 
     * @param page 
     * @param order 
     * @param ctx 
     * @returns 
     */
    public async getSearchRequestByTypeLiveRoom(
        keyword: string,
        page: number | null = null,
        order: string | null = null,
        ctx: Context
    )
    {
        const data: SearchRequestByTypeLiveRoom = await this.getSearchRequestByType('live_room', keyword, page, order, null, null, null, null, null, ctx);
        return data;
    }

    /**
     * 主播搜索（web端）
     * @param keyword 
     * @param page 
     * @param ctx 
     * @returns 
     */
    public async getSearchRequestByTypeLiveUser(
        keyword: string,
        page: number | null = null,
        ctx: Context
    )
    {
        const data: SearchRequestByTypeLiveUser = await this.getSearchRequestByType('live_user', keyword, page, null, null, null, null, null, null, ctx);
        return data;
    }

    /**
     * 专栏搜索（web端）
     * @param keyword 
     * @param page 
     * @param order 
     * @param category_id 
     * @param ctx 
     * @returns 
     */
    public async getSearchRequestByArticle(
        keyword: string,
        page: number | null = null,
        order: string | null = null,
        category_id: number | null = null,
        ctx: Context)
    {
        const data: SearchRequestByTypeArticle = await this.getSearchRequestByType('photo', keyword, page, order, null, null, null, null, category_id, ctx);
        return data;
    }

    /**
     * 相簿搜索（web端），他还存在，但是返回的result是空的
     * @param keyword 
     * @param page 
     * @param order 
     * @param category_id 
     * @param ctx 
     * @returns 
     */
    public async getSearchRequestByPhoto(
        keyword: string,
        page: number | null = null,
        order: string | null = null,
        category_id: number | null = null,
        ctx: Context)
    {
        const data:SearchRequestByTypePhoto = await this.getSearchRequestByType('photo', keyword, page, order, null, null, null, null, category_id, ctx);
        return data;
    }

}