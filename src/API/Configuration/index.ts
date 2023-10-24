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
  }).description('B站相关设置'),

]);