import { Router } from "express";

const router = Router()

router.get("/getUsers",(req,res)=>{
    res.json(["nico","jusa"])
})

export default router