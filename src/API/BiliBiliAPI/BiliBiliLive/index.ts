import { SendFetch } from "..";
import { LiveRoomDetail, LiveRoomStatus } from "./LiveRoomDetailInterface";

export class BiliBiliLiveApi extends SendFetch
{
    /**
     * 
     * @param roomId 
     * @returns 
     */
    public async getLiveRoomDetail(roomId: number){
        const url = 'https://api.live.bilibili.com/room/v1/Room/get_info';
        const params = new URLSearchParams({
            room_id: roomId.toString()
        });
        const headers = this.returnBilibiliHeaders();
        const response = await this.sendGet(url, params, headers);
        if (response.ok)
        {
            const data:LiveRoomDetail = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getLiveRoomDetail: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 获取用户对应的直播间状态 (根据用户mid)
     * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/live/info.md}
     * @param mid 
     * @returns 
     */
    public async getLiveRoomStatusByMid(mid: number){
        const url = 'https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld';
        const params = new URLSearchParams({
            mid: mid.toString()
        });
        const headers = this.returnBilibiliHeaders();
        const response = await this.sendGet(url, params, headers);
        if (response.ok)
        {
            const data:LiveRoomStatus = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getLiveRoomStatusByMid: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }

    /**
     * 获取房间页初始化信息
     * @param id 
     * @returns 
     */
    public async getLiveRoomInitDetail(id:number){
        const url = 'https://api.live.bilibili.com/room/v1/Room/room_init';
        const params = new URLSearchParams({
            id: id.toString()
        });
        const headers = this.returnBilibiliHeaders();
        const response = await this.sendGet(url, params, headers);
        if (response.ok)
        {
            const data = await response.json();
            return data;
        } else
        {
            this.logger.warn(`getLiveRoomInitDetail: ${response.statusText} code: ${response.status}`);
            return null;
        }
    }
}