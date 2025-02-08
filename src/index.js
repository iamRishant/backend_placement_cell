import express from 'express'
import dotenv from 'dotenv'
dotenv.config();

const app = express();
// middlewares

app.use(express.json());
app.use(express.urlencoded({extended:true}));
// routes


const port=process.env.PORT || 8001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
