import {
  Contact,
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
  types,
} from 'wechaty'
import { FileBox } from 'file-box'

import { PuppetXp } from '../src/puppet-xp.js'
import qrcodeTerminal from 'qrcode-terminal'
import timersPromise from 'timers/promises'
import { welcomeNewMember } from './components/roomFunction.js'
import { WechatyImpl } from 'wechaty/impls'

const roomGameId = '49584958391@chatroom' // EABC东羽羽毛球活动群
const roomHallId = '44730307924@chatroom' // EABC东羽羽毛球新人活动大厅
const roomTestId = '44056108246@chatroom' // 测试群

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

function onScan(qrcode: string, status: ScanStatus) {
  if (qrcode) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    console.info('StarterBot', 'onScan: %s(%s) - %s', status, qrcodeImageUrl)

    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console
    console.info(`[${status}] ${qrcode}\nScan QR Code above to log in: `)
  } else {
    console.info(`[${status}]`)
  }
}

async function onLogin(user: Contact) {
  log.info('StarterBot', '%s login', user);
}

function onLogout(user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage(msg: Message) {
  log.info('StarterBot', msg.toString());
  if (msg.self()) { return; }
     
  const text = msg.text();
  const room = msg.room();
  const talker = msg.talker();
  log.info(JSON.stringify(talker));
  log.info(talker.id);
  const aa = Number(talker.id.substring(1)) * new Date().getDate().valueOf();
  log.info(aa.toString());


  // new member welcome!!!!
  if (room && [roomTestId, roomHallId].includes(room.id)) {
    await welcomeNewMember(bot as WechatyImpl, msg);
  }

  // When at bot next...
  if (room && [roomTestId].includes(room.id)) {
    // const contactList = await msg.mentionList();             
    if (text.includes('@小白云')) {      
      if (text.includes('功能列表')) {        
        const features = featureList.filter(f => f.enable === true).map((f, i) => `${i + 1}. ${f.name}`).join('\n');
        await room.say(`功能列表[Smile][Ruthless]：\n` + features, talker);
      }
    }
  }

  if (room && [roomTestId].includes(room.id)) {
    if (msg.text() === 'ding') {
      await msg.say('dong')
    }
    if (msg.type() === types.Message.Image) {
      const img = await msg.toImage()
      const thumbFile = await img.thumbnail()
      log.info('thumbFile', thumbFile.name)
      await thumbFile.toFile(`${process.cwd()}/cache/${thumbFile.name}`, true)

      // await timersPromise.setTimeout(3000)
      // console.info(img)
      const hdFile = await img.hd()
      log.info('hdFile', hdFile.name)
      await hdFile.toFile(`${process.cwd()}/cache/${hdFile.name}`, true)
      // setTimeout(msg.wechaty.wrapAsync(
      //   async function () {
      //     const imginfo = await msg.toFileBox()
      //     console.info(imginfo)
      //   },
      // ), 500)
    }
    if (msg.type() === types.Message.Emoticon) {
      const emoticon = await msg.toFileBox()
      await emoticon.toFile(`${process.cwd()}/cache/${emoticon.name}`, true)
      await timersPromise.setTimeout(1000)
      console.info(emoticon)
      // setTimeout(msg.wechaty.wrapAsync(
      //   async function () {
      //     const imginfo = await msg.toFileBox()
      //     console.info(imginfo)
      //   },
      // ), 500)
    }
    if (msg.text() === 'file') {
      const newpath = 'C:\\Users\\wechaty\\Documents\\GitHub\\wechat-openai-qa-bot\\cache\\data1652178575294.xls'

      log.info('newpath==================================', newpath)
      const fileBox = FileBox.fromFile(newpath)
      await msg.say(fileBox)
    }
  }
}

const puppet = new PuppetXp()
const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  puppet,
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)
bot.on('room-join', async (room, inviteeList, inviter) => {
  await room.sync();

  if ([roomTestId, roomHallId].includes(room.id)) {
    const nameList = inviteeList.map(c => c.name()).join(',');
    log.info(`Room ${await room.topic()} got new member ${nameList}, invited by ${inviter}`);

    const howToPayUrl = "https://mp.weixin.qq.com/s/tQ4I9NJARDbdNLSxzTuecA";
    const doubleGameRoleUrl = "https://mp.weixin.qq.com/s/d17dv1Q3NwwlN8RFFkXAHA";

    const content = `[Party]欢迎新人 ${nameList}，本群旨在认识新朋友[LetMeSee]，锻炼身体[GoForIt]，提高羽毛球水平[Yeah!]。\n`
      + `【活动时间】一般情况每周五晚上7:30到9:30，每周日下午活动。\n`
      + `【活动地点】羽毛球场在Lloyd Elsmore Park Badminton， Bell Park Lady Marie Drive, Pakuranga, Auckland 2010\n`
      + `【活动费用】每人每次15NZD，连续参加周次会有折扣，例如，连续参加3次，每人每次15-3=12NZD。\n`
      + `【活动如何充值】，可以点击文章查看充值办法。${howToPayUrl} \n`
      + `【新活动发布报名】一般会在周三发布新活动报名。\n`
      + `【报名】使用微信程序报名，点击群里的报名信息或者点击\n`
      + `#小程序：东羽羽毛球活动助手\n`
      + `从中选择感兴趣的活动报名。\n`
      + `【2分钟看懂羽毛球基础规则】，点击查看文章 ${doubleGameRoleUrl} \n`;

    await room?.say(content, ...inviteeList);
  }
})
bot.on('room-leave', async (room, leaverList, remover) => {
  const nameList = leaverList.map(c => c.name()).join(',');
  log.info(`Room ${await room.topic()} lost member ${nameList}, the remover is: ${remover}`);
})
bot.on('room-topic', async (room, topic, oldTopic, changer) => {
  // "luyuchao"修改群名为“北辰香麓欣麓园抗疫”
  // 你修改群名为“大师是群主”
  log.info(`Room ${await room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
})
bot.on('room-invite', async roomInvitation => {
  log.info(JSON.stringify(roomInvitation))
  // "超超超哥"邀请你加入了群聊，群聊参与人还有：瓦力
  try {
    log.info('received room-invite event.')
    await roomInvitation.accept()
  } catch (e) {
    console.error(e)
  }
})

bot.start()
  .then(() => {
    return log.info('StarterBot', 'Starter Bot Started.')
  })
  .catch(console.error)
