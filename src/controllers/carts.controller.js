import { cartService } from "../services/carts.service.js"
import { prodService } from "../services/products.service.js"

class CartController {
    getAllCarts = async (req,res)=>{
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
    }

    findOne = async (req, res) => {
        try {
            const cid = req.params.cid;
            const cartFound = await cartService.findOne(cid);
    
            if (cartFound) {
                return res
                .status(200)
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
    }

    createProd = async (req,res)=>{
        try{
            const cid = req.params.cid
            const pid = req.params.pid
            const productById= await prodService.findOne(pid)
    
            if (productById.stock > 0) {
                const createdProduct = await cartService.createProd({cid,pid})
    
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
    }

    createCart = async (req,res)=>{
        try{
            const newCart = await cartService.createCart()
            return res
            .status(201).
            json({status:"success", msg:'new cart',payload:newCart})
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ status: "error", msg: "Error creating cart" })
        }
    }

    deleteProd = async (req,res)=>{
        try{
            const cid = req.params.cid
            const pid = req.params.pid
            const productById= await prodService.findOne(pid)
    
            if (productById) {
                const deletedProduct = await cartService.deleteProd({cid,pid})
                
                if (deletedProduct) {
                    return res
                    .status(200).
                    json({status:"success", msg:'product removed from cart',payload:deletedProduct})
                }
                else{
                    return res
                    .status(400).
                    json({status:"error", msg:'The product was not removed from the cart'})
                }
            }
            else{
                return res
                    .status(400).
                    json({status:"error", msg:'No product found to remove from cart'})
            }
            
        }
        catch (error) {
            return res.status(500).json({ status: 'error', msg: 'Could not remove product from cart', error: error.message });
        }
    }

    deleteCart = async (req, res) => {
        try {
            const cid = req.params.cid;
            const cartToEmpty = await cartService.deleteCart({cid});
            if (cartToEmpty) {
                return res
                .status(200)
                .json({ status: "success", msg: 'cart removed', payload: cartToEmpty });
            } else {
                return res
                .status(400)
                .json({ status: "error", msg: 'The indicated cart was not found' });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: "error", msg: 'Internal Server Error' });
        }
    }
}

export const cartController = new CartController()