import * as crypto from 'crypto';
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

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
         
         try
         {
             const response = await fetch(`${url}?${params}`, { headers });
             if (response.ok)
             {
                
                 const data:Refresh = await response.json();
                 if (data.code === 0)
                 {
                    return data
                 } else
                 {
                    return null
                 }
             } else
             {
                 console.error('Error:', response.status);
                 return null;
             }
         } catch (error)
         {
             console.error('Error:', (error as Error).message);
             return null;
         }
    }

    public async GenerateCrorrespondPath(timestamp:number){

        async function getCorrespondPath(timestamp) {
            const data = new TextEncoder().encode(`refresh_${timestamp}`);
            const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, data))
            return encrypted.reduce((str, c) => str + c.toString(16).padStart(2, "0"), "")
          }

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
          )
          return await getCorrespondPath(timestamp)
    }

    public async getrefresh_csfr(correspondPath:string,biliBiliSessData: string){
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
                return refreshCsrf
                
            } else
            {
                console.error('Error:', response.status);
                return null;
            }
        } catch (error)
        {
            console.error('Error:', error);
            return null;
        }
    }
    



}