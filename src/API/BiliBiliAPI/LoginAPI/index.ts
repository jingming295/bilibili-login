const crypto = require('crypto');
import { QRcode, Refresh, RefreshCookiedata, buvid, qrLogin } from './interface';
import { sendFetch } from '..';
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

export class BiliBiliLoginApi extends sendFetch
{
    public async QRLogin(qrcode_key: string, bv3: string, bv4: string){
        const url = 'https://passport.bilibili.com/x/passport-login/web/qrcode/poll';
        const headers = this.returnBilibiliHeaders();
        headers.set('cookie', `buvid3=${bv3}; buvid4=${bv4};`);
        const data = new URLSearchParams({
            qrcode_key: qrcode_key
        });

        const response = await this.sendGet(url, data, headers);

        if (response.ok)
        {
            const responseData: qrLogin = await response.json();
            return responseData;
        } else
        {
            this.logger.warn('Warn:', response.statusText);
            return null;
        }
    }

    async getQRCode(bv3:string, bv4:string){
        const url = 'https://passport.bilibili.com/x/passport-login/web/qrcode/generate';
        const headers = this.returnBilibiliHeaders();
        headers.set('cookie', `buvid3=${bv3}; buvid4=${bv4};`);
        const response = await this.sendGet(url, new URLSearchParams(''), headers);
        if (response.ok)
        {
            const data: QRcode = await response.json();
            return data;
        } else
        {
            this.logger.warn('Warn:', response.statusText);
            return null;
        }
    }

    public async accountStatusAPI(csrf: string, biliBiliSessData: string)
    {
        const url = 'https://passport.bilibili.com/x/passport-login/web/cookie/info';
        const params = new URLSearchParams({
            csrf: csrf
        });
        const headers = this.returnBilibiliHeaders(biliBiliSessData);

        const response = await this.sendGet(url, params, headers);

        if (response.ok)
        {
            const data: Refresh = await response.json();
            if (data.code === 0)
            {
                return data;
            } else
            {
                this.logger.warn(`accountStatusAPI: ${data.message}, code: ${data.code}`);
                throw new Error(`accountStatusAPI: ${data.message}, code: ${data.code}`);
            }
        } else
        {
            this.logger.warn(`accountStatusAPI: ${response.statusText} code: ${response.status}`);
            throw new Error(`accountStatusAPI: ${response.statusText} code: ${response.status}`);
        }
    }

    public async getBuvid(){
        const url = 'https://api.bilibili.com/x/frontend/finger/spi';
        const headers = this.returnBilibiliHeaders();
        const response = await this.sendGet(url, new URLSearchParams(''), headers);
        if (response.ok)
        {
            const data:buvid = await response.json();
            return data;
        } else
        {
            this.logger.warn('Warn:', response.statusText);
            return null;
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
        const headers = this.returnBilibiliHeaders(biliBiliSessData);
        const response = await this.sendGet(url, new URLSearchParams(''), headers);

        if (response.ok){
            const htmlContent = await response.text();
            const dom = new JSDOM(htmlContent);
            const refreshCsrf: string = dom.window.document.querySelector('[id="1-name"]').textContent;
            return refreshCsrf;
        } else {
            this.logger.warn('Warn:', response.statusText);
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
        const data = new URLSearchParams({
            csrf: csrf,
            refresh_csrf: refresh_csrf,
            source: 'main_web',
            refresh_token: refresh_token
        });
        const headers = this.returnBilibiliHeaders(biliBiliSessData);

        const response = await this.sendPost(url, data, headers);

        if (response.ok)
        {
            const data:RefreshCookiedata = await response.json();
            const cookies = response.headers.get('set-cookie');
            if (!cookies) throw new Error('GetRefreshCookie: 获取的cookie为空');
            // 将字符串按逗号分隔成数组
            const cookieArray = cookies.split(', ');

            // 创建一个空对象来存储重组后的 cookie
            const parsedCookies: { [key: string]: string } = {};

            // 遍历数组，解析每个 cookie 并存储到对象中
            cookieArray.forEach(cookie => {
                const cookieParts = cookie.split(';')[0].split('=');
                const key = cookieParts[0];
                const value = cookieParts[1];
                parsedCookies[key] = value;
            });
            console.log(parsedCookies)
            parsedCookies['refresh_token'] = data.data.refresh_token;
            return parsedCookies;
        } else
        {
            this.logger.warn('Warn:', response.statusText);
            return null;
        }
    }

    public async confirmRefreshCookie(csrf: string, refresh_token: string, biliBiliSessData: string)
    {

        const url = 'https://passport.bilibili.com/x/passport-login/web/confirm/refresh';

        const headers = this.returnBilibiliHeaders(biliBiliSessData);

        const data = new URLSearchParams({
            csrf: csrf,
            refresh_token: refresh_token
        });
        data.append('csrf', csrf);
        data.append('refresh_token', refresh_token);

        const response = await this.sendPost(url, data, headers);

        if (response.ok)
        {
            const responseData: RefreshCookiedata = await response.json();
            return responseData;
        } else
        {
            this.logger.warn('Warn:', response.statusText);
            return null;
        }
    }

}