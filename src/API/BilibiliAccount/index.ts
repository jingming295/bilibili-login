import { Context, Logger } from "koishi";
import { BiliBiliLoginApi } from "../BiliBiliAPI/LoginAPI";
import { Insert } from "../Database/insert-database";
import { ErrorHandle } from "../ErrorHandle";
import { Update } from "../Database/update-database";
import { Select } from "../Database/select-database";
import { Config } from "../Configuration";
import { Refresh, qrLogin } from "../BiliBiliAPI/LoginAPI/interface";
import qrcode from 'qrcode-terminal';
import { BilibiliAccountData } from "../Database/interface";

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
    async init()
    {
        function delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        function getRandomInt(min: number, max: number) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        this.logger.info('登录中，正在初始化。。。');
        const select = new Select(this.ctx);
        const bilibiliAccountDataD = await select.select() as unknown as BilibiliAccountData[];
        const bilibiliAccountData = bilibiliAccountDataD[0];
        const biliBiliApi = new BiliBiliLoginApi(bilibiliAccountData);
        const buvid = await biliBiliApi.getBuvid();
        if(!buvid) throw new Error('无法获取buvid')
        const bv_3 = buvid.data.b_3;
        const bv_4 = buvid.data.b_4;

        let qrCode = await biliBiliApi.getQRCode(bv_3, bv_4);
        if (!qrCode) throw new Error('无法获取二维码');
        let qrLogin
        this.logger.info(`请使用B站APP扫描二维码进行登录`);
        qrcode.generate(qrCode.data.url, { small: true },  (qrcode) => {
            this.logger.info(`\n${qrcode}`);
        });
        do
        {
            if(qrCode.code !== 0) throw new Error(`无法验证扫码登录, code:${qrCode.code} message:${qrCode.message}`);
            qrLogin = await biliBiliApi.QRLogin(qrCode.data.qrcode_key, bv_3, bv_4);
            if (!qrLogin) throw new Error('无法验证登录');
            if (qrLogin.data.code === 0)
            {
                break;
            }
            else if(qrLogin.data.code === 86101){
                // 未扫码
            }
            else if (qrLogin.data.code === 86038)
            {
                this.logger.info('二维码已经失效，正在重新获取二维码');
                qrCode = await biliBiliApi.getQRCode(bv_3, bv_4);
                if (!qrCode) throw new Error('无法获取二维码');
                qrcode.generate(qrCode.data.url, { small: true },  (qrcode) => {
                    this.logger.info(`\n${qrcode}`);
                });
            }
            else if (qrLogin.data.code === 86090)
            {
                // 扫码未登录
            }
            await delay(getRandomInt(1800, 2200));
            this.ctx.on('dispose', () => {
                return;
            });
        } while (true);

        const parsedCookie = new URL(qrLogin.data.url)
        const DedeUserID = parsedCookie.searchParams.get('DedeUserID');
        const DedeUserID__ckMd5 = parsedCookie.searchParams.get('DedeUserID__ckMd5');
        const Expires = parsedCookie.searchParams.get('Expires');
        const SESSDATA = parsedCookie.searchParams.get('SESSDATA');
        const bili_jct = parsedCookie.searchParams.get('bili_jct');
        const gourl = parsedCookie.searchParams.get('gourl');
        const refresh_token = qrLogin.data.refresh_token;
        if(!DedeUserID || !DedeUserID__ckMd5 || !Expires || !SESSDATA || !bili_jct || !gourl || !refresh_token) throw new Error('无法解析Cookie');

        const data = await this.checkAccountStatus(bili_jct, SESSDATA);
        if (data && data.code === 0)
        {
            this.logger.info('成功登录');
            const insert = new Insert(this.ctx);
            insert.insertIntoBilibiliAccountData(SESSDATA, bili_jct, refresh_token, DedeUserID, DedeUserID__ckMd5, bv_3, bv_4);
            this.logger.info('cookie保存成功');
        }
    }

    public async checkAccountStatus(bili_jct:string, SESSDATA:string){
        const select = new Select(this.ctx);
        const bilibiliAccountDataD = await select.select() as unknown as BilibiliAccountData[];
        const bilibiliAccountData = bilibiliAccountDataD[0];
        const biliBiliApi = new BiliBiliLoginApi(bilibiliAccountData);
        const accountStatus = await biliBiliApi.accountStatusAPI(bili_jct, SESSDATA);
        return accountStatus
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
        const select = new Select(this.ctx);
        const bilibiliAccountDataD = await select.select() as unknown as BilibiliAccountData[];
        const bilibiliAccountData = bilibiliAccountDataD[0];
        const biliBiliApi = new BiliBiliLoginApi(bilibiliAccountData);
        const timestamp = refreshData.data.timestamp;
        // console.log(`timestamp: ${timestamp}`)
        const correspondPath = await biliBiliApi.GenerateCrorrespondPath(timestamp);
        // console.log(`correspondPath: ${correspondPath}`)
        const refreshCsrf = await biliBiliApi.getrefresh_csfr(correspondPath, SESSDATA);
        // console.log(`refreshCsrf: ${refreshCsrf}`)
        if (!refreshCsrf) throw new Error('无法获取refreshCsrf');
        const refreshCookie = await biliBiliApi.refreshCookie(csrf, refreshCsrf, refresh_token, SESSDATA);
        // console.log(refreshCookie)
        if (!refreshCookie) throw new Error('无法获取refreshCookie');
        await biliBiliApi.confirmRefreshCookie(refreshCookie.bili_jct, refresh_token, refreshCookie.SESSDATA);
        // this.logger.info('成功让旧的cookie失效');
        return refreshCookie;
    }
    async DairyCheckRefresh(csrf: string, refresh_token: string, SESSDATA: string)
    {
        this.logger.info("检查cookie是否需要刷新中。。。。。");
        const update = new Update(this.ctx);
        const select = new Select(this.ctx);
        const bilibiliAccountDataD = await select.select() as unknown as BilibiliAccountData[];
        const bilibiliAccountData = bilibiliAccountDataD[0];
        const biliBiliApi = new BiliBiliLoginApi(bilibiliAccountData);
        const refreshData = await biliBiliApi.accountStatusAPI(csrf, SESSDATA);
        if (!refreshData) throw new Error('无法检测账号是否需要刷新');
        if (refreshData.code !== 0) throw new Error(`无法检测账号是否需要刷新, code:${refreshData.code} message:${refreshData.message}`);
        if (!refreshData.data.refresh)
        {
            this.logger.info('目前还不需要刷新cookie');
        }
        if (refreshData && refreshData.data.refresh === true)
        {
            this.logger.info('检测到需要刷新cookie');
            const buvid = await biliBiliApi.getBuvid();
            if (!buvid) throw new Error('无法获取buvid');
            const bv_3 = buvid.data.b_3;
            const bv_4 = buvid.data.b_4;
            const refreshCookie = await this.getRefreshCookie(refreshData, csrf, refresh_token, SESSDATA);
            update.setBilibiliAccountData(refreshCookie.SESSDATA, refreshCookie.bili_jct, refreshCookie.refresh_token, refreshCookie.DedeUserID, refreshCookie.DedeUserID__ckMd5, bv_3, bv_4);
            this.logger.info('cookie已刷新，并且保存成功');
        }
    }
}