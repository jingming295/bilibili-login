import { Context, Logger } from "koishi";
import { BiliBiliApi } from "../BiliBiliAPI";
import { Insert } from "../Database/insert-database";
import { ErrorHandle } from "../ErrorHandle";
import { Update } from "../Database/update-database";

export class BilibiliAccount
{
    ctx: Context;
    logger: Logger;
    errorHandle: ErrorHandle;
    constructor(ctx: Context)
    {
        this.ctx = ctx;
        const logger = new Logger('bilibili-login');
        this.logger = logger;
        this.errorHandle = new ErrorHandle();
    }

    /**
     * 初始化
     * @param config 
     */
    async init(config: Config)
    {
        this.logger.info('第一次登录中，正在初始化。。。');
        const biliBiliApi = new BiliBiliApi;
        const refreshData = await biliBiliApi.checkNeedRefresh(config.csrf, config.SESSDATA);
            if (refreshData && refreshData.code === 0)
            {
                this.logger.info('成功登录，正在刷新cookie');
                const refreshCookie = await this.getRefreshCookie(refreshData, config.csrf, config.refresh_token, config.SESSDATA);
                if (refreshCookie && refreshCookie.responseData.code === 0)
                {
                    const insert = new Insert(this.ctx);
                    insert.insertIntoBilibiliAccountData(refreshCookie.cookiesObject.SESSDATA,refreshCookie.cookiesObject.bili_jct, refreshCookie.responseData.data.refresh_token);
                    this.logger.info('cookie保存成功');
                }
            }
    }

    async getRefreshCookie(refreshData: Refresh, csrf: string, refresh_token: string, SESSDATA: string)
    {
        const biliBiliApi = new BiliBiliApi();
        const timestamp = refreshData.data.timestamp;
        // console.log(`timestamp: ${timestamp}`)
        const correspondPath = await biliBiliApi.GenerateCrorrespondPath(timestamp);
        // console.log(`correspondPath: ${correspondPath}`)
        const refreshCsrf = await biliBiliApi.getrefresh_csfr(correspondPath, SESSDATA);
        // console.log(`refreshCsrf: ${refreshCsrf}`)
        const refreshCookie = await biliBiliApi.refreshCookie(csrf, refreshCsrf, refresh_token, SESSDATA);
        // console.log(refreshCookie)
        await biliBiliApi.confirmRefreshCookie(refreshCookie.cookiesObject.bili_jct, refresh_token, refreshCookie.cookiesObject.SESSDATA)
        this.logger.info('成功让旧的cookie失效')
        return refreshCookie;
    }

    async DairyCheckRefresh(csrf: string, refresh_token: string, SESSDATA: string)
    {

        const update = new Update(this.ctx);
        const biliBiliApi = new BiliBiliApi();
        const refreshData = await biliBiliApi.checkNeedRefresh(csrf, SESSDATA);
        if (refreshData.code !== 0) throw new Error(`无法检测账号是否需要刷新, code:${refreshData.code} message:${refreshData.message}`);
        if (refreshData && refreshData.data.refresh === true)
        {
            this.logger.info('检测到需要刷新cookie');
            const refreshCookie = await this.getRefreshCookie(refreshData, csrf, refresh_token, SESSDATA);
            update.setBilibiliAccountData(refreshCookie.cookiesObject.SESSDATA, refreshCookie.cookiesObject.bili_jct, refreshCookie.responseData.data.refresh_token);
            this.logger.info('cookie刷新并保存成功');
        }


    }

    returnBilibiliAccountData(SESSDATA: string, csrf: string, refresh_token: string)
    {
        const BilibiliAccountData: BilibiliAccountData = {
            SESSDATA: SESSDATA,
            csrf: csrf,
            refresh_token: refresh_token
        };
        return BilibiliAccountData;
    }
}