import fetch from 'node-fetch';

const response = await fetch("https://api.tfl.gov.uk/StopPoint/Mode/bus/Disruption");
console.log(response.body);