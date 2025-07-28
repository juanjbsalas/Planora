
// // ! Needs to be fixed
// const getAccessToken = async () => {
//   const response = await fetch('http://localhost:5000/api/token');
//   const data = await response.json();
//   return data.access_token;
// };


// Fetches an OAuth2 access token from the Amadeus API using client credentials
const getAccessToken = async () => {
  const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: 'zVvm3LYanXpnzdo8ho76sTwGVWzREeEJ',
      client_secret: 'Y4jpXJLW5bkYS33L', 
      // TODO: Move credentials to a secure backend to avoid exposing secrets in frontend code
    })
  });

  const data = await response.json();
  // Returns the access token to be used in subsequent authenticated API requests
  return data.access_token;
};

// Fetches flight offers from the Amadeus API using origin (x), destination (y), and date (z)
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
    // Prints the raw response for debugging:
    console.log(data);
    
    const resultsContainer = document.getElementById('results');

    // Validates API response structure before processing flight data
    if (!data || !data.data || !Array.isArray(data.data)) {
        console.error("Invalid flight data response:", data);
        return;
    }
    
    // ! Debug line:
    console.log("Total flight data from Amadeus API: ", data);

    // Loops through each flight offer and builds a UI card for display
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


        // Dynamically creates and styles a card element for each flight offer
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

// Searches for city names and converts them to city codes based on a user-provided keyword
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

    // Returns the full data object to extract IATA codes in the calling function
    return data;
};

// Main function triggered on form submission; orchestrates airport lookup and flight search
async function handleFlightSearch() {
    let x = document.getElementById('depart-destination').value.trim();
    let y = document.getElementById('arrival-destination').value.trim();
    let z = document.getElementById('date-picker').value.trim();

    let dest = await searchAirport(x);
    // Handle case where airport/city is not found
    if(!dest.data || dest.data === 0){
        alert(`Could not find airport code for ${x}`);
        return; //It is ending the function and returning nothing.
    }

    dest = dest.data[0]['iataCode'];

    let arrival = await searchAirport(y);
    if(!arrival.data || arrival.data.length === 0){
        alert(`Could not find airport code for ${y}`);
        return;
    }

    arrival = arrival.data[0]['iataCode'];

    // Format the user-selected date into YYYY-MM-DD format
    let date = convertDate(z); 

    // Calls function to fetch and display flight offers using processed input
    fetchFlightOffers(dest, arrival, date);

    console.log("Derparture search results: ", dest);    
    console.log("Arrival search results: ", arrival);    
}

// Converts a date string from MM/DD/YYYY to YYYY-MM-DD format for Amadeus API compatibility
function convertDate(dateString) {
    const parts = dateString.split('/'); // Splits "MM/DD/YYYY" into ["MM", "DD", "YYYY"]
    const formattedDate = `${parts[2]}-${parts[0]}-${parts[1]}`; // Rearranges parts array to YYYY-MM-DD
    return formattedDate;
}


//  Date Restriciton
// const today = new Date();
// const year = today.getFullYear();
// const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
// const day = String(today.getDate()).padStart(2, '0');

// const minDate = `${year}/${month}/${day}`;

// document.getElementById('date-picker').setAttribute('min', minDate);