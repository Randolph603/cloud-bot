import { Contact, Room } from 'wechaty';
import items from '../configs/fortuneTelling.json' assert { type: "json" };
import { FortuneTelling } from '../model/fortuneTelling';

const historyCache: { id: string, date: string, fortuneTelling: FortuneTelling }[] = [];
const itemList = items as FortuneTelling[];


const tellMeFortune = async (room: Room, talker: Contact): Promise<void> => {
    const talkerId = talker.id
    if (talkerId) {
        const today = new Date().toLocaleDateString();
        const existingToday = historyCache.find(h => h.id === talkerId && h.date === today);
        if (existingToday) {
            await room.say(existingToday.fortuneTelling.signature, talker);
        } else {
            const rndInt = Math.floor(Math.random() * itemList.length) + 1;
            const fortuneTelling = itemList[rndInt];
            historyCache.push({ id: talkerId, date: today, fortuneTelling });

            const content = `您抽到了第${rndInt}签!\n`
                + '-----------------'
                + `🎐签诗：${fortuneTelling.signature}\n`
                + '-----------------'
                + '需要解签请回复【小白云 解签】';
            await room.say(content, talker);
        }
    }
}

const explainWhy = async (room: Room, talker: Contact): Promise<void> => {
    const talkerId = talker.id
    if (talkerId) {
        const today = new Date().toLocaleDateString();
        const existingToday = historyCache.find(h => h.id === talkerId && h.date === today);
        if (existingToday) {
            const content = ''
                + '\n-----------------'
                + `🎐解签：${existingToday.fortuneTelling.untick2}`;
            await room.say(content, talker);
        } else {
            await room.say("请先抽签", talker);
        }
    }
}

export {
    tellMeFortune,
    explainWhy
};