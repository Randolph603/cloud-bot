import { Message, WechatyBuilder, log, Contact } from 'wechaty';
import { FileBox } from 'file-box'
import { EventLogger, QRCodeTerminal } from 'wechaty-plugin-contrib';
import { PuppetXp } from 'wechaty-puppet-xp';
import aiTalk from './components/botTalk';
import { replyPlayer, startIdiomsTrain } from './components/idiomsTrain';
import { welcomeNewMember } from './components/roomFunction';
import scheduleTask from './components/scheduleTask';

const featureList = [
  {
    name: '成语接龙',
    enable: true,
  },
  {
    name: '看图猜成语',
    enable: true,
  }
]

const puppet = new PuppetXp();
const bot = WechatyBuilder.build({
  name: 'cloud-bot',
  puppet,
});

// use plugins
bot.use(QRCodeTerminal({ small: true }));
// bot.use(EventLogger());

bot.on('message', async (msg: Message) => {
  log.info('Get Message: ', JSON.stringify(msg));

  const text = msg.text();
  const room = msg.room();
  const talker = msg.talker();
  // const alias = await talker.alias();  

  if (room) {
    if (msg.self()) { return; }

    await replyPlayer(room, text);
    await welcomeNewMember(bot, msg);

    // When at bot next...
    const contactList = await msg.mentionList();
    if (contactList.some((c: Contact) => c.self())) {
      if (text.includes('功能')) {
        const features = featureList.filter(f => f.enable === true).map((f, i) => `${i + 1}. ${f.name}`).join('\n');
        await room.say(`指令列表[Smile][Ruthless]：\n` + features, talker);
      } else if (text.includes(featureList[0].name) && featureList[0].enable === true) {
        await startIdiomsTrain(room);
      } else if (text.includes('p')) {
        const fileBox1 = FileBox.fromUrl('https://raw.githubusercontent.com/Randolph603/cloud-bot/main/src/images/puzzle/1.jpeg');
        await msg.say(fileBox1);
      } else {
        const commond = text.replace(`@小白云`, '').trim();
        const content = await aiTalk(commond);
        await room.say(content, talker);
      }
    }
  }

});


// bot.on('room-join', async any => {
//   console.log(`Room join`);
// });

bot.start()
  .then(async () => {
    log.info('StarterBot', 'Starter Bot Started.');
    // await scheduleTask(bot);
  })
  .catch((e: any) => log.error('StarterBot', e));

