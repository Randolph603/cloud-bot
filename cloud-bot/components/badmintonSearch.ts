import { Contact, Room, log } from 'wechaty';
import tcb from '@cloudbase/node-sdk';
import 'dotenv/config';
import { WechatAppUser } from '../model/WechatAppUser';

const historyCache: { talkerId: string, date: string, pending: boolean }[] = [];
const array = ['运气', '功德', '好运', '爱情', '球技', '财运', '健康', '敏捷'];
const app = tcb.init({
    secretId: process.env.SECRET_ID,
    secretKey: process.env.SECRET_KEY,
    env: 'prod-4glz11qiccc892f2',
});

const findWechatAppUsers = async (allMemberWechatIds: string): Promise<WechatAppUser[]> => {
    console.log(allMemberWechatIds);
    const res = await app.callFunction({ name: 'user_getByWechatids', data: { allMemberWechatIds } });
    console.log(res);
    const wechatAppUsers = res.result.data as WechatAppUser[];
    if (wechatAppUsers && wechatAppUsers.length > 0) {
        wechatAppUsers.forEach(user => {
            const latestAtt = user.latestActivityStartTime;
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

const findWechatAppUsers2 = async (allMemberWechatIds1: string, allMemberWechatIds2: string, allMemberWechatIds3: string, allMemberWechatIds4: string): Promise<WechatAppUser[]> => {
    const res1 = await app.callFunction({ name: 'user_getByWechatids', data: { allMemberWechatIds: allMemberWechatIds1 } });
    const res2 = await app.callFunction({ name: 'user_getByWechatids', data: { allMemberWechatIds: allMemberWechatIds2 } });
    const res3 = await app.callFunction({ name: 'user_getByWechatids', data: { allMemberWechatIds: allMemberWechatIds3 } });
    const res4 = await app.callFunction({ name: 'user_getByWechatids', data: { allMemberWechatIds: allMemberWechatIds4 } });
    const wechatAppUsers1 = res1.result.data as WechatAppUser[];
    const wechatAppUsers2 = res2.result.data as WechatAppUser[];
    const wechatAppUsers3 = res3.result.data as WechatAppUser[];
    const wechatAppUsers4 = res4.result.data as WechatAppUser[];
    const wechatAppUsers = wechatAppUsers1.concat(wechatAppUsers2, wechatAppUsers3, wechatAppUsers4);
    if (wechatAppUsers && wechatAppUsers.length > 0) {
        wechatAppUsers.forEach(user => {
            const latestAtt = user.latestActivityStartTime;
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

const searchWechatAppUsers = async (): Promise<WechatAppUser[]> => {
    const db = app.database();
    const _ = db.command;
    const res = await app.callFunction({
        name: 'user_search',
        data: {
            where: { continueWeeklyJoin: _.gt(0) },
            limit: 5,
            sort: { continueWeeklyJoin: -1 }
        }
    });

    const wechatAppUsers = res.result.users as WechatAppUser[];
    if (wechatAppUsers && wechatAppUsers.length > 0) {
        return wechatAppUsers;
    } else {
        return [];
    }
}

const checkInToday = async (room: Room, talker: Contact): Promise<void> => {
    const talkerId = talker.id;
    if (!talkerId) return;

    try {
        log.info('Start check in', '...');

        const wechatAppUsers = await findWechatAppUsers(talkerId);
        if (wechatAppUsers.length == 0) {
            await room.say("未找到用户！", talker);
            return;
        }
        const wechatAppUser = wechatAppUsers[0];
        const userName = (wechatAppUser.displayName?.length ?? 0) > 0 ? wechatAppUser.displayName : wechatAppUser.nickName;
        log.info('Find wechat user', wechatAppUser);

        const rndInt = Math.floor(Math.random() * array.length);
        const random = array[rndInt];
        log.info('Find random', random);

        const today = new Date().toLocaleDateString();
        const existingToday = historyCache.find(h => h.talkerId === talkerId && h.date === today);
        if (existingToday) {
            log.info('existingToday', existingToday);
            if (existingToday.pending === false) {
                const content = `${userName}\n`
                    + '-----------------\n'
                    + `活跃度 + 1 !\n`
                    + `${random} + 1 !\n`
                    + `活跃度：${wechatAppUser.powerPoint} \n`
                    + (wechatAppUser.rejoin.length > 0 ? `活动：${wechatAppUser.rejoin} \n` : '')
                    + '-----------------';
                await room.say(content, talker);
            }
        } else {
            historyCache.push({ talkerId, date: today, pending: true });

            log.info('First time today');

            await app.callFunction({
                name: 'updateRecord', data: {
                    collection: 'UserProfiles',
                    where: { wechatId: talkerId },
                    data: { powerPoint: wechatAppUser.powerPoint + 1, },
                }
            });

            try {
                const content = `${userName}\n`
                    + '-----------------\n'
                    + `活跃度 + 1 !\n`
                    + `${random} + 1 !\n`
                    + `活跃度：${wechatAppUser.powerPoint + 1} \n`
                    + (wechatAppUser.rejoin.length > 0 ? `活动：${wechatAppUser.rejoin} \n` : '')
                    + '-----------------';
                await room.say(content, talker);
            } catch (e) {
                const content = `${wechatAppUser.displayName.length > 0 ? wechatAppUser.displayName : wechatAppUser.nickName}\n`
                    + '-----------------\n'
                    + `活跃度 + 1 !\n`
                    + `${random} + 1 !\n`
                    + `活跃度：${wechatAppUser.powerPoint + 1} \n`
                    + (wechatAppUser.rejoin.length > 0 ? `活动：${wechatAppUser.rejoin} \n` : '');

                await room.say(content, talker);
            } finally {
                const existingToday = historyCache.find(h => h.talkerId === talkerId && h.date === today);
                if (existingToday) {
                    existingToday.pending = false;
                }
            }
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        await room.say("签到出错了。。。,请再试一次。。。", talker);
    }

}

const tellMeWhoShouldReturn = async (room: Room, allMember: Contact[]): Promise<void> => {
    const IdsToIgnore = [
        'claire1006', // 小衝鋒張呵呵
        'q87924857',  // Jack（二胎）                
        'wxt-0603',  // TIA（搬北岸）
        'wxid_0yoya6kh2xxa12', // 林丛（北岸）
        'wxid_2044610446021', // Sandy
    ];

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
    const IdsToIgnore = [
        'wxid_3bg0p496426322', // 小白云
        'c19810617', // 可乐不加冰
    ];

    const allMemberId1 = allMember.slice(0, 100).map(m => m.id).join(',');
    const allMemberId2 = allMember.slice(100, 200).map(m => m.id).join(',');
    const allMemberId3 = allMember.slice(200, 300).map(m => m.id).join(',');
    const allMemberId4 = allMember.slice(300, 400).map(m => m.id).join(',');
    

    const wechatAppUsers = await findWechatAppUsers2(allMemberId1, allMemberId2, allMemberId3, allMemberId4);
    const allWechatAppUserIds = wechatAppUsers.map(u => u.wechatId);
    const membersNotLinkToWechatApp = allMember.filter(m => !allWechatAppUserIds.includes(m.id) && !IdsToIgnore.includes(m.id));
    // membersNotLinkToWechatApp.reverse();
    console.log('not register', membersNotLinkToWechatApp);

    const allWechatAppUserIdsThatNotCome = wechatAppUsers.filter(u => !u.latestActivityStartTime).map(u => u.wechatId);
    const membersNotCome = allMember.filter(m => allWechatAppUserIdsThatNotCome.includes(m.id) && !IdsToIgnore.includes(m.id));
    // console.log('0 joint', membersNotCome);

    let content = `\n-----------------\n`
                + `新来的球友们，还没有注册APP账号的球友，请先注册吧\n`
                + `注册方法，点击 #小程序：EABC活动助手\n`
                + `在“我的”页面中，点击“一键注册”，填写简单信息即可完成注册。\n`
                + `注册完成后请把群名称改成和账号姓名一致，或者给群管理员留下会员号。\n`
                + `-----------------\n`
                + `本群固定300人，定期清理，另有不定期清理的群，希望移居的请联系管理员，谢谢所有球友的配合。\n`;
    content += '-----------------';

    // await room.say(content.trim(), ...membersNotLinkToWechatApp.concat(membersNotCome));
    await room.say(content.trim(), ...membersNotLinkToWechatApp);
}

const tellMeWhoContinueMost = async (room: Room, allMember: Contact[]): Promise<void> => {
    const allMemberId = allMember.map(m => m.id).join(',');
    const wechatAppUsers = await searchWechatAppUsers();
    console.log('Users', wechatAppUsers);

    let content = `发烧级球友Top5\n`;
    for (let index = 0; index < 5; index++) {
        const element = wechatAppUsers[index];
        content += `No.${index + 1}：${element.displayName},\n 连续参加${element.continueWeeklyJoin}周活动.\n`;
    }

    await room.say(content.trim());
}

export {
    checkInToday,
    tellMeWhoShouldReturn,
    tellMeWhoIsNew,
    tellMeWhoContinueMost,
};