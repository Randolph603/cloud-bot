import { Message, type, Wechaty } from "wechaty";

const welcomeNewMember = async (bot: Wechaty, msg: Message): Promise<void> => {
    const text = msg.text();
    const room = msg.room();
    const talker = msg.talker();

    if (msg.type() === type.Message.Unknown && talker.id === 'null' && text.includes('加入了群聊')) {
        const newMemberName = text.substring(text.lastIndexOf("邀请") + 3, text.lastIndexOf("加入了群聊") - 1);
        console.log('newMemberName: ' + newMemberName);
        const newMembers = await bot.Contact.findAll({ name: newMemberName });
        console.log('newMember: ' + JSON.stringify(newMembers));
        // https://emojipedia.org/wechat/
        const content = `[Party]欢迎新人 ${newMemberName}，本群旨在认识新朋友[LetMeSee]，锻炼身体[GoForIt]，提高羽毛球水平[Yeah!]。\n`
            + `群里羽毛球活动目前暂水平无差别活动，希望参加的成员彼此照顾。使用群内程序报名。详情请查看群公告。\n`
            + `疫情期间，请群友们不打球在场下尽量带好口罩[KeepFighting]。\n`
            + `请不要在群里乱发广告，可以乱发红包[Packet]，请勿直接添加群成员，我们是有爱的小集体!`;         

        if (newMembers.length > 0) {
            await room?.say(content, ...newMembers);
        } else {
            setTimeout(async () => {
                const newMembers = await bot.Contact.findAll({ name: newMemberName });
                console.log('newMember: ' + JSON.stringify(newMembers));
                await room?.say(content, ...newMembers);
            }, 5000);
        }


    }
};

export { welcomeNewMember };
