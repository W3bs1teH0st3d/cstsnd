const { v4: uuidv4 } = require('uuid');
const faunadb = require('faunadb'); // Для примера, можно заменить на JSON-файл

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { title, text, imageUrl, soundUrl, background } = JSON.parse(event.body);
        const sndtagid = uuidv4();

        // Сохранение в FaunaDB (или другом хранилище)
        await client.query(
            q.Create(q.Collection('soundtags'), {
                data: { sndtagid, title, text, imageUrl, soundUrl, background }
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ sndtagid })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ошибка сервера' })
        };
    }
};