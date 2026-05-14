import { Message, types, Wechaty } from "wechaty";
import { ContactInterface, WechatyImpl } from "wechaty/impls";

const welcomeNewMember = async (bot: WechatyImpl, msg: Message): Promise<void> => {
    const text = msg.text();
    const room = msg.room();
    const talker = msg.talker();

    if (msg.type() === types.Message.Unknown && talker.id === 'null') {
        const inviteeList: ContactInterface[] = []
        let name = ''

        if (text.indexOf('加入了群聊') !== -1) {
            const arrInfo = text.split(/邀请|加入了群聊/)

            if (arrInfo[1]) {
                if (arrInfo[1] === '你') {
                    // inviteeList.push(this.selfInfo)
                } else {
                    name = arrInfo[1].split(/“|”|"/)[1] || ''
                    const newMembers = await bot.Contact.findAll({ name: name });
                    inviteeList.push(...newMembers)
                }
            }
        }

        if (text.indexOf('分享的二维码加入群聊') !== -1) {
            const arrInfo = text.split(/通过扫描|分享的二维码加入群聊/)

            if (arrInfo[0]) {
                if (arrInfo[0] === '你') {
                    // inviteeList.push(this.selfInfo.id)
                } else {
                    name = arrInfo[0].split(/“|”|"/)[1] || ''
                    const newMembers = await bot.Contact.findAll({ name: name });
                    inviteeList.push(...newMembers)
                }
            }
        }

        const howToPayUrl = "https://mp.weixin.qq.com/s/tQ4I9NJARDbdNLSxzTuecA";
        const doubleGameRoleUrl = "https://mp.weixin.qq.com/s/d17dv1Q3NwwlN8RFFkXAHA";
            
        const content = `[Party]欢迎新人 ${name}，本群旨在认识新朋友[LetMeSee]，锻炼身体[GoForIt]，提高羽毛球水平[Yeah!]。\n`
          + `【活动时间】一般情况每周五晚上，每周日下午活动。\n`
          + `【活动地点】羽毛球场在Lloyd Elsmore Park Badminton， Bell Park Lady Marie Drive, Pakuranga, Auckland 2010\n`
          + `【活动费用】每人每次15NZD，娱乐区有连续参加周次会有折扣，例如，连续参加1次，每人每次15-1=14NZD。\n`
          + `【活动如何充值】，可以点击文章查看充值办法。${howToPayUrl} \n`
          + `【新活动发布报名】一般会在周一晚上7点左右发布新一周的活动报名。\n`
          + `【报名】使用微信程序报名，点击群里的报名信息或者点击\n`
          + `#小程序：EABC活动助手\n`
          + `从中选择感兴趣的活动报名。\n`
          + `【2分钟看懂羽毛球基础规则】，点击查看文章 ${doubleGameRoleUrl} \n`
          + `【球场礼仪】 
* 礼貌捡球，尽量从网上把球递给对方。
* 不做挑衅动作，握拳吼叫庆祝动作尽量背身对手。
* 态度认真，珍惜鼓励队友，不要态度懒散，漫不经心。
* 对局结束后可相互击掌鼓励。
* 不要压网带，发球时示意双方准备好，偷后场得分后举手示意。
* 球打到对手身上或打出擦网球要举手示意。
* 场上有对局时，任何一只脚不进入场地。\n `;
        
        console.log('inviteeList:', inviteeList)
        await room?.say(content);
    }
}

export { welcomeNewMember };
