import mongoose from "mongoose";

const saleSchema= new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date : {type :Date ,required :true },
    name:{type : String , required :true},
    price:{type :Number, required :true},
    method : {type : String , enum :["cash", "upi"] , required : true}
},{ timestamps: true })

export default mongoose.model("sales",saleSchema)


// const saleSchema = new mongoose.Schema({
//   date: { type: String, required: true }, // YYYY-MM-DD
//   drinkId: { type: Number, required: true },
//   drinkName: { type: String, required: true },
//   price: { type: Number, required: true },
//   method: { type: String, enum: ["cash", "upi"], required: true },
// });