
import { BiliBiliAnime } from './BiliBiliAnime';
import { BiliBiliSearch } from './BiliBiliSearch';
import { BiliBiliLogin } from './BilibiliLogin';
import { BiliBiliVideo } from './BilibiliVideo';
export * from './BilibiliLogin'
export * from './BilibiliVideo'
export * from './BiliBiliAnime'
export * from './BiliBiliSearch'

declare module 'koishi' {
  interface Context
  {
    BiliBiliLogin: BiliBiliLogin;
    BiliBiliVideo: BiliBiliVideo;
    BiliBiliAnime: BiliBiliAnime;
    BiliBiliSearch: BiliBiliSearch;
  }
}