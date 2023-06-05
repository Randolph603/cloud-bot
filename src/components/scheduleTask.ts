import { Job, scheduleJob, JobCallback } from 'node-schedule'
import { Wechaty } from 'wechaty';

const setSchedule = (rule: string, callback: JobCallback): Job => {
    return scheduleJob('test', rule, callback);
}

const scheduleTask = async (bot: Wechaty): Promise<void> => {
    // every 10 seconds
    setSchedule('*/10 * * * * *', async () => {
        const roomId = '27666018320@chatroom'; // dongyu
        const contact = await bot.Contact.find({ id: 'a35779132' });
        if (contact) {
            await contact.say('test!');
        }

        const roomWithFourPeople = await bot.Room.find({ id: '25815110263@chatroom' });                
        if (roomWithFourPeople) {
            await roomWithFourPeople.say('我会每10秒发一次!');
        }
    })
}

export default scheduleTask;