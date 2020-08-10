const User = require("../models/User");


// validator
const Validator = require('fastest-validator');
const v = new Validator();
const filterValidator = {
    nome: {max:30, min:4, type: 'string'},
    sobrenome: {max:30, min:4, type: 'string'},
    email: {max:30, min:11, type: 'email'},
    password: {max:25, min:8, type: 'string'},
    cidade: {max:30, min:5, type: 'string', trimRight:true}
}
 require('str-trim');
// const { body } = require('express-validator');





module.exports = {
    async store(req, res){
        try{
        //const{nome,sobrenome, email, password, cidade} = req.body;
        const nome = req.body.nome.trim();
        const sobrenome = req.body.sobrenome.trim();
        const email = req.body.email.trim();
        const password = req.body.password.trim();
        const cidade = req.body.cidade.trim();

        const errors = v.validate({nome, sobrenome,email,password,cidade}, filterValidator);

        if (Array.isArray(errors) && errors.length){
            return res.status(400).json(errors);
        }
        //await é para deixar a manipulacao no db assincrona, espera terminar para continuar     
        const user = await User.create({nome, sobrenome,email,password,cidade});

        return res.json(user);
        } catch (err){
            return res.status(400).json({error: err.message});
        }
    },

    async listAllUsers(req, res){   
        const users = await User.findAll();
        return res.json(users);
    },
    
    async findOneUser(req, res){   
        const {id_user} = req.params;
        try{
            const user = await User.findByPk(id_user);

            if (!user){
                return res.status(400).json({error: 'Usuário não encontrado'});               
            }

            return res.json(user);
        }catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    async updateUser(req, res){
        try{
            const {id_user} = req.params;
            //const{nome,sobrenome, email, password, cidade} = req.body;
            const nome = req.body.nome.trim('_').trim();
            const sobrenome = req.body.sobrenome.trim('_').trim();
            const email = req.body.email.trim('_').trim();
            const password = req.body.password.trim('_').trim();
            const cidade = req.body.cidade.trim('_').trim();

            const scanUser = await User.findByPk(id_user);

            if (!scanUser){
                return res.status(400).json({error: 'Usuário não encontrado'});               
            } 

            const errors = v.validate({nome, sobrenome,email,password,cidade}, filterValidator);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }

            const [updated] = await User.update({
                nome : nome, 
                sobrenome: sobrenome,
                email: email,
                password: password, 
                cidade: cidade },                
                { 
                    where:{
                        id: id_user                        
                    },
                }
            );
            if (updated) {
                const userUpdated = await User.findByPk(id_user);
                return res.json(userUpdated);
            }else{
                console.log('Erro na atualização do Talhao');
                return res.status(400).json({Erro: 'Não foi possivel deletar o Talhão'}); 
            }
            
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    async deleteUser(req, res){
        try{
            const {id_user} = req.params;
                
            const scanUser = await User.findByPk(id_user);

            if (!scanUser){
                return res.status(400).json({error: 'Usuário não encontrado'});               
            }
                       
            const user = await User.destroy({
                where: {
                   id: id_user 
                }
             }).then(function(rowDeleted){ 
               if(rowDeleted === 1){
                  console.log('Deleted successfully');
                  return res.status(200).json({sucesso: 'Usuário deletado'});
                }else{
                    console.log('Erro no delete do Usuário');
                    return res.status(400).json({Erro: 'Não doi possivel deletar o Usuário'});
                }
             }, function(err){
                 console.log(err); 
             });
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    async login(req, res){
        try{
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
                }
            );
                
            if(authUser){
                console.log('Login ok');
                return res.json(authUser);               
            }else
            {
                console.log('Usuário ou Senha inválida');
                return res.status(401).json({erro: 'Usuário ou Senha inválida'});
            }
             
         } catch (err){
             return res.status(400).json({error: err.message});            
         }
    },

    

}