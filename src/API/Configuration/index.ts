import { Schema, Service } from "koishi";
import { Select } from "../Database/select-database";
export interface Config
{
  RefreshTimeHours:number
  refresh:boolean
}
export const usage = `
  # 你好！感谢使用此插件！
  ## 如果你还没登录账号，请前往日志查看登录二维码并且扫码登录
  `;

/**
 * @description 设置配置
 */
export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    refresh: Schema.boolean().default(false).description('是否需要自动刷新cookie，如果账号一直掉可以关掉'),
    RefreshTimeHours: Schema.number().role('slider').min(3).max(528).default(3).description('插件多久检查一次cookie是否需要刷新，按小时算')
  }).description('插件配置'),
]);