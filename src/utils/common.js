/** 公共配置 */

// API接口前缀
export const baseApi = "/api";

/** 处理字符内容截取 */
export function handleContent(content, charLength){
    if(content == null){
        return "";
    }
    if(content.length > charLength){
        return content.substr(0,charLength)+"...";
    }else{
        return content;
    }
}

/**
 * 时间转换
 * @params {String | Number} 时间字符串或者时间戳
 */
export function formatTime (time) {
    // 拿到当前的时间戳（毫秒) -- 转换为秒
    let currentTime = new Date()
    let currentTimestamp = parseInt(currentTime.getTime() / 1000)
    
    // 传进来的时间戳（毫秒)
    let t = new Date(time)
    let oldTimestamp = parseInt(t.getTime() / 1000)
    
    // 年
    let oldY = t.getFullYear()
    // 月
    let oldM = t.getMonth() + 1
    // 日
    let oldD = t.getDate()
    // 时
    let oldH = t.getHours()
    // 分
    let oldi = t.getMinutes()
    // 秒
    //let olds = t.getSeconds()
    
    // 相隔多少秒
    let timestampDiff = currentTimestamp - oldTimestamp
    if (timestampDiff < 60) { // 一分钟以内
        return "刚刚"
    }
    
    if (timestampDiff < 60 * 60) { // 一小时以内
        return Math.floor(timestampDiff / 60) + '分钟前'
    }

    if (timestampDiff < 60 * 60 * 24) { // 一天以内
        return Math.floor(timestampDiff / 60 / 60 ) + '小时前'
    }

    if (timestampDiff < 60 * 60 * 24 * 30) { // 一月以内
        return Math.floor(timestampDiff / 60 / 60 / 24) + '天前'
    }
    
    // 今天的时间
    if (oldY === currentTime.getFullYear() && oldM === (currentTime.getMonth() + 1) && oldD === currentTime.getDate()) {
        // 10:22
        return `${zeroize(oldH)}:${zeroize(oldi)}`
    }
    
    // 剩下的，就是昨天及以前的数据
    return `${oldY}-${zeroize(oldM)}-${zeroize(oldD)}`
    
    // 补0
    function zeroize(num) {
        return num < 10 ? "0" + num : num
    }
}
