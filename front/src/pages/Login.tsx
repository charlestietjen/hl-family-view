import { useState } from 'react'
// import { Card, CardContent, Tab, Tabs, Button, Typography, TextField } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Button, Stack, TextField } from '@mui/material'

const Login = () => {
    const [tab, setTab] = useState(0)
    const [formState, setFormState] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })

    const handleChange = e => {
        console.log(e.target, ', ', e.currentTarget)
        setFormState({ ...formState, [e.currentTarget.name]: e.currentTarget.value })
    }

    return (
        <Card sx={{ padding: 4 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Stack spacing={1} direction={"row"}>
                        <Button variant={tab === 0 ? "contained" : "outlined"} onClick={() => setTab(0)}>Login</Button>
                        <Button variant={tab === 1 ? "contained" : "outlined"} onClick={() => setTab(1)}>Create Account</Button>
                    </Stack>
                    {tab === 0 ? (
                        <form>
                            <Stack spacing={1}>
                                <TextField name="email" onChange={handleChange} label="Email" type="email" />
                                <TextField name="password" onChange={handleChange} label="Password" type="password" />
                                <Button type="submit" variant="outlined">Login</Button>
                            </Stack>
                        </form>
                    ) :
                        (<form>
                            <Stack spacing={1}>
                                <TextField name="email" label="Email" type="email" />
                                <TextField name="password" onChange={handleChange} label="Password" type="password" />
                                <TextField name="confirmPassword" onChange={handleChange} label="Confirm Password" type="password" />
                                <Button type="submit" variant="outlined">Create Account</Button>
                            </Stack>
                        </form>)}
                </Stack>
            </CardContent>
        </Card>
    )
}

export default Login