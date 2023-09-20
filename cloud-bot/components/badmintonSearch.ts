import { Contact, Room } from 'wechaty';
import tcb from '@cloudbase/node-sdk';
import 'dotenv/config';
import { WechatAppUser } from '../model/WechatAppUser';

const historyCache: { talkerId: string, date: string }[] = [];
const array = ['运气', '功德', '好运', '爱情', '球技', '财运', '健康', '敏捷'];
const app = tcb.init({
    secretId: process.env.SECRET_ID,
    secretKey: process.env.SECRET_KEY,
    env: 'prod-4glz11qiccc892f2',
});

const findWechatAppUsers = async (allMemberWechatIds: string): Promise<WechatAppUser[]> => {
    const res = await app.callFunction({ name: 'user_getByWechatids', data: { allMemberWechatIds } });
    const wechatAppUsers = res.result.data as WechatAppUser[];
    if (wechatAppUsers && wechatAppUsers.length > 0) {
        wechatAppUsers.forEach(user => {
            const latestAtt = user.latestAttCreate ? user.latestAttCreate : user.latestAttUpdate;
            if (latestAtt) {
                const fromTodayMilisec = new Date().getTime() - new Date(latestAtt).getTime();
                user.fromToday = Math.ceil(fromTodayMilisec / (1000 * 60 * 60 * 24));
                user.rejoin = user.continueWeeklyJoin && user.continueWeeklyJoin > 0
                    ? `已经连续参加${user.continueWeeklyJoin}周次活动了，继续加油!`
                    : user.fromToday > 7 ? `已经有${user.fromToday}天没有在球场见到你了！` : '';
            } else {
                user.rejoin = "还一次活动没有参加哦，快来报名加入我们吧！"
            }
        });

        return wechatAppUsers;
    } else {
        return [];
    }
}

const checkInToday = async (room: Room, talker: Contact): Promise<void> => {
    const talkerId = talker.id
    if (talkerId) {
        const today = new Date().toLocaleDateString();
        const existingToday = historyCache.find(h => h.talkerId === talkerId && h.date === today);
        if (existingToday) {
            await room.say("今天已经签过到了。", talker);
        } else {
            historyCache.push({ talkerId, date: today });

            const wechatAppUsers = await findWechatAppUsers(talkerId);
            if (wechatAppUsers.length > 0) {
                const wechatAppUser = wechatAppUsers[0];
                await app.callFunction({
                    name: 'updateRecord', data: {
                        collection: 'UserProfiles',
                        where: { wechatId: talkerId },
                        data: { powerPoint: wechatAppUser.powerPoint + 1, },
                    }
                });

                const rndInt = Math.floor(Math.random() * array.length);
                const random = array[rndInt];
                const content = `${wechatAppUser.displayName.length > 0 ? wechatAppUser.displayName : wechatAppUser.nickName}\n`
                    + '-----------------\n'
                    + `积分 + 1 !\n`
                    + `${random} + 1 !\n`
                    + `积分：${wechatAppUser.powerPoint + 1} \n`
                    + (wechatAppUser.rejoin.length > 0 ? `活动：${wechatAppUser.rejoin} \n` : '')
                    + '-----------------\n'
                    + '需要查询请回复[小白云 查询]. ';

                try {
                    await room.say(content, talker);
                } catch (e) {
                    await room.say(`积分：${wechatAppUser.powerPoint + 1}`, talker);
                }

            } else {
                await room.say("未找到用户！", talker);
            }
        }
    }
}

const tellMePowerPoints = async (room: Room, talker: Contact): Promise<void> => {
    const talkerId = talker.id
    if (talkerId) {
        const wechatAppUsers = await findWechatAppUsers(talkerId);
        if (wechatAppUsers.length > 0) {
            const wechatAppUser = wechatAppUsers[0];
            const content = `${wechatAppUser.displayName.length > 0 ? wechatAppUser.displayName : wechatAppUser.nickName}\n`
                + '-----------------\n'
                + `积分：${wechatAppUser.powerPoint}`;
            await room.say(content.trim(), talker);
        } else {
            await room.say("未找到用户！", talker);
        }
    }
}

const tellMeWhoShouldReturn = async (room: Room, allMember: Contact[]): Promise<void> => {
    // 小衝鋒張呵呵
    const IdsToIgnore = ['claire1006'];

    const allMemberId = allMember.filter(m => !IdsToIgnore.includes(m.id)).map(m => m.id).join(',');
    const wechatAppUsers = await findWechatAppUsers(allMemberId);

    const wechatAppUsersByFromToday = wechatAppUsers.sort((a, b) => b.fromToday - a.fromToday).slice(0, 5);
    const wechatAppUsersByFromTodayIds = wechatAppUsersByFromToday.map(u => u.wechatId);

    console.log(wechatAppUsersByFromToday);

    const talkers = allMember.filter(m => wechatAppUsersByFromTodayIds.includes(m.id));

    let content = `小伙伴们好久没见了，准备好回到球场出出汗了吗？或者和群里新成员们打个招呼吧\n`;
    content += '-----------------\n';
    wechatAppUsersByFromToday.forEach(user => {
        content += `${user.displayName.length > 0 ? user.displayName : user.nickName}: ${user.rejoin} \n`;
    });
    content += '-----------------';

    await room.say(content.trim(), ...talkers);
}

const tellMeWhoIsNew = async (room: Room, allMember: Contact[]): Promise<void> => {
    // 小白云 可乐不加冰 Ethan(老蔡)
    const IdsToIgnore = ['wxid_3bg0p496426322', 'c19810617', 'wxid_8jh25jbzus9k12'];

    const allMemberId = allMember.map(m => m.id).join(',');
    const wechatAppUsers = await findWechatAppUsers(allMemberId);
    const allWechatAppUserIds = wechatAppUsers.map(u => u.wechatId);
    const membersNotLinkToWechatApp = allMember.filter(m => !allWechatAppUserIds.includes(m.id) && !IdsToIgnore.includes(m.id));

    console.log(membersNotLinkToWechatApp);

    let content = `新来的球友们，准备好到球场出出汗了吗？或者和群里球友们打个招呼吧\n`;
    content += '-----------------';

    await room.say(content.trim(), ...membersNotLinkToWechatApp);
}

export {
    checkInToday,
    tellMePowerPoints,
    tellMeWhoShouldReturn,
    tellMeWhoIsNew,
};