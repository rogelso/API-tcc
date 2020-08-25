const User = require("../models/User");
const Safra = require("../models/Safra");
const TalhaoSafra = require("../models/TalhaoSafra");
const ProdutosFertilizacaoTalhao = require("../models/ProdutosFertilizacaoTalhao");


const Estoque = require("../models/Estoque"); 


// validator
const Validator = require('fastest-validator');
const v = new Validator();
const filterValidator = {
    variedade_fertilizante: {max:25, min:1, type: 'string'},
    qtd_adubo_ha:{min:1, type: 'number'},
    qtd_total_adubo: {min:1, type: 'number'}
}

module.exports = {
    async store(req, res){
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {id_talhao_safra} = req.params;
    
        const id_produto = req.body.id_produto;
        const variedade_fertilizante = req.body.variedade_fertilizante;
        const qtd_adubo_ha = req.body.qtd_adubo_ha;
        const qtd_total_adubo = req.body.qtd_total_adubo;
           
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
            return res.status(400).json({error: 'Erro no cadastro. Talhão Safra selecionado não pertence ao usuário'});           
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
        //ver se produto existe e se tem disponvel
        const produto = await Estoque.findByPk(id_produto);
        if (!produto){
            return res.status(400).json({error: 'Produto não encontrado'});           
        }
        if (talhao_safra.id_safra != produto.id_safra){
            return res.status(400).json({error: 'Erro no cadastro. Produto Selecionado não corresponde a Safra selecionada'});           
        }
        if (produto.id_user != id_user){
            return res.status(400).json({error: 'Erro no cadastro. Este usuário naõ possui esse produto'});           
        }
        if (produto.qtd_disponivel < qtd_total_adubo){
            return res.status(400).json({error: 'Erro no cadastro. ATENÇÃO! a quantidade disponível em estoque desse produto é menor do que você está atribuindo'});           
        }

        //ver  pra mostrar produtos disponiveis ja tem no estoque sei la

        const errors = v.validate({variedade_fertilizante,qtd_adubo_ha,qtd_total_adubo}, filterValidator);
        if (Array.isArray(errors) && errors.length){
            return res.status(400).json(errors);
        }
        //return res.json('teste');

        const produtos_fertilizante_talhao = await ProdutosFertilizacaoTalhao.create({ 
            id_talhao_safra,
            id_produto,
            variedade_fertilizante,
            qtd_adubo_ha,
            qtd_total_adubo
        });
        
        const atualizaQtdDisponivelProduto = parseFloat((produto.qtd_disponivel - qtd_total_adubo).toFixed(2));
        if(produtos_fertilizante_talhao){
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
            console.log('Produto fertilização cadastrado. Estoque atualizado');
            return res.json(produtos_fertilizante_talhao);
        }
    },


    async findAllProdutosFertilizacaoTalhao(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {id_talhao_safra} = req.params;
        const {id_produto_fertilizacao_talhao} = req.params;
        
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

        const produtos_fertilizante_talhao = await TalhaoSafra.findByPk(id_talhao_safra, { //busca o safra e vincula os produtos
            include: {association: 'produtos_fertilizantes'}            
        });
        
        if (!produtos_fertilizante_talhao){
            return res.status(400).json({error: 'Não foi possível encontrar a Aplicacão'}); 
        }
        return res.json(produtos_fertilizante_talhao);
    },

    
    async findOneProdutosFertilizacaoTalhao(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {id_talhao_safra} = req.params;
        const {id_produto_fertilizacao_talhao} = req.params;
        
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
        
        const produto_fertilizante_talhao = await ProdutosFertilizacaoTalhao.findOne(
            { 
                where:{
                    id: id_produto_fertilizacao_talhao,
                    id_talhao_safra: id_talhao_safra
                },
            }
        );
        
        if (!produto_fertilizante_talhao){
            return res.status(400).json({error: 'Não foi possível encontrar o registro do Fertilizante do talhão da safra'}); 
        }

        return res.json(produto_fertilizante_talhao);
    },


    async deleteProdutosFertilizacaoTalhao(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_talhao_safra} = req.params;
            const {id_produto_fertilizacao_talhao} = req.params;   
            
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

            const scanProdutoFertilizanteTalhao = await ProdutosFertilizacaoTalhao.findByPk(id_produto_fertilizacao_talhao);
            if (!scanProdutoFertilizanteTalhao){
                return res.status(400).json({error: 'Registro do fertilizante do talhão da safra não foi encontrado'});               
            }
            if (scanProdutoFertilizanteTalhao.id_talhao_safra != id_talhao_safra){
                return res.status(400).json({error: 'Erro. O Registro do fertilizante do talhão da safra a ser excluído não pertence ao talhão da safra selecionado atual'});               
            }
            
            const produto = await Estoque.findOne(
                { 
                    where:{
                        id: scanProdutoFertilizanteTalhao.id_produto,
                        id_user:id_user,
                        id_safra:id_safra
                    },
                }
            );
            if(!produto){
                return res.status(400).json({error: 'Erro ao carregar id do fertilizante do estoque'}); 
            }
            const atualizaQtdDisponivelProduto = parseFloat((produto.qtd_disponivel + scanProdutoFertilizanteTalhao.qtd_total_adubo).toFixed(2));

            const deleteProdutoFertilizanteTalhao = await ProdutosFertilizacaoTalhao.destroy({
                where: {
                    id: id_produto_fertilizacao_talhao,
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
                    return res.status(200).json({sucesso: 'O Fertilizante aplicado foi deletado. Seu Estoque foi Atualizado!'});
                }else{
                  console.log('Erro ao excluir a fertilizante');
                  return res.status(400).json({Erro: 'Não foi possivel excluir a Semente aplicada'});
                }
             }, function(err){
                 console.log(err);
                 return res.status(400).json({Erro: 'Não foi possivel deletar o Fertilizante'}); 
             });
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },

}