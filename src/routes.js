const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');    
const TalhaoController = require('./controllers/TalhaoController');    


routes.get('/', (req, res)=> {
    return res.json({ hello: 'world '});
})

//rotas users
routes.post('/users', UserController.store);
routes.get('/users', UserController.listAllUsers);
routes.get('/users/:id_user', UserController.findOneUser); 
routes.put('/users/:id_user', UserController.updateUser); 
routes.delete('/users/:id_user', UserController.deleteUser); 


//rotas talhoes
routes.post('/users/:id_user/talhoes', TalhaoController.store);
routes.get('/users/:id_user/talhoes', TalhaoController.findAllTalhoesUser);
routes.get('/users/:id_user/talhoes/:id_talhao', TalhaoController.findOneTalhoesUser);
routes.put('/users/:id_user/talhoes/:id_talhao', TalhaoController.updateTalhao); 
routes.delete('/users/:id_user/talhoes/:id_talhao', TalhaoController.deleteTalhao); 
module.exports = routes;