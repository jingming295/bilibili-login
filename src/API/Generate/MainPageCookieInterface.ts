export interface MainPageCookie {
    [key: string]:bCookieObj
}

export declare interface bCookieObj {
    /**
     * Cookie name.
     */
    name: string;
    /**
     * Cookie value.
     */
    value: string;
    /**
     * Cookie domain.
     */
    domain: string;
    /**
     * Cookie path.
     */
    path: string;
    /**
     * Cookie expiration date as the number of seconds since the UNIX epoch. Set to `-1` for
     * session cookies
     */
    expires: number;
    /**
     * Cookie size.
     */
    size: number;
    /**
     * True if cookie is http-only.
     */
    httpOnly: boolean;
    /**
     * True if cookie is secure.
     */
    secure: boolean;
    /**
     * True in case of session cookie.
     */
    session: boolean;
    /**
     * Cookie SameSite type.
     */
    sameSite?: CookieSameSite;
    /**
     * Cookie Priority. Supported only in Chrome.
     */
    priority?: CookiePriority;
    /**
     * True if cookie is SameParty. Supported only in Chrome.
     */
    sameParty?: boolean;
    /**
     * Cookie source scheme type. Supported only in Chrome.
     */
    sourceScheme?: CookieSourceScheme;
    /**
     * Cookie partition key. The site of the top-level URL the browser was visiting at the
     * start of the request to the endpoint that set the cookie. Supported only in Chrome.
     */
    partitionKey?: string;
    /**
     * True if cookie partition key is opaque. Supported only in Chrome.
     */
    partitionKeyOpaque?: boolean;
}

declare type CookieSameSite = 'Strict' | 'Lax' | 'None';
declare type CookieSourceScheme = 'Unset' | 'NonSecure' | 'Secure';
declare type CookiePriority = 'Low' | 'Medium' | 'High';
