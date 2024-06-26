

onAfterBootstrap(() => {
    const result = new DynamicModel({
        // describe the shape of the data (used also as initial values)
        "id": "",
        "username": "",
        "token": {
            "access_token": "",
            "refresh_token": "",
            "expires_in": 0,
            "locationId": "",
            "userId": "",
            "userType": "",
        },
    })
    $app.dao().db()
        .newQuery("SELECT id, username, token FROM users WHERE username = 'uc_toronto'")
        .one(result) // throw an error on db failure or missing row
    const options = {
        url: 'https://services.leadconnectorhq.com/oauth/token',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            client_id: '6660b87a6d344620697b8752-lx28bmov',
            client_secret: '203aca0e-eb71-4d46-a245-5ff65d229665',
            grant_type: 'refresh_token',
            code: result.code,
            refresh_token: result.token.refresh_token,
            user_type: result.token.userType,
            redirect_uri: ''
        })
    };

    console.log(JSON.stringify(options))
    const res = $http.send(options)

    console.log(JSON.stringify(res))

    // try {
    //   const response = fetch(url, options)
    //   .then(res => res.json()
    // .then(data => console.log(data)));
    //   const data = response.json();
    //   console.log(data);
    // } catch (error) {
    //   console.error(error);
    // }
})



cronAdd("Database Update", "*/1 * * * *", () => {
    const result = new DynamicModel({
        // describe the shape of the data (used also as initial values)
        "id": "",
        "username": "",
        "token": {
            "access_token": "",
            "refresh_token": "",
            "expires_in": 0,
            "locationId": "",
            "userId": "",
        },
    })
    $app.dao().db()
        .newQuery("SELECT id, username, token FROM users WHERE username = 'uc_toronto'")
        .one(result) // throw an error on db failure or missing row
    console.log(...result)
})

cronAdd("Refresh Access Token", "0 */12 * * *", () => {
    const result = new DynamicModel({
        // describe the shape of the data (used also as initial values)
        "id": "",
        "username": "",
        "token": {
            "access_token": "",
            "refresh_token": "",
            "expires_in": 0,
            "locationId": "",
            "userId": "",
        },
    })
    $app.dao().db()
        .newQuery("SELECT id, username, token FROM users WHERE username = 'uc_toronto'")
        .one(result) // throw an error on db failure or missing row
    const url = 'https://services.leadconnectorhq.com/oauth/token';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
        },
        body: new URLSearchParams({
            client_id: '',
            client_secret: '',
            grant_type: 'refresh_token',
            code: '',
            refresh_token: '',
            user_type: '',
            redirect_uri: ''
        })
    };

    try {
        const response = fetch(url, options);
        const data = response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})