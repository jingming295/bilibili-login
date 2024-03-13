
import { BiliBiliMovie } from './BiliBiliMovie';
import { BiliBiliSearch } from './BiliBiliSearch';
import { BiliBiliLogin } from './BiliBiliLogin';
import { BiliBiliVideo } from './BiliBiliVideo';
import { BiliBiliLive } from './BiliBiliLive';
export * from './BiliBiliLogin'
export * from './BiliBiliVideo'
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