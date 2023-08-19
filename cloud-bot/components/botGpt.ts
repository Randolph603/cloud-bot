import { Configuration, OpenAIApi } from 'openai';


const gptTalk = async (text: string): Promise<string> => {
    const configuration = new Configuration({
        // apiKey: process.env.OPENAI_API_KEY,
        apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);

    const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 256,
        messages: [{"role": "system", "content": "You are a helpful assistant."}, {role: "user", content: "Hello world"}],
    });

    console.log(chatCompletion.data.choices[0].message);
    const content = chatCompletion.data.choices[0].message?.content ?? '???';
    return content;
}

export default gptTalk;