import fetch from 'node-fetch';
import readline from 'readline-sync';

async function fetchAPI(apiUrl) {
    try {
    const response = await fetch(apiUrl);
    if (response.status !== 200) {
        throw new Error(`API not responding ${response.status}.`);
    }
    else {
        return await response.json();
    }}
    catch (Error) {
        console.error(Error);
    }
}


function getPostCodeFromUser() {
    try {
        const postCode = readline.question("Please enter your postcode: ").toUpperCase().trim();
        const regex = /\b^(E|EC|N|NW|S|SW|SE|W|WC)[0-9]{1,2}\s?[0-9][A-Z]{2}\b/; // Include greater London
        if (regex.test(postCode)) {
            console.log(postCode);
            return postCode;
        }
        else {
            throw new Error ("Invalid postcode.");
        }
    }
    catch(Error) {
        console.error(Error);
        getPostCodeFromUser();
    }
}

function parsePostCodeAPIdata(postCodeAPIRawData){
    const  coords = {};
    coords.longitude = postCodeAPIRawData.result.longitude;
    coords.latitude = postCodeAPIRawData.result.latitude;
    return coords;
}

function parseStopPointData(tFLStopPointAPIRawData){
   const stopPointData= tFLStopPointAPIRawData.stopPoints.map(busStop => ({
        StopPoint:busStop.naptanId,
        BusStop: busStop.commonName,
        Distance: busStop.distance
    }));

    return stopPointData.sort((a,b)=>a.Distance-b.distance).slice(0,2);
}

async function parseData(arrivalData) {  
    const busInfo = arrivalData.map(busDetails => ({
        Destination:busDetails.destinationName, 
        Route:busDetails.lineName,
        TimeToStation:Math.ceil(busDetails.timeToStation/60)
    }));
    return busInfo.sort((a,b) => a.TimeToStation - b.TimeToStation).slice(0,5);
}

function formattedBusDetails(busStopArrival,busStopName) {
    console.log(busStopName);
    busStopArrival.forEach((bus,index) => {
    console.log(`Bus ${index+1}`);
    for (let [key,value] of Object.entries(bus)) {
        if (key==="TimeToStation") {
            console.log(`${key} : ${value} minutes`);
        }
        else {
        console.log(`${key} : ${value}`);
        }
    }});
    console.log(`\n`);
}

async function getStopPointsDetails(){
    const postCodeAPIURL = "https://api.postcodes.io/postcodes/"+getPostCodeFromUser();
    const postCodeAPIRawData = await fetchAPI(postCodeAPIURL);
    const postCodeCoords = parsePostCodeAPIdata(postCodeAPIRawData);
    const tFLStopPointsAPIURL = `https://api.tfl.gov.uk/StopPoint/?lat=${postCodeCoords.latitude}&lon=${postCodeCoords.longitude}&stopTypes=NaptanPublicBusCoachTram`;
    const tFLStopPointAPIRawData = await fetchAPI(tFLStopPointsAPIURL);
    const stopPointParsedData=parseStopPointData(tFLStopPointAPIRawData);
    return stopPointParsedData;
}

async function getArrivalPredictions(busStopURL){
    const arrivalRawData = await fetchAPI(busStopURL);
    const firstFiveBuses = await parseData(arrivalRawData);
    return firstFiveBuses;
}

async function busBoard(){
    const stopPointDetails = await getStopPointsDetails(); //need to sort by distance and slice it to two

    const stopPointOne = stopPointDetails[0].StopPoint;
    const busStopOneURL="https://api.tfl.gov.uk/StopPoint/"+stopPointOne+"/Arrivals";
    const busStopOneName = stopPointDetails[0].BusStop;
    const busStopOneArrival= await getArrivalPredictions(busStopOneURL);

    const stopPointTwo = stopPointDetails[1].StopPoint;
    const busStopTwoURL="https://api.tfl.gov.uk/StopPoint/"+stopPointTwo+"/Arrivals";
    const busStopTwoName = stopPointDetails[1].BusStop;
    const busStopTwoArrival= await getArrivalPredictions(busStopTwoURL);

    formattedBusDetails(busStopOneArrival,busStopOneName);
    formattedBusDetails(busStopTwoArrival,busStopTwoName);
}

await busBoard();