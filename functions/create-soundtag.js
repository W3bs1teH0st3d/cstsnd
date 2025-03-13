const { v4: uuidv4 } = require('uuid');
const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Тело запроса отсутствует' }) };
    }

    try {
        const { title, text, imageUrl, soundUrl, background } = JSON.parse(event.body);
        const sndtagid = uuidv4();

        console.log('Создание SoundTag:', { sndtagid, title, text, imageUrl, soundUrl, background });

        const result = await client.query(
            q.Create(q.Collection('soundtags'), {
                data: { sndtagid, title, text, imageUrl, soundUrl, background }
            })
        );

        console.log('Успешно сохранено в FaunaDB:', result);

        return {
            statusCode: 200,
            body: JSON.stringify({ sndtagid })
        };
    } catch (error) {
        console.error('Ошибка в create-soundtag:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ошибка сервера', details: error.message })
        };
    }
};
