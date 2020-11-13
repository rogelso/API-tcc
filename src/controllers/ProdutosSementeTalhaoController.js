const User = require("../models/User");
const Safra = require("../models/Safra");
const TalhaoSafra = require("../models/TalhaoSafra");
const ProdutosSementeTalhao = require("../models/ProdutosSementeTalhao");


const Estoque = require("../models/Estoque"); 


// validator
const Validator = require('fastest-validator');
const v = new Validator();
const filterValidator = {
    variedade_semente: {max:25, min:1, type: 'string'},
    populacao_metro:{min:1, type: 'number'},
    qtd_total_semente: {min:1, type: 'number'}
}

module.exports = {
    async store(req, res){
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {id_talhao_safra} = req.params;
    
        const id_produto = req.body.id_produto;
        const variedade_semente = req.body.variedade_semente;
        const populacao_metro = req.body.populacao_metro;
        const qtd_total_semente = req.body.qtd_total_semente;
           
        //ver se user existe so pra ter
        const user = await User.findByPk(id_user);
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'});           
        }
     
        //ver se talhao safra existe
        const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
        if (!talhao_safra){
            return res.status(400).json({error: 'Talhao Safra não encontrado'});           
        }
        if (talhao_safra.id_user != id_user){
            return res.status(400).json({error: 'Erro no cadastro. Talhao Safra selecionado não pertence ao usuário'});           
        }

        //ver se safra existe
        const safra = await Safra.findByPk(id_safra);
        if (!safra){
            return res.status(400).json({error: 'Safra não encontrada'});           
        }
        if (talhao_safra.id_safra != id_safra){
            return res.status(400).json({error: 'O talhão selecionado não pertence a safra correspondente'});           
        }
        
        //===========================================================//
        //ver se produto existe quantidade disponível
        const produto = await Estoque.findByPk(id_produto);
        if (!produto){
            return res.status(400).json({error: 'Produto não encontrado'});           
        }
        if (talhao_safra.id_safra != produto.id_safra){
            return res.status(400).json({error: 'Erro no cadastro. Produto Selecionado não corresponde a Safra selecionada'});           
        }
        if (produto.id_user != id_user){
            return res.status(400).json({error: 'Erro no cadastro. Produto selecionado não pertence ao usuário'});           
        }
        if (produto.qtd_disponivel < qtd_total_semente){
            return res.status(400).json({error: 'Erro no cadastro. ATENÇÃO! a quantidade disponível em estoque desse produto é menor do que você está atribuindo'});           
        }

        //ver  pra mostrar produtos disponiveis ja tem no estoque sei la

        const errors = v.validate({variedade_semente,populacao_metro,qtd_total_semente}, filterValidator);
        if (Array.isArray(errors) && errors.length){
            return res.status(400).json(errors);
        }

        const produtos_semente_area = await ProdutosSementeTalhao.create({ 
            id_talhao_safra,
            id_produto,
            variedade_semente,
            populacao_metro,
            qtd_total_semente   
        });
        
        const atualizaQtdDisponivelProduto = parseFloat((produto.qtd_disponivel - qtd_total_semente).toFixed(2));
        if(produtos_semente_area){
            const updateQtdDisponivelProduto = await Estoque.update({
                qtd_disponivel:atualizaQtdDisponivelProduto
            },                
                { 
                    where:{
                        id: id_produto,
                        id_user:id_user,
                        id_safra: id_safra    
                    },
                }
            );
            return res.json(produtos_semente_area);
        }
    },


    async findAllProdutosSementeTalhao(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {id_talhao_safra} = req.params;
        const {id_produto_semente_talhao} = req.params;
        
        //ver se user existe so pra ter
        const user = await User.findByPk(id_user);
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'});           
        }
     
        //ver se talhao safra existe
        const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
        if (!talhao_safra){
            return res.status(400).json({error: 'Talhão Safra não encontrado'});           
        }
        if (talhao_safra.id_user != id_user){
            return res.status(400).json({error: 'Erro. Talhão Safra selecionado não pertence ao usuário'});           
        }

        //ver se safra existe
        const safra = await Safra.findByPk(id_safra);
        if (!safra){
            return res.status(400).json({error: 'Safra não encontrada'});           
        }
        if (talhao_safra.id_safra != id_safra){
            return res.status(400).json({error: 'O talhão selecionado não pertence a safra correspondente'});           
        }

        const produtos_semente_talhao = await TalhaoSafra.findByPk(id_talhao_safra, { //busca o safra e vincula os produtos
            include: {association: 'produtos_semente_area'}            
        });
        
        if (!produtos_semente_talhao){
            return res.status(400).json({error: 'Não foi possível encontrar a Aplicacão'}); 
        }
        return res.json(produtos_semente_talhao);
    },

    
    async findOneProdutosSementeTalhao(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {id_talhao_safra} = req.params;
        const {id_produto_semente_talhao} = req.params;
        
        //ver se user existe so pra ter
        const user = await User.findByPk(id_user);
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'});           
        }
     
        //ver se talhao safra existe
        const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
        if (!talhao_safra){
            return res.status(400).json({error: 'Talhão Safra não encontrado'});           
        }
        if (talhao_safra.id_user != id_user){
            return res.status(400).json({error: 'Erro. Talhão Safra selecionado não pertence ao usuário'});           
        }

        //ver se safra existe
        const safra = await Safra.findByPk(id_safra);
        if (!safra){
            return res.status(400).json({error: 'Safra não encontrada'});           
        }
        if (talhao_safra.id_safra != id_safra){
            return res.status(400).json({error: 'O talhão selecionado não pertence a safra correspondente'});           
        }
        
        const produtos_semente_talhao = await ProdutosSementeTalhao.findOne(
            { 
                where:{
                    id: id_produto_semente_talhao,
                    id_talhao_safra: id_talhao_safra
                },
            }
        );
        
        if (!produtos_semente_talhao){
            return res.status(400).json({error: 'Não foi possível encontrar o registro da semente do talhão da safra'}); 
        }

        return res.json(produtos_semente_talhao);
    },


    async deleteProdutosSementeTalhao(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_talhao_safra} = req.params;
            const {id_produto_semente_talhao} = req.params;   
            
            //ver se user existe so pra ter
            const user = await User.findByPk(id_user);
            if (!user){
                return res.status(400).json({error: 'Usuário não encontrado'});           
            }
        
            //ver se talhao safra existe
            const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
            if (!talhao_safra){
                return res.status(400).json({error: 'Talhão Safra não encontrado'});           
            }
            if (talhao_safra.id_user != id_user){
                return res.status(400).json({error: 'Erro. Talhão Safra selecionado não pertence ao usuário'});           
            }

            //ver se safra existe
            const safra = await Safra.findByPk(id_safra);
            if (!safra){
                return res.status(400).json({error: 'Safra não encontrada'});           
            }
            if (talhao_safra.id_safra != id_safra){
                return res.status(400).json({error: 'O talhão selecionado não pertence a safra correspondente'});           
            }

            const scanProdutoSementeTalhao = await ProdutosSementeTalhao.findByPk(id_produto_semente_talhao);
            if (!scanProdutoSementeTalhao){
                return res.status(400).json({error: 'Registro da semente do talhão da safra não encontrado'});               
            }
            if (scanProdutoSementeTalhao.id_talhao_safra != id_talhao_safra){
                return res.status(400).json({error: 'Erro. O Registro da semente do talhão da safra a ser excluído não pertence ao talhão da safra selecionado atual'});               
            }
            
            const produto = await Estoque.findOne(
                { 
                    where:{
                        id: scanProdutoSementeTalhao.id_produto,
                        id_user:id_user,
                        id_safra:id_safra
                    },
                }
            );
            if(!produto){
                return res.status(400).json({error: 'Erro ao carregar id da semente do estoque'}); 
            }
            const atualizaQtdDisponivelProduto = parseFloat((produto.qtd_disponivel + scanProdutoSementeTalhao.qtd_total_semente).toFixed(2));

            const deleteProdutoSementeTalhao = await ProdutosSementeTalhao.destroy({
                where: {
                    id: id_produto_semente_talhao,
                    id_talhao_safra: id_talhao_safra                         
                }
             }).then(function(rowDeleted){ 
               if(rowDeleted === 1){
                  console.log('Deleted successfully');
                  
                const updateQtdDisponivelProduto = Estoque.update({
                    qtd_disponivel:atualizaQtdDisponivelProduto
                },                
                    { 
                        where:{
                            id: produto.id,
                            id_user:id_user,
                            id_safra: id_safra    
                        },
                    }
                );   
                    console.log('Produto Atualizado');
                    return res.status(200).json({sucesso: 'A Semente aplicada foi deletada, Seu Estoque foi Atualizado!'});
                }else{
                  console.log('Erro ao excluir a Semente aplicada');
                  return res.status(400).json({Erro: 'Não foi possivel excluir a Semente aplicada'});
                }
             }, function(err){
                 console.log(err);
                 return res.status(400).json({Erro: 'Não foi possivel deletar a Aplicação'}); 
             });
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },

}