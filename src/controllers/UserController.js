const User = require("../models/User");

module.exports = {
    async store(req, res){
        try{
        const{nome, sobrenome, email, password, cidade} = req.body;

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
            const{nome, sobrenome, email, password, cidade} = req.body;

            const scanUser = await User.findByPk(id_user);

            if (!scanUser){
                return res.status(400).json({error: 'Usuário não encontrado'});               
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

}