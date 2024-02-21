const{StatusCodes}=require('http-status-codes');
const{ Op } =require('sequelize');
const {FlightRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');

const flightRepository = new FlightRepository();

async function createFlight(data){
    try {
        const flight = await flightRepository.create(data);
        return flight;
    } catch (error) {
        if(error.name=='SequelizeValidationError'){
            let explanation=[];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new Flight object',StatusCodes.INTERNAL_SERVER_ERROR);
        
    }
}

async function getAllFlights(query){
    let customFilter={};
    let sortFliter=[];
    const endingTripTime="23:59:00"
    //trips=MUM-DEL
    if(query.trips){
        [departureAirportId,arrivalAirportId]=query.trips.split("-");
        customFilter.departureAirportId=departureAirportId;
        customFilter.arrivalAirportId=arrivalAirportId;
    }
    if(query.price){
        [minPrice,maxPrice]=query.price.split("-");
        customFilter.price={
            [Op.between]:[minPrice,((maxPrice==undefined)?20000:maxPrice)]
        }
    }
    if(query.travellers){
        customFilter.totalSeats={
            [Op.gte]:[query.travellers]
        }
    }
    if(query.tripdate){
        customFilter.departureTime={
            [Op.between]:[query.tripdate,query.tripdate+endingTripTime]
        }
    }
    if(query.sort){
        const params=query.sort.split(',');
        const sortFliters=params.map((param)=>param.split('_'));
        sortFliter=sortFliters
    }
    try {
        const flights=await flightRepository.getAllFlights(customFilter,sortFliter);
        return flights;
    } catch (error) {
        throw new AppError('Cannot fetch data of all Flights',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports={
    createFlight,
    getAllFlights
} 
