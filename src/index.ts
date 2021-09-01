import { Message, Wechaty, log, FileBox } from 'wechaty';
import { EventLogger, QRCodeTerminal } from 'wechaty-plugin-contrib';
import { PuppetXp } from 'wechaty-puppet-xp';
import aiTalk from './components/botTalk';

const puppet = new PuppetXp();
const bot = new Wechaty({
  name: 'cloud-bot',
  puppet,
});

// use plugins
bot.use(QRCodeTerminal({ small: true }));
bot.use(EventLogger());

//
const onMessage = async (msg: Message) => {
  console.info('Get Message: ', JSON.stringify(msg));

  const text = msg.text();
  const room = msg.room();
  const talker = msg.talker();
  const talkerName = talker.name();
  console.info(talkerName);

  const alias = await talker.alias();
  console.info(alias);

  if (text === 'ding') {
    await msg.say('dong')
  }

  if (room) {
    // const member =await room.memberAll(name)
    // console.debug('member-------------------------------',member)
    if (msg.text() === 'f') {
      const c = await bot.Contact.find({ id: 'tyutluyc' })
      if (c) {
        await msg.forward(c)
      }
    }

    if (text.includes(`@小白云`)) {
      const commond = text.replace(`@小白云`, '').trim();
      const content = await aiTalk(commond);
      await room.say(content, talker);
    }
  }


  if (msg.text() === 'p') {
    const fileBox1 = FileBox.fromUrl('http://pic.linecg.com/uploads/file/contents/2019/095d7772e8a0b1b.jpg')
    await msg.say(fileBox1)
  }

  if (msg.text() === 'c') {
    const contactList = await bot.Contact.findAll()
    console.debug(contactList)
  }

  if (msg.text() === 'r') {
    const roomList = await bot.Room.findAll()
    console.debug(roomList)
  }
};

bot.on('message', onMessage);
// bot.on('room-join', async any => {
//   console.log(`Room join`);
// });

bot.start()
  .then(() => {
    log.info('StarterBot', 'Starter Bot Started.');

  })
  .catch(e => log.error('StarterBot', e));

