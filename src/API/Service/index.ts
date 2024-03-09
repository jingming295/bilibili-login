
import { BiliBiliAnime } from './BiliBiliAnime';
import { BiliBiliLogin } from './BilibiliLogin';
import { BiliBiliVideo } from './BilibiliVideo';
export * from './BilibiliLogin'
export * from './BilibiliVideo'
export * from './BiliBiliAnime'

declare module 'koishi' {
  interface Context
  {
    BiliBiliLogin: BiliBiliLogin;
    BiliBiliVideo: BiliBiliVideo;
    BiliBiliAnime: BiliBiliAnime;
  }
}