import * as crypto from 'crypto';
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
class CheckRefreshError extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = 'CheckRefreshError'; // 设置自定义的错误名称
    }
}

class GetRefreshCookieError extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = 'GetRefreshCookieError'; // 设置自定义的错误名称
    }
}

export class BiliBiliApi
{
    public async checkNeedRefresh(csrf: string | null, biliBiliSessData: string)
    {
        const url = 'https://passport.bilibili.com/x/passport-login/web/cookie/info';
        const params = new URLSearchParams({
            csrf: csrf
        });
        const headers = {
            Cookie: `SESSDATA=${biliBiliSessData};`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
        };

        const response = await fetch(`${url}?${params}`, { headers });
        if (response.ok)
        {

            const data: Refresh = await response.json();
            if (data.code === 0)
            {
                return data;
            } else
            {
                throw new CheckRefreshError(data.code.toString());
            }
        } else if (!response.ok)
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }


    }

    public async GenerateCrorrespondPath(timestamp: number)
    {
        const publicKey = await crypto.subtle.importKey(
            "jwk",
            {
                kty: "RSA",
                n: "y4HdjgJHBlbaBN04VERG4qNBIFHP6a3GozCl75AihQloSWCXC5HDNgyinEnhaQ_4-gaMud_GF50elYXLlCToR9se9Z8z433U3KjM-3Yx7ptKkmQNAMggQwAVKgq3zYAoidNEWuxpkY_mAitTSRLnsJW-NCTa0bqBFF6Wm1MxgfE",
                e: "AQAB",
            },
            { name: "RSA-OAEP", hash: "SHA-256" },
            true,
            ["encrypt"],
        );
        const data = new TextEncoder().encode(`refresh_${timestamp}`);
        const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, data));
        return encrypted.reduce((str, c) => str + c.toString(16).padStart(2, "0"), "");
    }

    public async getrefresh_csfr(correspondPath: string, biliBiliSessData: string)
    {
        const url = `https://www.bilibili.com/correspond/1/${correspondPath}`;
        const headers = {
            Cookie: `SESSDATA=${biliBiliSessData};`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
        };
        try
        {
            const response = await fetch(url, { headers });

            if (response.ok)
            {
                const htmlContent = await response.text();
                const dom = new JSDOM(htmlContent);
                const refreshCsrf = dom.window.document.querySelector('[id="1-name"]').textContent;
                return refreshCsrf;

            } else if (!response.ok)
            {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error)
        {
            console.error('Error:', error);
            return null;
        }
    }


    /**
     * 刷新并且获取cookie
     * @param csrf CSRF Token, 位于 Cookie 中的bili_jct字段
     * @param refresh_csrf 实时刷新口令，通过getrefresh_csfr 获得
     * @param refresh_token 持久化刷新口令，在localStorage 中的ac_time_value字段
     * @param biliBiliSessData SESSDATA
     * @returns 
     */
    public async refreshCookie(csrf: string, refresh_csrf: string, refresh_token: string, biliBiliSessData: string)
    {
        const url = 'https://passport.bilibili.com/x/passport-login/web/cookie/refresh';

        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Cookie', `SESSDATA=${biliBiliSessData};`);

        const body = new URLSearchParams();
        body.append('csrf', csrf);
        body.append('refresh_csrf', refresh_csrf);
        body.append('source', 'main_web');
        body.append('refresh_token', refresh_token);

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (response.ok)
        {
            const data: RefreshCookiedata = await response.json();

            if (data.code === 0)
            {
                const cookies = response.headers.get('set-cookie');
                const cookiesArray = cookies.split('; ');

                const cookiesObject = {} as CookiesObject;
                for (const cookie of cookiesArray)
                {
                    const [key, value] = cookie.split('=');
                    cookiesObject[key] = value;
                }

                return { data, cookiesObject };
            } else
            {
                throw new GetRefreshCookieError(data.code.toString());
            }
        } else if (!response.ok)
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    }






}