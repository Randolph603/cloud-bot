import { Message, type, Wechaty } from "wechaty";

const welcomeNewMember = async (bot: Wechaty, msg: Message): Promise<void> => {
    const text = msg.text();
    const room = msg.room();
    const talker = msg.talker();

    // "text":"\"墨雨寒\"邀请\"Fanxianseng\"加入了群聊"
    if (msg.type() === type.Message.Unknown && talker.id === 'null' && text.includes('加入了群聊')) {
        const newMemberName = text.substring(text.lastIndexOf("邀请") + 3, text.lastIndexOf("加入了群聊") - 1);
        const newMember = await bot.Contact.find(newMemberName);
        if (newMember && room) {
            // https://emojipedia.org/wechat/
            const content = `[Party][Party][Party]热烈欢迎新人，`
                + `本群旨在认识新朋友[LetMeSee]，锻炼身体[GoForIt]，提高羽毛球水平[Yeah!]。\n`
                + `群里羽毛球活动目前暂水平无差别活动，希望参加的成员彼此照顾。使用群内程序报名。\n`
                + `疫情期间，请群友们不打球在场下尽量带好口罩[KeepFighting]，参加活动请带好疫苗证书\n`
                + `请不要在群里乱发广告，可以乱发红包[Packet]，请勿直接添加群成员，我们是有爱的小集体!`;
            await room.say(content, newMember);
        }
    }
};

export { welcomeNewMember };
