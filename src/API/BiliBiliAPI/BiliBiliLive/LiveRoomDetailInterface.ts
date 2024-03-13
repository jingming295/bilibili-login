export interface LiveRoomDetail
{
    code: number;
    msg: string;
    message: string;
    data?: LiveRoomDetailData;
}

export interface LiveRoomStatus
{
    code: number;
    msg: string;
    message: string;
    data?: LiveRoomStatusData;

}

export interface LiveRoomInitDetail{
    code: number;
    msg: string;
    message: string;
    data?: {
        room_id: number; // 直播间长号
        short_id: number; // 直播间短号
        uid: number; // 主播uid
        need_p2p: number; // 是否p2p
        is_hidden: boolean; // 是否隐藏
        is_locked: boolean; // 是否锁定
        is_portrait: boolean; // 是否竖屏
        live_status: number; // 直播状态 0:未开播 1:直播中 2:轮播中
        hidden_till: number; // 隐藏时间戳
        lock_till: number; // 锁定时间戳
        encrypted: boolean; // 是否加密
        pwd_verified: boolean; // 是否验证密码
    }
}

interface LiveRoomDetailData
{
    uid: number; // 主播uid
    room_id: number; // 直播间长号
    short_id: number; // 直播间短号
    attention: number; // 关注数
    online: number; // 观看人数
    is_portrait: boolean; // 是否竖屏
    description: string; // 直播间描述
    live_status: number; // 直播状态 0:未开播 1:直播中 2:轮播中
    area_id: number; // 直播分区id
    parent_area_id: number; // 父分区id
    parent_area_name: string; // 父分区名称
    old_area_id: number; // 旧版分区id
    background: string; // 背景图
    title: string; // 直播间标题
    user_cover: string; // 封面
    keyframe: string; // 关键帧
    is_strict_room: boolean; // 未知
    live_time: string; // 开播时间 YYYY-MM-DD HH:mm:ss
    tags: string; // 标签
    is_anchor: boolean; // 未知
    room_silent_type: string; // 禁言状态
    room_silent_level: number; // 禁言等级
    room_silent_second: number; // 禁言时间 单位是秒
    area_name: string; // 分区名称
    pendants: string; // 未知
    area_pendants: string; // 未知
    hot_words: string[]; // 热词
    hot_words_status: number; // 热词状态
    verify: string; // 未知
    new_pendants: {
        frame: {
            name: string; // 名称
            value: string; // 值
            position: number; // 位置
            desc: string; // 描述
            area: number; // 分区
            area_old: number; // 旧版分区
            bg_color: string; // 背景颜色
            bg_pic: string; // 背景图片
            use_old_area: boolean; // 是否旧分区号
        }; // 头像框
        badge: {
            name: string; // 类型 v_person: 个人认证(黄) v_company: 企业认证(蓝)
            position: number; // 位置
            value: string; // 值
            desc: string; // 描述
        }; // 大v
        mobile_frame: {
            name: string; // 名称
            value: string; // 值
            position: number; // 位置
            desc: string; // 描述
            area: number; // 分区
            area_old: number; // 旧版分区
            bg_color: string; // 背景颜色
            bg_pic: string; // 背景图片
            use_old_area: boolean; // 是否旧分区号
        } | null; // 同上
        mobile_badge: {
            name: string; // 类型 v_person: 个人认证(黄) v_company: 企业认证(蓝)
            position: number; // 位置
            value: string; // 值
            desc: string; // 描述
        } | null; // 同上
    }; // 头像框\大v
    up_session: string; // 未知
    pk_status: number; // pk状态
    pk_id: number; // pk id
    battle_id: number; // 未知
    allow_change_area_time: number; // 未知
    allow_upload_cover_time: number; // 未知
    studio_info: {
        status: number; // 未知
        master_list: string[]; // 未知
    };
}

interface LiveRoomStatusData
{
    roomStatus: number; // 直播间状态 0:无房间 1:有房间
    roundStatus: number; // 轮播状态 0:无轮播 1:有轮播
    liveStatus: number; // 直播状态 0:未开播 1:直播中
    url: string; // 直播间地址
    title: string; // 直播间标题
    cover: string; // 直播间封面
    online: number; // 直播间人气
    roomid: number; // 直播间id（短号）	
    broadcast_type: number; // 未知
    online_hidden: number; // 未知
    link: string; // 未知
}