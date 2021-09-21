import { Message, Wechaty, log, FileBox, Contact } from 'wechaty';
import { EventLogger, QRCodeTerminal } from 'wechaty-plugin-contrib';
import { PuppetXp } from 'wechaty-puppet-xp';
import aiTalk from './components/botTalk';
import scheduleTask from './components/scheduleTask';
import idioms from './configs/idiom.json';

export interface Idiom {
  derivation: string;
  example: string;
  explanation: string;
  pinyin: string;
  word: string;
  abbreviation: string;
};

const setting = { idioms: false, counter: 10 };

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
}

const puppet = new PuppetXp();
const bot = new Wechaty({ name: 'cloud-bot', puppet });
// use plugins
bot.use(QRCodeTerminal({ small: true }));
bot.use(EventLogger());

bot.on('message', async (msg: Message) => {
  console.info('Get Message: ', JSON.stringify(msg));

  const text = msg.text();
  const room = msg.room();
  const talker = msg.talker();
  const idiomList = idioms as Idiom[];

  // const alias = await talker.alias();
  // console.info(alias);

  if (room) {
    // Ignore self talk
    if (msg.self()) {
      console.log('this message is sent by myself!');
      return;
    }

    if (setting.idioms === true) {
      const lastWord = text.slice(-1);

      const nextIdiom = idiomList.filter(i => i.word[0] === lastWord);
      if (nextIdiom.length > 0) {
        const n = getRandomInt(nextIdiom.length);
        await room.say(nextIdiom[n].word);
        setting.counter = 31;
      } else {
        await room.say('你赢了');
        setting.idioms = false;
        setting.counter = 0;
      }
    }

    // When at bot next...
    const contactList = await msg.mentionList();
    if (contactList.some((c: Contact) => c.self())) {
      if (text.includes('功能')) {
        await room.say(`指令列表[Smile][Ruthless]：\n1. 成语接龙`, talker);
      }

      if (text.includes('成语接龙') && setting.idioms === false) {
        const n = getRandomInt(idiomList.length);
        await room.say(idiomList[n].word);
        setting.idioms = true;
        setting.counter = 31;

        const timeCountdown = setInterval(async () => {
          setting.counter--;
          if (setting.counter === 0) {
            if (setting.idioms === true) {
              await room.say("你输了!!");
              setting.idioms = false;
            }
            clearInterval(timeCountdown);
          } else if ([30, 15, 5].some(n => n === setting.counter)) {
            await room.say(`还有${setting.counter}秒！`);
          }

        }, 1000);
      }
    }

    // const member =await room.memberAll(name)
    // console.debug('member-------------------------------',member)
    // if (msg.text() === 'f') {
    //   const c = await bot.Contact.find({ id: 'tyutluyc' })
    //   if (c) {
    //     await msg.forward(c)
    //   }
    // }

    // if (text.includes(`@小白云`)) {
    //   const commond = text.replace(`@小白云`, '').trim();
    //   const content = await aiTalk(commond);
    //   await room.say(content, talker);
    // }
  }


  // if (msg.text() === 'p') {
  //   const fileBox1 = FileBox.fromUrl('http://pic.linecg.com/uploads/file/contents/2019/095d7772e8a0b1b.jpg')
  //   await msg.say(fileBox1)
  // }

  // if (msg.text() === 'c') {
  //   const contactList = await bot.Contact.findAll()
  //   console.debug(contactList)
  // }

  // if (msg.text() === 'r') {
  //   const roomList = await bot.Room.findAll()
  //   console.debug(roomList)
  // }
});


// bot.on('room-join', async any => {
//   console.log(`Room join`);
// });

bot.start()
  .then(async () => {
    log.info('StarterBot', 'Starter Bot Started.');
    // await scheduleTask(bot);
  })
  .catch(e => log.error('StarterBot', e));

