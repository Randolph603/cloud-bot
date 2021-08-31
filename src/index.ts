import { Message, Wechaty, log, FileBox } from 'wechaty';
import { EventLogger, QRCodeTerminal } from 'wechaty-plugin-contrib';
import { PuppetXp } from 'wechaty-puppet-xp';

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
  log.info('StarterBot', msg.toString())
  const talker = msg.talker()
  // console.debug(talker)
  // const alias = await talker.alias()
  // console.info(alias)
  const name = talker.name()
  console.info(name)
  const room = msg.room()
  // console.debug(room)
  if (msg.text() === 'ding') {
    await msg.say('dong')
  }
  if (msg.text() === 'at' && room) {
    const mentionIdList = []
    mentionIdList.push(talker)
    console.debug(mentionIdList)
    await room.say('hi',...mentionIdList)
  }
  if (room) {
    // const member =await room.memberAll(name)
    // console.debug('member-------------------------------',member)
    if (msg.text() === 'f') {
      const c = await bot.Contact.find({id: 'tyutluyc'})
      if (c) {
        await msg.forward(c)
      }
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

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e));
