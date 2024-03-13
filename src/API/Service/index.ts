
import { BiliBiliMovie } from './BiliBiliMovie';
import { BiliBiliSearch } from './BiliBiliSearch';
import { BiliBiliLogin } from './BilibiliLogin';
import { BiliBiliVideo } from './BilibiliVideo';
import { BiliBiliLive } from './BiliBiliLive';
export * from './BilibiliLogin'
export * from './BilibiliVideo'
export * from './BiliBiliMovie'
export * from './BiliBiliSearch'
export * from './BiliBiliLive'

declare module 'koishi' {
  interface Context
  {
    BiliBiliLogin: BiliBiliLogin;
    BiliBiliVideo: BiliBiliVideo;
    BiliBiliMovie: BiliBiliMovie;
    BiliBiliSearch: BiliBiliSearch;
    BiliBiliLive:BiliBiliLive;
  }
}