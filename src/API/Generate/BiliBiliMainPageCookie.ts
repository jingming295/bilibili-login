import { Context } from 'koishi';
import { } from 'koishi-plugin-puppeteer';
import { MainPageCookie } from './MainPageCookieInterface';
import { Select } from '../Database/select-database';

export class BiliBiliMainPageCookie
{
    async waitForTimeout(milliseconds: number): Promise<void>
    {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
    async gen(ctx: Context)
    {
        const page = await ctx.puppeteer.page();
        page.goto('https://www.bilibili.com');

        await this.waitForTimeout(1000);
        const cookies = await page.cookies();
        let data: MainPageCookie = {};
        cookies.forEach((cookie) => {
            data[cookie.name] = cookie
        })
        return data;
    }
}