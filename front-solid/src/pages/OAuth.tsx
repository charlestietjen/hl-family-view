import { createSignal } from 'solid-js'
// @ts-ignore
import { useSearchParams, useNavigate } from '@solidjs/router'
import { Typography, CircularProgress, Box } from '@suid/material'
import { getToken } from '../utils/HighLevel'
import { postToken } from '../utils/api'

const OAuth = () => {
    const [searchParams, _setSearchParams] = useSearchParams()
    // const navigate = useNavigate()
    const [_tokenState, setTokenState] = createSignal({})

    const authCode = searchParams.code

    if (authCode === undefined) {
        return (
            <Typography>Auth code not found</Typography>
        )
    }

    getToken(authCode).then(res => {
        setTokenState(res)
        const token = {...res, authCode: authCode}
        postToken(token).then(() => {
            // navigate('/')
        })
    })


    return (
        <Box alignContent='center' justifyContent='center'>
            <CircularProgress />
            <Typography textAlign='center'>Loading...</Typography>
        </Box>
    )
}

export default OAuth