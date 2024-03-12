import { Context, Service } from "koishi";
import { BilibiliAccountData } from "../Database/interface";
import { Select } from "../Database/select-database";
import { BiliBiliSearchApi } from "../BiliBiliAPI/BiliBiliSearch";
import { SearchRequest, SearchRequestByType, SearchRequestByTypeArticle, SearchRequestByTypeLive, SearchRequestByTypeLiveRoom, SearchRequestByTypeLiveUser, SearchRequestByTypeMediaBangumiAndMediaFT } from "../..";

export * from '../BiliBiliAPI/BiliBiliSearch/SearchRequestInterface';

export class BiliBiliSearch extends Service
{
    constructor(ctx: Context)
    {
        super(ctx, 'BiliBiliSearch', true);
        this.ctx = ctx;
    }

    /**
     * 获取Bilibili账号数据
     * @returns {Promise<BilibiliAccountData>}
     */
    public async getBilibiliAccountData(): Promise<BilibiliAccountData>
    {
        const select = new Select(this.ctx);
        const data = await select.select();
        const bilibiliAccountData = data[0];
        return bilibiliAccountData;
    }

    /**
     * 综合搜索（web端）
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/search/search_request.md}
     * @param keyword 
     * @returns 
     */
    public async getSearchRequestAll(keyword: string): Promise<SearchRequest | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const biliBiliSearchApi = new BiliBiliSearchApi(bilibiliAccountData);
        return biliBiliSearchApi.getSearchRequestAll(keyword, this.ctx);
    }

    /**
     * 分类搜索（web端）
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/search/search_request.md}
     * @param search_type 必要 搜索目标类型，视频：video 番剧：media_bangumi 影视：media_ft 直播间及主播：live 直播间：live_room 主播：live_user 专栏：article 话题：topic 用户：bili_user 相簿：photo
     * @param keyword 必要 需要搜索的关键词
     * @param page 非必要 页码
     * @param order 非必要 结果排序方式 搜索类型为视频、专栏及相簿时：默认为totalrank 综合排序：totalrank 最多点击：click 最新发布：pubdate 最多弹幕：dm 最多收藏：stow 最多评论：scores 最多喜欢：attention（仅用于专栏） | 搜索结果为直播间时：默认为online 人气直播：online 最新开播：live_time | 搜索结果为用户时：默认为0 默认排序：0 粉丝数：fans 用户等级：level
     * @param order_sort 非必要 用户粉丝数及等级排序顺序 仅用于搜索用户 默认为0 由高到低：0 由低到高：1
     * @param user_type 非必要 仅用于搜索用户 默认为0 全部用户：0 up主：1 普通用户：2 认证用户：3
     * @param duration 非必要 视频时长筛选 仅用于搜索视频 默认为0 全部时长：0 10分钟以下：1 10-30分钟：2 30-60分钟：3 60分钟以上：4
     * @param tids 非必要 视频分区筛选 仅用于搜索视频 默认为0 全部分区：0 筛选分区：目标分区tid
     * @param category_id 非必要 专栏及相簿分区筛选 搜索结果为专栏时：默认为0 全部分区：0 动画：2 游戏：1 影视：28 生活：3 兴趣：29 轻小说：16 科技：17 | 搜索结果为相簿时：默认为0 全部分区：0 画友：1 摄影：2
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
            category_id: number | null = null
        ): Promise<SearchRequestByType | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const biliBiliSearchApi = new BiliBiliSearchApi(bilibiliAccountData);
        return biliBiliSearchApi.getSearchRequestByType(search_type, keyword, page, order, order_sort, user_type, duration, tids, category_id, this.ctx);
    }

    /**
     * 视频搜索（web端）
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/search/search_request.md}
     * @param keyword 必要 需要搜索的关键词
     * @param page 非必要 页码
     * @param order 非必要 结果排序方式 默认为totalrank 综合排序：totalrank 最多点击：click 最新发布：pubdate 最多弹幕：dm 最多收藏：stow 最多评论：scores
     * @param duration 非必要 视频时长筛选 仅用于搜索视频 默认为0 全部时长：0 10分钟以下：1 10-30分钟：2 30-60分钟：3 60分钟以上：4
     * @param tids 非必要 视频分区筛选 默认为0 全部分区：0 筛选分区：目标分区tid
     * @returns {Promise<SearchRequestByTypeVideo>}
     */
    public async getSearchRequestByTypeVideo
        (
            keyword: string,
            page: number | null = null,
            order: string | null = null,
            duration: number | null = null,
            tids: number | null = null,
        )
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const biliBiliSearchApi = new BiliBiliSearchApi(bilibiliAccountData);
        return biliBiliSearchApi.getSearchRequestByTypeVideo(keyword, page, order, duration, tids, this.ctx);
    }

    /**
     * 番剧搜索（web端）
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/search/search_request.md}
     * @param keyword 必要 需要搜索的关键词
     * @param page 非必要 页码
     * @returns {Promise<SearchRequestByTypeMediaBangumiAndMediaFT | null>}
     */
    public async getSearchRequestByTypeMediaBangumi
        (
            keyword: string,
            page: number | null = null,
        ): Promise<SearchRequestByTypeMediaBangumiAndMediaFT | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const biliBiliSearchApi = new BiliBiliSearchApi(bilibiliAccountData);
        return biliBiliSearchApi.getSearchRequestByTypeMediaBangumi(keyword, page, this.ctx);
    }

    /**
     * 影视搜索（web端）
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/search/search_request.md}
     * @param keyword 必要 需要搜索的关键词
     * @param page 非必要 页码
     * @returns {Promise<SearchRequestByTypeMediaBangumiAndMediaFT | null>}
     */
    public async getSearchRequestByTypeMediaFT(
        keyword: string,
        page: number | null = null,
    ): Promise<SearchRequestByTypeMediaBangumiAndMediaFT | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const biliBiliSearchApi = new BiliBiliSearchApi(bilibiliAccountData);
        return biliBiliSearchApi.getSearchRequestByTypeMediaFT(keyword, page, this.ctx);
    }

    /**
     * 直播和主播搜索（web端）
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/search/search_request.md}
     * @param keyword 必要 需要搜索的关键词
     * @param page 非必要 页码
     * @param order 非必要 结果排序方式 默认为online 人气直播：online 最新开播：live_time
     * @returns {Promise<SearchRequestByTypeLive | null>}
     */
    public async getSearchRequestByTypeLiveRoomAndLiveUser(
        keyword: string,
        page: number | null = null,
        order: string | null = null,
    ): Promise<SearchRequestByTypeLive | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const biliBiliSearchApi = new BiliBiliSearchApi(bilibiliAccountData);
        return biliBiliSearchApi.getSearchRequestByTypeLiveRoomAndLiveUser(keyword, page, order, this.ctx);
    }

    /**
     * 直播间搜索（web端）
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/search/search_request.md}
     * @param keyword 必要 需要搜索的关键词
     * @param page 非必要 页码
     * @param order 非必要 结果排序方式 默认为online 人气直播：online 最新开播：live_time
     * @returns {Promise<SearchRequestByTypeLiveRoom | null>}
     */
    public async getSearchRequestByTypeLiveRoom(
        keyword: string,
        page: number | null = null,
        order: string | null = null
    ): Promise<SearchRequestByTypeLiveRoom | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const biliBiliSearchApi = new BiliBiliSearchApi(bilibiliAccountData);
        return biliBiliSearchApi.getSearchRequestByTypeLiveRoom(keyword, page, order, this.ctx);
    }

    /**
     * 主播搜索（web端）
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/search/search_request.md}
     * @param keyword 必要 需要搜索的关键词
     * @param page 非必要 页码
     * @returns {Promise<SearchRequestByTypeLiveUser | null>}
     */
    public async getSearchRequestByTypeLiveUser(
        keyword: string,
        page: number | null = null,
    ): Promise<SearchRequestByTypeLiveUser | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const biliBiliSearchApi = new BiliBiliSearchApi(bilibiliAccountData);
        return biliBiliSearchApi.getSearchRequestByTypeLiveUser(keyword, page, this.ctx);
    }

    /**
     * 专栏搜索（web端）
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/search/search_request.md}
     * @param keyword 必要 需要搜索的关键词
     * @param page 非必要 页码
     * @param order 非必要 结果排序方式 默认为totalrank 综合排序：totalrank 最多点击：click 最新发布：pubdate 最多收藏：stow 最多评论：scores 最多喜欢：attention（仅用于专栏）
     * @param category_id 非必要 专栏及相簿分区筛选 默认为0 全部分区：0 动画：2 游戏：1 影视：28 生活：3 兴趣：29 轻小说：16 科技：17
     * @returns {Promise<SearchRequestByTypeArticle | null>}
     */
    public async getSearchRequestByArticle(
        keyword: string,
        page: number | null = null,
        order: string | null = null,
        category_id: number | null = null
    ): Promise<SearchRequestByTypeArticle | null>
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const biliBiliSearchApi = new BiliBiliSearchApi(bilibiliAccountData);
        return biliBiliSearchApi.getSearchRequestByArticle(keyword, page, order, category_id, this.ctx);
    }

    /**
     * 相簿搜索（web端），他还存在，但是返回的result是空的
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/search/search_request.md}
     * @param keyword 必要 需要搜索的关键词
     * @param page 非必要 页码
     * @param order 非必要 结果排序方式 默认为totalrank 综合排序：totalrank 最多点击：click 最新发布：pubdate 最多收藏：stow 最多评论：scores
     * @param category_id 非必要 专栏及相簿分区筛选 默认为0 全部分区：0 画友：1 摄影：2
     * @returns {Promise<SearchRequestByTypePhoto | null>}
     */
    public async getSearchRequestByPhoto(
        keyword: string,
        page: number | null = null,
        order: string | null = null,
        category_id: number | null = null,
    )
    {
        const bilibiliAccountData = await this.getBilibiliAccountData();
        const biliBiliSearchApi = new BiliBiliSearchApi(bilibiliAccountData);
        return biliBiliSearchApi.getSearchRequestByPhoto(keyword, page, order, category_id, this.ctx);
    }
}