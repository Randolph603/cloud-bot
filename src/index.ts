import { Message, Wechaty, log, FileBox, Contact } from 'wechaty';
import { EventLogger, QRCodeTerminal } from 'wechaty-plugin-contrib';
import { PuppetXp } from 'wechaty-puppet-xp';
import aiTalk from './components/botTalk';
import { replyPlayer, startIdiomsTrain } from './components/idiomsTrain';
import scheduleTask from './components/scheduleTask';

const featureList = [
  {
    name: '成语接龙',
    enable: true,
    setting: {}
  }
]

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
  // const alias = await talker.alias();  

  if (room) {
    if (msg.self()) { return; }

    await replyPlayer(room, text);

    // When at bot next...
    const contactList = await msg.mentionList();
    if (contactList.some((c: Contact) => c.self())) {
      if (text.includes('功能')) {
        await room.say(`指令列表[Smile][Ruthless]：\n1. 成语接龙`, talker);
      } else if (text.includes('成语接龙')) {
        await startIdiomsTrain(room);
      } else {
        const commond = text.replace(`@小白云`, '').trim();
        const content = await aiTalk(commond);
        await room.say(content, talker);
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
    log.info('Settings: ', JSON.stringify(setting));
    // await scheduleTask(bot);
  })
  .catch(e => log.error('StarterBot', e));

