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
          + `【活动时间】一般情况每周五晚上7:30到9:30，每周日下午活动。\n`
          + `【活动地点】羽毛球场在Lloyd Elsmore Park Badminton， Bell Park Lady Marie Drive, Pakuranga, Auckland 2010\n`
          + `【活动费用】每人每次15NZD，连续参加周次会有折扣，例如，连续参加3次，每人每次15-3=12NZD。\n`
          + `【活动如何充值】，可以点击文章查看充值办法。${howToPayUrl} \n`
          + `【新活动发布报名】一般会在周三发布新活动报名。\n`
          + `【报名】使用微信程序报名，点击群里的报名信息或者点击\n`
          + `#小程序：东羽羽毛球活动助手\n`
          + `从中选择感兴趣的活动报名。\n`
          + `【2分钟看懂羽毛球基础规则】，点击查看文章 ${doubleGameRoleUrl} \n`;
        
        console.log('inviteeList:', inviteeList)
        await room?.say(content);
    }
}

export { welcomeNewMember };
