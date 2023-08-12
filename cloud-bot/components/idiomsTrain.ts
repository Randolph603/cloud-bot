import { Idiom } from "src/model/Idiom";
import idioms from '../configs/idiom.json';
import { Room } from "wechaty";

const setting = { start: false, counter: 30 };
const idiomList = idioms as Idiom[];

const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
};

const startIdiomsTrain = async (room: Room): Promise<void> => {
    if (setting.start === false) {
        const n = getRandomInt(idiomList.length);
        await room.say(idiomList[n].word);
        setting.start = true;
        setting.counter = 31;

        const timeCountdown = setInterval(async () => {
            setting.counter--;
            if (setting.start === true) {
                if (setting.counter === 0) {
                    await room.say("你输了!!");
                    setting.start = false;
                    clearInterval(timeCountdown);
                } else if ([30, 15, 5].some(n => n === setting.counter)) {
                    await room.say(`还有${setting.counter}秒！`);
                }
            }
        }, 1000);
    }
};

const replyPlayer = async (room: Room, text: string): Promise<void> => {
    if (setting.start === true) {
        const lastWord = text.slice(-1);

        const nextIdiom = idiomList.filter(i => i.word[0] === lastWord);
        if (nextIdiom.length > 0) {
            const n = getRandomInt(nextIdiom.length);
            await room.say(nextIdiom[n].word);
            setting.counter = 31;
        } else {
            await room.say('你赢了');
            setting.start = false;
            setting.counter = 0;
        }
    }
}

export {
    startIdiomsTrain,
    replyPlayer
};
