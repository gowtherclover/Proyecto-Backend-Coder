import express from "express"
import { cartService } from "../services/carts.service.js"
import { prodService } from "../services/products.service.js"
export const viewsCartsRouter = express.Router()

viewsCartsRouter.get('/', async (req,res)=>{
    try{
        let allCarts = await cartService.getAllCarts()
        return res
        .status(200).
        json({
            status:"success", 
            msg:'products in cart',
            payload:allCarts
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: "Error getting cart" })
    }
    
})

viewsCartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cartFound = await cartService.findOne(cid);

        if (cartFound) {
            return res
            .status(201)
            .json({ status: "success", msg: 'cart found', payload: cartFound });
        } else {
            return res
            .status(400)
            .json({ status: "error", msg: 'The indicated cart was not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", msg: 'Internal Server Error' });
    }
});

viewsCartsRouter.post('/:cid/product/:pid', async (req,res)=>{
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const productById= await prodService.findOne(pid)

        if (productById) {
            const createdProduct = await cartService.create({cid,pid})
            if (createdProduct) {
                return res
                .status(201).
                json({status:"success", msg:'product added to cart',payload:createdProduct})
            }
            else{
                return res
                .status(400).
                json({status:"error", msg:'The product was not added to the cart'})
            }
        }
        else{
            return res
                .status(400).
                json({status:"error", msg:'No product found to add to cart'})
        }
        
    }
    catch (error) {
        return res.status(500).json({ status: 'error', msg: 'could not add product to cart', error: error.message });
    }
})

