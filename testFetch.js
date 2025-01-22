import fetch from 'node-fetch';

const response = await fetch("https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals");
console.log(response);