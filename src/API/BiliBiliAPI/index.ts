const crypto = require('crypto');
import axios from 'axios';
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

export class BiliBiliApi
{
    public async checkNeedRefresh(csrf: string, biliBiliSessData: string)
    {
        const url = 'https://passport.bilibili.com/x/passport-login/web/cookie/info';
        const params = new URLSearchParams({
            csrf: csrf
        });
        const headers = {
            Cookie: `SESSDATA=${biliBiliSessData};`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
        };
        const response = await axios.get(`${url}?${params.toString()}`, { headers });

        if (response.status === 200)
        {
            const data: Refresh = response.data;
            if (data.code === 0)
            {
                return data;
            } else
            {
                throw new Error(`checkNeedRefresh code:${data.code} message: ${data.message}`);
            }
        } else
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    }

    async GenerateCrorrespondPath(timestamp:number) {
        const publicKeyData = {
            kty: "RSA",
            n: "y4HdjgJHBlbaBN04VERG4qNBIFHP6a3GozCl75AihQloSWCXC5HDNgyinEnhaQ_4-gaMud_GF50elYXLlCToR9se9Z8z433U3KjM-3Yx7ptKkmQNAMggQwAVKgq3zYAoidNEWuxpkY_mAitTSRLnsJW-NCTa0bqBFF6Wm1MxgfE",
            e: "AQAB",
        };
    
        const publicKey = await crypto.webcrypto.subtle.importKey(
            "jwk",
            publicKeyData,
            { name: "RSA-OAEP", hash: "SHA-256" },
            true,
            ["encrypt"]
        );
    
        const data = new TextEncoder().encode(`refresh_${timestamp}`);
        const encrypted = new Uint8Array(await crypto.webcrypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, data));
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
            const response = await axios.get(url, { headers });

            if (response.status === 200)
            {
                const htmlContent = response.data;
                const dom = new JSDOM(htmlContent);
                const refreshCsrf: string = dom.window.document.querySelector('[id="1-name"]').textContent;
                return refreshCsrf;

            } else
            {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error)
        {
            console.error('Error:', error);
            throw error;
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
        function parseCookies(cookiesArray: string[]): CookiesObject
        {
            const cookiesObject: CookiesObject = {} as CookiesObject;

            for (const cookie of cookiesArray)
            {
                const [name, value] = cookie.split('=');
                const trimmedValue = value.split(';')[0]; // 去掉分号后面的内容
                switch (name)
                {
                    case 'SESSDATA':
                        cookiesObject.SESSDATA = decodeURIComponent(trimmedValue);
                        break;
                    case 'bili_jct':
                        cookiesObject.bili_jct = decodeURIComponent(trimmedValue);
                        break;
                    case 'DedeUserID':
                        cookiesObject.DedeUserID = decodeURIComponent(trimmedValue);
                        break;
                    case 'DedeUserID__ckMd5':
                        cookiesObject.DedeUserID__ckMd5 = decodeURIComponent(trimmedValue);
                        break;
                    case 'sid':
                        cookiesObject.sid = decodeURIComponent(trimmedValue);
                        break;
                }
            }

            return cookiesObject;
        }
        const url = 'https://passport.bilibili.com/x/passport-login/web/cookie/refresh';

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: `SESSDATA=${biliBiliSessData};`
        };

        const data = new URLSearchParams();
        data.append('csrf', csrf);
        data.append('refresh_csrf', refresh_csrf);
        data.append('source', 'main_web');
        data.append('refresh_token', refresh_token);
        const response = await axios.post(url, data, {
            headers: headers
        });

        if (response.status === 200)
        {
            const responseData: RefreshCookiedata = response.data;
            switch (responseData.code)
            {
                case 0:
                    const cookies = response.headers['set-cookie'];
                    if (!cookies) throw new Error('GetRefreshCookie: 获取的cookie为空');

                    const cookiesObject = parseCookies(cookies);

                    return { responseData, cookiesObject };

                case -101:
                    throw new Error('bilibili账号登录失败，极有可能是数据库里面的账号信息失效了');

                case -111:
                    throw new Error('bilibili的csrf校验失败，极有可能是数据库里面的账号信息失效了');

                default:
                    throw new Error(`GetRefreshCookie code:${responseData.code}, message:${responseData.message}`);
            }
        } else
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }

    public async confirmRefreshCookie(csrf: string, refresh_token: string, biliBiliSessData: string)
    {

        const url = 'https://passport.bilibili.com/x/passport-login/web/confirm/refresh';

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: `SESSDATA=${biliBiliSessData};`
        };

        const data = new URLSearchParams();
        data.append('csrf', csrf);
        data.append('refresh_token', refresh_token);
        const response = await axios.post(url, data, {
            headers: headers
        });

        if (response.status === 200)
        {
            const responseData: RefreshCookiedata = response.data;
            switch (responseData.code)
            {
                case 0:
                    
                break
                case -101:
                    throw new Error('bilibili账号登录失败，极有可能是数据库里面的账号信息失效了');

                case -111:
                    throw new Error('bilibili的csrf校验失败，极有可能是数据库里面的账号信息失效了');

                default:
                    throw new Error(`GetRefreshCookie code:${responseData.code}, message:${responseData.message}`);
            }
        } else
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }


    }

}