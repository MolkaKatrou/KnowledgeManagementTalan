import { ChakraProvider } from '@chakra-ui/react'
import { Box, Container, makeStyles } from '@material-ui/core'
import { Grid } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import HomeNavbar from '../../Common/homeNavbar'
import Rightbar from '../../Common/Rightbar'
import Sidebar from '../../Common/Sidebar'
import ChatBox from '../../Components/Chats/ChatBox'
import MyChats from '../../Components/Chats/MyChats'
import { HomeContext } from '../../Context/HomeContext'
import AddNote from './AddNote'
import Home from './Home'

function Chats() {
    const { fetchAgain, setFetchAgain } = useContext(HomeContext)
    return (
        <>

            <Home>
                <ChakraProvider>
                    <MyChats fetchAgain={fetchAgain} />
                    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </ChakraProvider>
            </Home>
        </>
    )
}

export default Chats