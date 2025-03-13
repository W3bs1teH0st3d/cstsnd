const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

exports.handler = async (event) => {
    const sndtagid = event.queryStringParameters?.sndtagid;

    if (!sndtagid) {
        return { statusCode: 400, body: JSON.stringify({ error: 'sndtagid не указан' }) };
    }

    try {
        const result = await client.query(
            q.Get(q.Match(q.Index('soundtags_by_sndtagid'), sndtagid))
        );

        console.log('Найден SoundTag:', result.data);
        return {
            statusCode: 200,
            body: JSON.stringify(result.data)
        };
    } catch (error) {
        console.error('Ошибка в get-soundtag:', error);
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'SoundTag не найден', details: error.message })
        };
    }
};
