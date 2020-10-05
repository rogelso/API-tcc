const express = require('express');
const routes = require('./routes');

const User = require("./models/User");
// validator
const Validator = require('fastest-validator');
const v = new Validator();


// Authorization token. para validação dos servicos da API
const jwt = require('jsonwebtoken'); 
const SECRET = 'tToZAZ@&78QeKPUhBm%S'; 

function checkPermission(req, res, next){
    if (req.path == '/login'|| req.path == '/users/register'){
        next();
    } else {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).send({message: 'Token não iformado'});

        jwt.verify(token, SECRET, function(err, decoded){
            if (err) return res.status(500).send({message:'Acesso Negado'});
            console.log("verificou o tokem");
            req.id_user = decoded.id;
            next();
        });
       
    }
}


require('./database')
const app = express();

app.use(express.json());
app.use(checkPermission);
app.use(routes);
app.listen(3333);

app.post('/login', async (req,res)=>{
        
    const{email, password} = req.body;    
     const filterValidatorLogin = {
        email: {max:30, min:11, type: 'email'},
        password: {max:25, min:8, type: 'string'}
    }
            
    const errors = v.validate(req.body, filterValidatorLogin);
    if (Array.isArray(errors) && errors.length){
        return res.status(400).json(errors);
    }

    const authUser = await User.findOne({
        where: {
            email: email,
            password: password 
        }
    });
                
    if(authUser){
        console.log('Login ok');
        const id = authUser.id;
        const token = jwt.sign({id},SECRET);
        
        const nome = authUser.nome;
        const sobrenome = authUser.sobrenome;
        const email = authUser.email;
        const cidade = authUser.cidade;

        console.log(token);
        res.send({token,id,nome,sobrenome,email,cidade});
            
    } else {
        console.log('Usuário ou Senha inválida');
        return res.status(401).json({erro: 'Usuário ou Senha inválida'});
    }                
});

