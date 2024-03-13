import { Logger } from "koishi";
import { BilibiliAccountData } from "../Service";

export class SendFetch
{
    public logger: Logger = new Logger('bilibili-login');
    BilibiliAccountData: BilibiliAccountData | undefined;
    constructor(BilibiliAccountData: BilibiliAccountData | undefined)
    {
        this.BilibiliAccountData = BilibiliAccountData;
    }

    public async sendGet(url: string, params: URLSearchParams, headers: Headers)
    {
        const fullUrl = `${url}?${params.toString()}`;
        if (!params.get('csrf') && this.BilibiliAccountData) params.set('csrf', this.BilibiliAccountData.csrf);
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: headers
        });
        return response;
    }

    public async sendPost(url: string, params: URLSearchParams, headers: Headers)
    {
        if (!params.get('csrf') && this.BilibiliAccountData) params.set('csrf', this.BilibiliAccountData.csrf);
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: params
        });

        return response;
    }

    protected returnBilibiliHeaders(biliBiliSessData: string | null = null)
    {
        const headers = new Headers();

        if (biliBiliSessData)
        {
            headers.set(
                'Cookie', `SESSDATA=${biliBiliSessData};`
            );
            // console.log(headers.get('Cookie'))
        }
        else if (this.BilibiliAccountData)
        {
            const cookieString = Object.entries(this.BilibiliAccountData)
                .filter(([key, value]) => value !== undefined && value !== null && value !== '' && key !== 'id')
                .map(([key, value]) => `${key}=${value}`)
                .join(';');
            headers.set('Cookie', cookieString);

        }
        headers.set('referer', 'https://www.bilibili.com');
        headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36');
        return headers;
    }

    protected returnCommonHeaders()
    {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        return headers;
    }
}