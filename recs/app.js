const getAccessToken = async () => {
  const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: 'zVvm3LYanXpnzdo8ho76sTwGVWzREeEJ', // I need to hide this somehow from the fronted
      client_secret: 'Y4jpXJLW5bkYS33L', // I need to hide this somehow from the frontend
    })
  });

  const data = await response.json();
  return data.access_token;
};

// a being departure,b being destination and t being date.
// ! Figure out the onclick fetch, also figure out how to convert cities to location codes.
const fetchFlightOffers = async (x, y, z) => {
    const token = await getAccessToken();

    console.log(`About to fetch flights from ${x} to ${y} on ${z}`);
    const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${x}&destinationLocationCode=${y}&departureDate=${z}&adults=1`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();
    // console.log("It is running!");
    console.log(data);
    // console.log("---------------------------");
    
    const resultsContainer = document.getElementById('results');

    // Checking if data is erroneous
    if (!data || !data.data || !Array.isArray(data.data)) {
        console.error("Invalid flight data response:", data);
        return;
    }
    
    // ! Debug line:
    console.log("Total flight data from Amadeus API: ", data);

    data.data.forEach((offer) => {


        const price = offer.price.total;
        const currency = offer.price.currency;
        const itinerary = offer.itineraries[0]; // outbound only

        let route, departureTime, arrivalTime, airline, duration;

        const segments = itinerary.segments;
        const flightLength = segments.length;

        const firstSegment = segments[0];
        const lastSegment = segments[flightLength - 1];

        const departureAirport = firstSegment.departure.iataCode;
        const arrivalAirport = lastSegment.arrival.iataCode;
        route = `${departureAirport} → ${arrivalAirport}`;

        departureTime = firstSegment.departure.at;
        arrivalTime = lastSegment.arrival.at;
        airline = firstSegment.carrierCode;
        duration = itinerary.duration || firstSegment.duration || '';



        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0';

        card.innerHTML = `
            <div>
                <h2 class="text-xl font-semibold mb-2">${route}</h2>
                <p class="text-gray-600">Departure: ${new Date(departureTime).toLocaleString()}</p>
                <p class="text-gray-600">Arrival: ${new Date(arrivalTime).toLocaleString()}</p>
                <p class="text-gray-600">Duration: ${duration ? duration.replace("PT", "").toLowerCase() : "N/A" }</p>
                <p class="text-gray-600">Airline: ${airline}</p>
                </div>
                <div class="text-right">
                <p class="text-2xl font-bold text-blue-600">${currency} ${price}</p>
            </div>
        `;

        resultsContainer.appendChild(card);
    });


};

const searchAirport = async (cityKeyword) => {
    const token = await getAccessToken();

    const url = `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${cityKeyword}`;

    const response = await fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
    },
    });

    const data = await response.json();
    // console.log(data);
    return data;
};


async function everything() {
    let a = document.getElementById('depart-destination').value.trim();
    let b = document.getElementById('arrival-destination').value.trim();
    let t = document.getElementById('date-picker').value.trim();

    let dest = await searchAirport(a);
    if(!dest.data || dest.data === 0){
        alert(`Could not find airport code for ${a}`);
        return; //It is ending the function and returning nothing.
    }

    dest = dest.data[0]['iataCode'];

    let arrival = await searchAirport(b);
    if(!arrival.data || arrival.data.length === 0){
        alert(`Could not find airport code for ${b}`);
        return;
    }

    arrival = arrival.data[0]['iataCode'];
    // console.log(arrival);

    let date = convertDate(t); // Returns a string with the date

    //Call function to fetch the flight offers.

    fetchFlightOffers(dest, arrival, date);

    console.log("Derparture search results: ", dest);    
    console.log("Arrival search results: ", arrival);    
}

function convertDate(dateString) {
    const parts = dateString.split('/'); // Splits "MM/DD/YYYY" into ["MM", "DD", "YYYY"]
    const formattedDate = `${parts[2]}-${parts[0]}-${parts[1]}`; // Rearranges to YYYY-MM-DD
    return formattedDate;
}


// everything();