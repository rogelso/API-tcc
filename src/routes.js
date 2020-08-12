const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');    
const TalhaoController = require('./controllers/TalhaoController');    
const SafraController = require('./controllers/SafraController');    
const EstoqueController = require('./controllers/EstoqueController');
const TalhaoSafraController = require('./controllers/TalhaoSafraController');


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


//rota login
routes.post('/login', UserController.login);


//rotas safra
routes.post('/users/:id_user/safras', SafraController.store);
routes.get('/users/:id_user/safras', SafraController.findAllSafrasUser);
routes.get('/users/:id_user/safras/:id_safra', SafraController.findOneSafrasUser);
routes.put('/users/:id_user/safras/:id_safra/add-custo-fixo', SafraController.addCustosFixosSafra);
routes.put('/users/:id_user/safras/:id_safra/remove-custo-fixo', SafraController.removeCustosFixosSafra);
routes.put('/users/:id_user/safras/:id_safra/add-custo-manutencoes-maq', SafraController.addCustosManutencoesMaq);
routes.put('/users/:id_user/safras/:id_safra/remove-custo-manutencoes-maq', SafraController.removeCustosManutencoesMaq);
routes.delete('/users/:id_user/safras/:id_safra', SafraController.deleteSafra); 



//rotas estoque
routes.post('/users/:id_user/safras/:id_safra/estoque', EstoqueController.store);
routes.get('/users/:id_user/safras/:id_safra/estoque', EstoqueController.findAllProdutosSafra);
routes.get('/users/:id_user/safras/:id_safra/estoque/:id_produto', EstoqueController.findOneProdutosSafra);
routes.put('/users/:id_user/safras/:id_safra/estoque/:id_produto', EstoqueController.updateProduto); 
routes.delete('/users/:id_user/safras/:id_safra/estoque/:id_produto', EstoqueController.deleteProduto); 



//rotas talhao safra
routes.post('/users/:id_user/safras/:id_safra/talhao/:id_talhao', TalhaoSafraController.store);
routes.get('/users/:id_user/safras/:id_safra/talhoes-safra', TalhaoSafraController.findAllTalhoesSafra);
routes.get('/users/:id_user/safras/:id_safra/talhoes-safra/:id_talhao_safra', TalhaoSafraController.findOneTalhoesSafra);
routes.put('/users/:id_user/safras/:id_safra/talhoes-safra/:id_talhao_safra/preparo-solo', TalhaoSafraController.updatePreparoSoloTalhaoSafra);
routes.put('/users/:id_user/safras/:id_safra/talhoes-safra/:id_talhao_safra/plantio', TalhaoSafraController.updatePlantioTalhaoSafra);
routes.put('/users/:id_user/safras/:id_safra/talhoes-safra/:id_talhao_safra/colheita', TalhaoSafraController.updateColheitaTalhaoSafra);
routes.put('/users/:id_user/safras/:id_safra/talhoes-safra/:id_talhao_safra/finalizar-cultivo', TalhaoSafraController.updateStatusTalhaoSafra);
routes.delete('/users/:id_user/safras/:id_safra/talhoes-safra/:id_talhao_safra', TalhaoSafraController.deleteTalhoesSafra);


module.exports = routes;