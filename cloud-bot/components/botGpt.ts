import { OpenAI } from 'openai';

const gptTalk = async (text: string): Promise<string> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", //model: "gpt-4o-mini",
        max_tokens: 1024,
        messages: [
            {"role": "user", "content": text}
        ]
    });   

    console.log(chatCompletion.choices[0].message);
    const content = chatCompletion.choices[0].message?.content ?? '???';
    return content;
}

const gptCreateImage = async (text: string): Promise<string> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const image = await openai.images.generate({ 
        model: "dall-e-3", 
        prompt: text,
        n: 1,
        size: "256x256",
    });    

    return image.data[0].url ?? '';
}


export {
    gptCreateImage,
    gptTalk
};