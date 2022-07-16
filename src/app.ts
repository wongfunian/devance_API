import express from "express"
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 4000;

app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.get('/api', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})