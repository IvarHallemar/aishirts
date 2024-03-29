import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello World',
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createImage({ 
            prompt: `${prompt}`,
            n: 1,
            size: "256x256",
        });

        res.status(200).send({
            bot: response.data.data[0].url
        })
    } catch (error) {

        console.log(error);
        res.status(500).send({ error })

    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));