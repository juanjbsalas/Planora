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

// A being departure,b being destination and t being date.

const fetchFlightOffers = async (a, b, t) => {
    const token = await getAccessToken();

    const response = await fetch('https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=CLT&destinationLocationCode=NYC&departureDate=2025-08-10&adults=1', {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();
    console.log("It is running!");
    console.log(data);
    console.log("---------------------------");
    
    const resultsContainer = document.getElementById('results');

    data.data.forEach((offer) => {
    const price = offer.price.total;
    const currency = offer.price.currency;
    const itinerary = offer.itineraries[0]; // outbound only
    const segment = itinerary.segments[0];

    const departureAirport = segment.departure.iataCode;
    const departureTime = segment.departure.at;
    const arrivalAirport = segment.arrival.iataCode;
    const arrivalTime = segment.arrival.at;
    const airline = segment.carrierCode;
    const duration = segment.duration;

    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0';

    card.innerHTML = `
        <div>
            <h2 class="text-xl font-semibold mb-2">${departureAirport} → ${arrivalAirport}</h2>
            <p class="text-gray-600">Departure: ${new Date(departureTime).toLocaleString()}</p>
            <p class="text-gray-600">Arrival: ${new Date(arrivalTime).toLocaleString()}</p>
            <p class="text-gray-600">Duration: ${duration.replace("PT", "").toLowerCase()}</p>
            <p class="text-gray-600">Airline: ${airline}</p>
            </div>
            <div class="text-right">
            <p class="text-2xl font-bold text-blue-600">${currency} ${price}</p>
        </div>
    `;

    resultsContainer.appendChild(card);
    });


};

// fetchFlightOffers();
