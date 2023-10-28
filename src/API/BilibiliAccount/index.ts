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
        const biliBiliApi = new BiliBiliApi;
        const refreshData = await biliBiliApi.checkNeedRefresh(config.csrf, config.SESSDATA);
        if (refreshData.code === 0)
        {
            const refreshCookie = await this.getRefreshCookie(refreshData, config.csrf, config.refresh_token, config.SESSDATA);
            if (refreshCookie && refreshCookie.data.code === 0)
            {
                const insert = new Insert(this.ctx);
                insert.insertIntoBilibiliAccountData(refreshCookie.cookiesObject["Secure, bili_jct"], refreshCookie.data.data.refresh_token, refreshCookie.cookiesObject.SESSDATA);
                // console.log(refreshCookie.cookiesObject['Secure, bili_jct'])
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
        if (refreshCookie.data.code === 0) return refreshCookie;
    }

    async DairyCheckRefresh(csrf: string, refresh_token: string, SESSDATA: string)
    {
        try
        {
            const update = new Update(this.ctx)
            const biliBiliApi = new BiliBiliApi();
            const refreshData = await biliBiliApi.checkNeedRefresh(csrf, SESSDATA);
            if (refreshData !== null && refreshData.data.refresh === true)
            {
                const refreshCookie = await this.getRefreshCookie(refreshData, csrf, refresh_token, SESSDATA);
                console.log(refreshCookie);
                update.setBilibiliAccountData(refreshCookie.cookiesObject["Secure, bili_jct"], refreshCookie.data.data.refresh_token, refreshCookie.cookiesObject.SESSDATA)
            }
        } catch (error)
        {
            if ((error as Error).message === '-101' && (error as Error).name === 'CheckRefreshError')
                return this.errorHandle.ErrorHandle('bilibili账号登录失败，极有可能是数据库里面的账号信息失效了');
            if ((error as Error).message === '-101' && (error as Error).name === 'GetRefreshCookieError')
                return this.errorHandle.ErrorHandle('bilibili账号登录失败，极有可能是数据库里面的账号信息失效了');
            if ((error as Error).message === '-111' && (error as Error).name === 'GetRefreshCookieError')
                return this.errorHandle.ErrorHandle('bilibili的csrf校验失败，极有可能是数据库里面的账号信息失效了');
            if ((error as Error).message === '-400' && (error as Error).name === 'GetRefreshCookieError')
                return this.errorHandle.ErrorHandle('GetRefreshCookie请求错误');
            else return this.errorHandle.ErrorHandle((error as Error).message);
        }

    }
}