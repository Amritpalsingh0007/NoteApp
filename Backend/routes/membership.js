import { Router } from "express";
import { authorize, Roles } from "../middleware/auth.js";
import membershipModel from "../model/membershipSchema.js";
import { Plans } from "../config.js";
const router = Router();

router.post("/tenants/:slug/upgrade", authorize(Roles.Admin), (req, res)=>{
    const slug = req.params.slug;
    const tenant_id = req.user.tenant_id;
    if(tenant_id !== slug){
        console.log(`tenant_id : ${tenant_id} : ${slug}`)
        return res.status(403).json({message: "Access denied"});
    }
    membershipModel.updateOne({tenant_id}, {membership: Plans.pro}, {new:true})
    .then((data)=>{
        if(!data){
            return res.status(404).json({message:"Tenant not found"});
        }
        res.status(200).json({message:"Upgraded membership successfully"});
    })
    .catch((error)=>{
        console.log(error);
        return res.status(500).json({message:"Unable to upgrade plan"});
    });
});


export default router;