import fetch from 'node-fetch';
import readline from 'readline-sync';

// get postcode via user input
function getPostCodeFromUser() {
    try {
        const postCode = readline.question("Please enter your postcode: ").toUpperCase().trim();
        const regex = /\b^(E|EC|N|NW|S|SW|SE|W|WC)[0-9]{1,2}\s?[0-9][A-Z]{2}\b/; // does not include greater London
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

function getURL(...URLSubstring){
   return URLSubstring.join("");
}

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
//Main Part 2
const postCode = getPostCodeFromUser();
const postCodeAPISubstring = "https://api.postcodes.io/postcodes/";
const postCodeAPIURL = getURL(postCodeAPISubstring, postCode);
const postCodeAPIRawData= await fetchAPI(postCodeAPIURL);
console.log(postCodeAPIRawData);

/* Commented out to test functions
call PostCodes.io API with postcode

parse Response from PostCodes.io (lon & lat)

call TfL API with longitude, latitude & stoptype (NaptanPublicBusCoachTram)

process Response from TfL API --> 
     get distances (from stopPoint object)
     sort by distances
     return close two bus stops by distance 

function getStopCodeFromUser() {
    const stopcode = readline.question("Please enter the required stop code: ");
    const regex = /\b[0-9]{9}[A-Z]{1}\b/;
    if  (regex.test(stopcode)) {
        return stopcode;
    }
    else {
        console.log("Invalid response");
        getStopCodeFromUser();
    }
}

function getURL(stopcode) {  
    return "https://api.tfl.gov.uk/StopPoint/"+stopcode+"/Arrivals";
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

function formattedBusDetails(firstFiveBuses) {
    firstFiveBuses.forEach((bus,index) => {
    console.log(`Bus ${index+1}`);
    for (let [key,value] of Object.entries(bus)) {
        if (key==="TimeToStation") {
            console.log(`${key} : ${value} minutes`);
        }
        else {
        console.log(`${key} : ${value}`);
        }
    }});
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
*/