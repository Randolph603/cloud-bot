import fetch from 'node-fetch';

const aiTalk = async (text: string): Promise<string> => {
    const response = await fetch('http://api.qingyunke.com/api.php?key=free&appid=0&msg=' + encodeURI(text), {
        method: 'GET',
    });
    const { content } = await response.json();
    return content;
}

export default aiTalk;