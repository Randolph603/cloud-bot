import { Contact, Room } from 'wechaty';
import fetch from 'node-fetch';
import 'dotenv/config';

const constellationTelling = async (text: string, room: Room, talker: Contact): Promise<void> => {
    const response = await fetch(`http://web.juhe.cn:8080/constellation/getAll?consName=${encodeURI(text)}&type=today&key=${process.env.CONSTELLATION_KEY}`, {
        method: 'GET',
    });
    const data = await response.json() as {
        name: string,
        all: string,
        love: string,
        work: string,
        money: string,
        health: string,
        color: string,
        QFriend: string,
        number: number,
        summary: string,
    };

    const content = `===${data.name} 今日运势 ===\n`
    + '-----------------\n'
    + `综合运势：${data.all}%\n`
    + `爱情运势：${data.love}%\n`
    + `工作状况：${data.work}%\n`
    + `理财投资：${data.money}%\n`
    + `健康指数：${data.health}%\n`
    + `幸运颜色：${data.color}\n`
    + `幸运数字：${data.number}\n`
    + `速配星座：${data.QFriend}\n`
    + '-----------------\n'
    + `${data.summary}\n`;
    await room.say(content.trim(), talker);
}

export default constellationTelling;