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
            await room.say(fortuneTelling.signature, talker);
        }
    }
}

const explainWhy = async (room: Room, talker: Contact): Promise<void> => {
    const talkerId = talker.id
    if (talkerId) {
        const today = new Date().toLocaleDateString();
        const existingToday = historyCache.find(h => h.id === talkerId && h.date === today);
        if (existingToday) {
            await room.say(existingToday.fortuneTelling.untick2, talker);
        } else{
            await room.say("请先抽签", talker);
        }
    }
}

export {
    tellMeFortune,
    explainWhy
};