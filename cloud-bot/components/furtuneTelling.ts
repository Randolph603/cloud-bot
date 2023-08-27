import { Contact, Room } from 'wechaty';
import items from '../configs/fortuneTelling.json' assert { type: "json" };
import { FortuneTelling } from '../model/fortuneTelling';

const historyCache: { talkerId: string, date: string, fortuneTelling: FortuneTelling, index: number }[] = [];
const itemList = items as FortuneTelling[];


const tellMeFortune = async (room: Room, talker: Contact): Promise<void> => {
    const talkerId = talker.id
    if (talkerId) {
        const today = new Date().toLocaleDateString();
        const existingToday = historyCache.find(h => h.talkerId === talkerId && h.date === today);
        if (existingToday) {            
            const content = `您抽到了第${existingToday.index}签!\n`
                + '-----------------\n'
                + `🎐签诗：${existingToday.fortuneTelling.signature}\n`
                + '-----------------\n'
                + '需要解签请回复【小白云 解签】\n';
            await room.say(content.trim(), talker);
        } else {
            const rndInt = Math.floor(Math.random() * itemList.length) + 1;
            const fortuneTelling = itemList[rndInt];
            historyCache.push({ talkerId, date: today, fortuneTelling, index: rndInt });

            const content = `您抽到了第${rndInt}签!\n`
                + '-----------------\n'
                + `🎐签诗：${fortuneTelling.signature}\n`
                + '-----------------\n'
                + '需要解签请回复【小白云 解签】\n';
            await room.say(content.trim(), talker);
        }
    }
}

const explainWhy = async (room: Room, talker: Contact): Promise<void> => {
    const talkerId = talker.id
    if (talkerId) {
        const today = new Date().toLocaleDateString();
        const existingToday = historyCache.find(h => h.talkerId === talkerId && h.date === today);
        if (existingToday) {
            const content = '🎐解签：\n'
                + '-----------------\n'
                + `${existingToday.fortuneTelling.untick1}\n`
                + '-----------------\n'
                + `${existingToday.fortuneTelling.untick2}`;
            await room.say(content.trim(), talker);
        } else {
            await room.say("请先抽签", talker);
        }
    }
}

export {
    tellMeFortune,
    explainWhy
};