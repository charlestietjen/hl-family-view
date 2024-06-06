export const getToken = async (code: string) => {
    const url = 'https://services.leadconnectorhq.com/oauth/token';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
        },
        body: new URLSearchParams({
            client_id: import.meta.env.VITE_CLIENT_ID,
            client_secret: import.meta.env.VITE_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            refresh_token: '',
            user_type: 'Company',
            redirect_uri: ''
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data
    } catch (error) {
        console.error(error);
    }
}

export const refreshToken = async (refreshToken: string) => {
    const url = 'https://services.leadconnectorhq.com/oauth/token';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
        },
        body: new URLSearchParams({
            client_id: import.meta.env.VITE_CLIENT_ID,
            client_secret: import.meta.env.VITE_CLIENT_SECRET,
            grant_type: 'refresh_token',
            code: '',
            refresh_token: refreshToken,
            user_type: 'Company',
            redirect_uri: ''
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data
    } catch (error) {
        console.error(error);
    }
}