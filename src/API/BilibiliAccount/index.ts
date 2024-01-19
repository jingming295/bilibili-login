import { Context, Logger } from "koishi";
import { BiliBiliApi } from "../BiliBiliAPI";
import { Insert } from "../Database/insert-database";
import { ErrorHandle } from "../ErrorHandle";
import { Update } from "../Database/update-database";
import { Select } from "../Database/select-database";
import { Config } from "../Configuration";

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
                insert.insertIntoBilibiliAccountData(refreshCookie.cookiesObject.SESSDATA, refreshCookie.cookiesObject.bili_jct, refreshCookie.responseData.data.refresh_token, refreshCookie.cookiesObject.DedeUserID, refreshCookie.cookiesObject.DedeUserID__ckMd5, refreshCookie.cookiesObject.sid);
                this.logger.info('cookie保存成功');
            }
        }
    }

    async intervalTask(select: Select, update: Update, Config: Config, refreshAccountInterval: NodeJS.Timeout | undefined)
    {
        const bilibiliAccountData = await select.select();
        await this.DairyCheckRefresh(bilibiliAccountData[0].csrf, bilibiliAccountData[0].refresh_token, bilibiliAccountData[0].SESSDATA);
        // 设置定时任务，每隔24小时执行一次
        const refreshTime = Config.RefreshTimeHours;
        let randomInterval = Math.floor(Math.random() * (3600000 * 1));
        let interval = refreshTime * 3600000 + randomInterval;

        refreshAccountInterval = setInterval(async () =>
        {
            try
            {
                randomInterval = Math.floor(Math.random() * (3600000 * 1));
                interval = refreshTime * 3600000 + randomInterval;
                await this.DairyCheckRefresh(bilibiliAccountData[0].csrf, bilibiliAccountData[0].refresh_token, bilibiliAccountData[0].SESSDATA);
            } catch (error)
            {
                this.logger.warn(error);
                const bilibiliAccountData = await select.select();
                if (bilibiliAccountData)
                {
                    update.deleteBilibiliAccountData();
                    this.logger.warn(
                        `抱歉，我们遇到了一些问题，具体是${(error as Error).message}，导致数据库中的数据发生错误。为了解决这个问题，我们已经自动删除了相关数据，并取消了自动任务。
                        \n请您按照以下步骤重新配置插件：
                        \n1. 获取新的Cookie：请重新获取您的Cookie，并确保它是最新的。
                        \n2. 更新配置：将新的Cookie输入到插件的配置中。
                        \n3. 请到github页面开一个issue，附带日志输出内容 [https://github.com/jingming295/bilibili-login]
                    `
                    );
                }
                clearInterval(refreshAccountInterval);
            }

        }, interval);
        return refreshAccountInterval;
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
        await biliBiliApi.confirmRefreshCookie(refreshCookie.cookiesObject.bili_jct, refresh_token, refreshCookie.cookiesObject.SESSDATA);
        this.logger.info('成功让旧的cookie失效');
        return refreshCookie;
    }

    async DairyCheckRefresh(csrf: string, refresh_token: string, SESSDATA: string)
    {
        this.logger.info("检查cookie是否需要刷新中。。。。。");
        const update = new Update(this.ctx);
        const biliBiliApi = new BiliBiliApi();
        const refreshData = await biliBiliApi.checkNeedRefresh(csrf, SESSDATA);
        if (refreshData.code !== 0) throw new Error(`无法检测账号是否需要刷新, code:${refreshData.code} message:${refreshData.message}`);
        if (!refreshData.data.refresh)
        {
            this.logger.info('目前还不需要刷新cookie');
        }
        if (refreshData && refreshData.data.refresh === true)
        {
            this.logger.info('检测到需要刷新cookie');
            const refreshCookie = await this.getRefreshCookie(refreshData, csrf, refresh_token, SESSDATA);
            update.setBilibiliAccountData(refreshCookie.cookiesObject.SESSDATA, refreshCookie.cookiesObject.bili_jct, refreshCookie.responseData.data.refresh_token, refreshCookie.cookiesObject.DedeUserID, refreshCookie.cookiesObject.DedeUserID__ckMd5, refreshCookie.cookiesObject.sid);
            this.logger.info('cookie已刷新，并且保存成功');
        }


    }
}