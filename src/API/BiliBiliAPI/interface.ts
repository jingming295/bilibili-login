interface Refresh {
    code: number;
    message: string;
    ttl: number;
    data: {
      refresh: boolean;
      timestamp: number;
    };
  }
  


  interface RefreshCookieData {
    RefreshCookiedata: RefreshCookiedata;
    cookiesObject: CookiesObject;
  }

  interface RefreshCookiedata {
    code: number;
    message: string;
    ttl: number;
    data: {
      status: number;
      message: string;
      refresh_token: string;
    }
  }
  
  interface CookiesObject {
    SESSDATA: string;
    Path: string;
    Domain: string;
    Expires: string;
    HttpOnly: string | undefined;
    'Secure, bili_jct': string;
  }