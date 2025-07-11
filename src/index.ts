import express,{Response,Request} from 'express';
import {rateLimit} from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();



const limit = rateLimit({ 
    windowMs: 60*1000*1, 
    max: 20,
    standardHeaders: 'draft-8',
    legacyHeaders:false,
})


const port:string|number = process.env.PORT_NO || 4000;
const app=express();
app.use(express.json());
app.use(limit);



import userRouter from './routers/user_route';
import reviewRouter from "./routers/review_router";
import pdtRouter from "./routers/product_router";
import authRouter from "./routers/auth_router";
import addRouter from "./routers/addres_router";

import { logger } from './middleware/logger';




app.use(logger);
app.use("/users",userRouter);
app.use("/review",reviewRouter);
app.use("/pdt",pdtRouter);
app.use("/auth",authRouter);
app.use("/address",addRouter);



app.use((req:Request,res:Response)=>{
    res.status(404).send("resouce not found");
})

app.listen(port,()=>{
    console.log("server get started....");
})





