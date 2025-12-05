const express = require('express');
const mongoose=require('mongoose');
const app=express();

mongoose.connect('mongodb://127.0.0.1:27017/cardb');

const schema = new mongoose.Schema({Name:String , Type:String , Price:Number});

const carmodel = mongoose.model('car',schema);

app.use(express.json());

app.get('/getcars', async (req,res)=>{
    try{
        let result = await carmodel.find();
        res.json(result);
        console.log()
    }
    catch(err){
        console.log(err)
    }
    
})

app.post('/car',async (req,res)=>{
    try{
        let car = new carmodel(req.body);
        let result = await car.save();
        console.log(result)
        res.status(200).json({
            message:"data successfully submitted",
            data: result
        })
    }catch(err){
        console.log(err.message);
        res.status(500).json({
            message:"internal server error",
            err:err.message
        })
    }
})

app.put('/car/:id',async(req,res)=>{
    try{
        let car = await carmodel.findById(req.params.id)
        if(!car){
            res.status(404).json({
                message:"id not found",
            })
        }
       else{
        car.Name=req.body.Name;
        car.Type=req.body.Type;
        car.Price=req.body.Price;
        await car.save();
        res.status(200).json({
            message:"data updated successfully",
            data:car
        })
        }
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({
            message:"internal server error",
            err:err.message
        })
    }
})

app.delete('/car/:id',async(req,res)=>{
    try{
        let car = await carmodel.findByIdAndDelete(req.params.id);
        if(!car){
            res.status(404).json({
                message:"id not found"
            })
        }else{
            res.status(200).json({
                message:"data deleted successfully",
                data:car
            })
        }
    }
    catch(err){
        console.log(err.message)
    }
})

app.listen(8080,()=>{
    console.log("running on port number 8080");
})