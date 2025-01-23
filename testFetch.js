import fetch from 'node-fetch';
import readline from 'readline-sync';

function getStopCodeFromUser() {
    const stopcode = readline.question("Please enter the required stop code: ");
    const regex = /\b[0-9]{9}[A-Z]{1}\b/;
    if(regex.test(stopcode)){
        return stopcode;
    }
    else{
        console.log("Invalid response");
        getStopCodeFromUser();
    }
}

function getURL(stopcode){  
    return "https://api.tfl.gov.uk/StopPoint/"+stopcode+"/Arrivals";
}


async function fetchAPI(apiUrl) {
    const response = await fetch(apiUrl);
    return await response.json();
}

async function parseData(data) {
    return data.map(busDetails => ({
        Destination:busDetails.destinationName, 
        Route:busDetails.lineName,
        TimeToStation:busDetails.timeToStation
    }));
}

function sortByArrivalTime(busInfo) {
    return busInfo.sort((a,b) => a.TimeToStation - b.TimeToStation);
}

function convertArrivalTimeToMinutes(sortedBusArrival){
    sortedBusArrival.forEach(bus=> bus.TimeToStation=Math.ceil(bus.TimeToStation/60));
    return sortedBusArrival;
}

function getFirstFiveBuses(busArrivalInMinutes) {
    return busArrivalInMinutes.slice(0,5);
}

function formattedBusDetails(firstFiveBuses){
    firstFiveBuses.forEach((bus,index)=>
{
    console.log(`Bus ${index+1}`);
    for(let[key,value] of Object.entries(bus)) {
        if(key==="TimeToStation") {
            console.log(`${key} : ${value} minutes`);
        }
        else {
        console.log(`${key} : ${value}`);
        }
    }
});
}

// Main 
const stopCode = getStopCodeFromUser();
const apiURL = getURL(stopCode);
const data = await fetchAPI(apiURL);
const busInfo = await parseData(data);
const sortedBusArrival = sortByArrivalTime(busInfo);
const busArrivalInMinutes = convertArrivalTimeToMinutes(sortedBusArrival);
const firstFiveBuses = getFirstFiveBuses (busArrivalInMinutes);
formattedBusDetails(firstFiveBuses);