import { Configuration, OpenAIApi } from 'openai';

const gptTalk = async (text: string): Promise<string> => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 1024,
        messages: [{ "role": "system", "content": text }],
    });

    console.log(chatCompletion.data.choices[0].message);
    const content = chatCompletion.data.choices[0].message?.content ?? '???';
    return content;
}

const gptTextTalk = async (text: string): Promise<string> => {
    const configuration = new Configuration({
        apiKey: key,
    });
    const openai = new OpenAIApi(configuration);

    const chatCompletion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        max_tokens: 1024,
        temperature: 0
    });

    console.log(chatCompletion.data.choices[0].text);
    const content = chatCompletion.data.choices[0].text ?? '???';
    return content;
}

const gptCreateImage = async (text: string): Promise<string> => {
    const configuration = new Configuration({
        apiKey: key,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createImage({
        prompt: text,
        n: 1,
        size: "256x256",
    });

    return response.data.data[0].url ?? '';
}


export {
    gptCreateImage,
    gptTalk,
    gptTextTalk
};