import { Schema } from "koishi";
export interface Config { }

/**
 * @description 设置配置
 */
export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    SESSDATA: Schema.string().description('SESSDATA(位于 Cookie 中的SESSDATA字段)，必要'),
    csrf: Schema.string().description('CSRF Token(位于 Cookie 中的bili_jct字段)，必要'),
    refresh_token: Schema.string().description('持久化刷新口令(localStorage 中的ac_time_value字段)，必要'),
  }).description('B站账号配置，仅第一次运行需要'),
  Schema.object({
    refresh: Schema.boolean().default(true).description('是否需要自动刷新cookie，如果账号一直掉可以关掉'),
    RefreshTimeHours: Schema.number().role('slider').min(3).max(528).default(3).description('插件多久检查一次cookie是否需要刷新，按小时算')
  }).description('插件配置'),

]);