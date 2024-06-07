import { createSignal } from 'solid-js'
import { useSearchParams, useNavigate } from '@solidjs/router'
import { Typography, CircularProgress, Box } from '@suid/material'
import { getToken } from '../utils/HighLevel'
import { storeHlToken } from '../utils/Pocketbase'

const OAuth = () => {
    const [searchParams, _setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const [_tokenState, setTokenState] = createSignal({})

    const authCode = searchParams.code

    if (authCode === undefined) {
        return (
            <Typography>Auth code not found</Typography>
        )
    }

    getToken(authCode).then(res => {
        setTokenState(res)
        storeHlToken(res).then(() => {
            navigate('/')
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