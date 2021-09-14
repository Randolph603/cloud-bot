import { Job, scheduleJob, JobCallback } from 'node-schedule'
import { Wechaty } from 'wechaty';

const setSchedule = (rule: string, callback: JobCallback): Job => {
    return scheduleJob('test', rule, callback);
}

const scheduleTask = async (bot: Wechaty): Promise<void> => {    
    // every 10 seconds
    setSchedule('*/10 * * * * *', async () => {        
        const contact  = await bot.Contact.find({ id: 'a35779132' })
        if (contact ) {
            await contact.say('test!');
        }
    })
}

export default scheduleTask;