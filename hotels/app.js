// http://test.api.amadeus.com/reference-data/locations/hotels/by-city?cityCode=NCE&radius=1

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

const fetchHotels = async () => {
    const token = await getAccessToken();
    console.log('About to fetch hotels in Charlotte (CLT)');

    const response = await fetch(`https://test.api.amadeus.com/reference-data/locations/hotels/by-city?cityCode=CLT`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();
    console.log(data);

}

fetchHotels();
