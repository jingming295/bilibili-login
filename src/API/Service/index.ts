
import { BiliBiliMovie } from './BiliBiliMovie';
import { BiliBiliSearch } from './BiliBiliSearch';
import { BiliBiliLogin } from './BilibiliLogin';
import { BiliBiliVideo } from './BilibiliVideo';
export * from './BilibiliLogin'
export * from './BilibiliVideo'
export * from './BiliBiliMovie'
export * from './BiliBiliSearch'

declare module 'koishi' {
  interface Context
  {
    BiliBiliLogin: BiliBiliLogin;
    BiliBiliVideo: BiliBiliVideo;
    BiliBiliAnime: BiliBiliMovie;
    BiliBiliSearch: BiliBiliSearch;
  }
}