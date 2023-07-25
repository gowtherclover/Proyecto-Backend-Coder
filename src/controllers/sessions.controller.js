
class SessionsController{
    get = async (req,res)=>{
        try{
            if (req.session.user) {
                const dataUser = req.session.user
                const {username} = dataUser
                const existUser = true
    
                return res.render('index',{existUser,username})
            }else{
                return res.render('index')
            }
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ status: "error", msg: error })
        }
    }

    getLogin = (req,res)=>{
        try{
            return res.render('login')
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ status: "error", msg: error })
        }
        
    }

    postLogin = (req, res) => {
        try {
            req.session.user = { 
                _id: req.user._id, 
                username: req.user.username, 
                email: req.user.email, 
                first_name: req.user.first_name, 
                last_name: req.user.last_name,
                age: req.user.age, 
                role: req.user.role,
                cart_ID:req.user.cart_ID };
            return res.redirect('/views/products');
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: "error", msg: error });
        }
    }

    getRegister = (req,res)=>{
        try{
            return res.render('register')
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ status: "error", msg: error })
        }
    }

    postRegister =  (req,res)=>{
        try{
            req.session.user = { _id: req.user._id, username: req.user.username, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name,age: req.user.age, role: req.user.role,cart_ID:req.user.cart_ID };
            return res.redirect('/views/products');
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ status: "error", msg: error })
        }
    }

    getLogout = (req, res) => {
        req.session.destroy(err => {
            if (err) {
            return res.json({ status: 'Logout ERROR', body: err })
            }
            return res.redirect('/login');
        })
    }

    getCurrent = async (req,res)=>{
        try{
            const dataUser = req.session.user
            const {first_name,last_name,username, email,age,role} = dataUser
    
            return res.render('profile',{first_name,last_name,username, email,age,role})
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ status: "error", msg: error })
        }
    }

    getGithubCallback = (req,res)=>{
        try{
            req.session.user = { 
                _id: req.user._id, 
                username: req.user.username, 
                email: req.user.email, 
                first_name: req.user.first_name, 
                last_name: req.user.last_name,
                age: req.user.age, 
                role: req.user.role,
                cart_ID:req.user.cart_ID
            };
            return res.redirect('/views/products');
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ status: "error", msg: error })
        }
        
    }

    getError = (req,res)=>{
        try{
            const { msg } = req.query;
            return res.render('errorLogin', { msg });
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ status: "error", msg: error })
        }
        
    }
}

export const sessionsController = new SessionsController()