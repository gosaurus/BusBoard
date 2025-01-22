import fetch from 'node-fetch';

//Fetch TFL Stop-Point API. Note at this stage we are taking URL as it is with Stop Code. We will change it later to user prompt.
async function fetchAPI()
{
const response = await fetch("https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals");
let data = await response.json();
await extractData(data);
}

// Extract required data from API (Destination,Route Number,TimetoStation(seconds)); Returns list of objects 
async function extractData(data) {
    const extractInfo = data.map(busDetails=>({
        Destination:busDetails.destinationName, 
        Route:busDetails.lineName,
        TimeToStation:busDetails.timeToStation
    }));
    // console.log(extractInfo);
    return extractInfo
}

// Sort buses by timeToStation 
function arrivalTime(extractInfo) {
    let sortedBuses = extractInfo.sort((a,b) = a.busDetails.timeToStation - b.busDetails.timeToStation);
}

// Calling FetchAPI

fetchAPI();
