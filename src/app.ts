import express from "express"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path";
import db from "./models"

const app = express();
const port = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use("/api", express.static(path.join(__dirname, "../public")))

// Cors Origin Authorization
app.use(
    cors({
        origin: [
            'http://localhost:3000',
        ],
        credentials: true,
    })
);

db.sequelize.authenticate().then(() => {
    console.log('Connected to the database'); 
    db.sequelize.sync({alter: process.env.NODE_ENV !== 'production'}).then( async () => {
        console.log('Database synced');
    })
})


app.get('/api', (req, res) => {
    res.send('Hello World')
})

// Routes
import authRoute from "./routes/authRoute"
import userRoute from "./routes/userRoute"
import roomRoute from "./routes/roomRoute"

app.use('/api', [authRoute, userRoute, roomRoute])

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})