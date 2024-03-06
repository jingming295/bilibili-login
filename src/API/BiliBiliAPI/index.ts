import { Logger } from "koishi";
import { BilibiliAccountData, bilibiliLogin } from "../Service";

export class sendFetch {
    public logger:Logger = new Logger('bilibili-login');
    BilibiliAccountData:BilibiliAccountData | undefined
    constructor(BilibiliAccountData:BilibiliAccountData | undefined){
        this.BilibiliAccountData = BilibiliAccountData;
    }

    public async sendGet(url: string, params: URLSearchParams, headers: Headers){
        const fullUrl = `${url}?${params.toString()}`;
        if(!params.get('csrf') && this.BilibiliAccountData) params.set('csrf', this.BilibiliAccountData.csrf)
        if(this.BilibiliAccountData){
            params.set('buvid3', this.BilibiliAccountData.buvid3)
            params.set('buvid4', this.BilibiliAccountData.buvid4)
        }
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: headers
        });
    
        return response;
    }

    public async sendPost(url: string, params: URLSearchParams, headers: Headers){
        if(!params.get('csrf') && this.BilibiliAccountData) params.set('csrf', this.BilibiliAccountData.csrf)
        if(this.BilibiliAccountData){
            params.set('buvid3', this.BilibiliAccountData.buvid3)
            params.set('buvid4', this.BilibiliAccountData.buvid4)
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: params
        });
    
        return response;
    }

    protected returnBilibiliHeaders(biliBiliSessData: string | null = null){
        const headers = new Headers();
        if(biliBiliSessData){
            headers.set('Cookie', `SESSDATA=${biliBiliSessData}; buvid3=${this.BilibiliAccountData?.buvid3}; buvid4=${this.BilibiliAccountData?.buvid4};`);
        } 
        else if(this.BilibiliAccountData) headers.set('Cookie', `SESSDATA=${this.BilibiliAccountData?.SESSDATA};`);
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