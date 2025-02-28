import mongoose from "mongoose";

const connectDB =async ()=>{
    try{
        console.log(process.env.MONGODB_URL)
        await mongoose.connect(process.env.MONGODB_URL!);
        console.log(`Successfully connected to mongoDB`);


    }catch(err:any){
        console.error(`Error connect to Database: ${err}`)

    }
}
export default connectDB;