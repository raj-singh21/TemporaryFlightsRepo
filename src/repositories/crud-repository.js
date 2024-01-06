const{Logger} = require('../config');

class CrudRepository{
    constructor(model){
        this.model=model;
    }

    async create(data){
        const response=await this.model.create(data);
        return response;
    }

    async destroy(data){
        const response=await this.model.destroy({
            where:{
                id:data
            }
        });
        return response;
    }

    async get(data){
        const response=await this.model.findBYPk(data);
        return response;
        
    }

    async getAll(data){
        const response=await this.model.findAll(data);
        return response;
        
    }

    async update(id,data){ //data here is an object in update
        const response=await this.model.update(data,{
            where:{
                id:id
            }
        });
        return response;
        
    }
}

module.exports= CrudRepository;