import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import { Avatar, Button, ChakraProvider, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, IconButton, Input, InputGroup, InputLeftElement, Spinner, useDisclosure } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { HomeContext } from "../../Context/HomeContext";
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";
import { getSender, getSenderPic } from "./ChatLogic";
import GroupChatModal from "./GroupChatModal";
import SearchIcon from '@mui/icons-material/Search';
import { DarkModeContext } from "../../Context/darkModeContext";

const MyChats = ({ fetchAgain }) => {
    const {darkMode} = useContext(DarkModeContext)
    const auth = useSelector(state => state.auth)
    const {t, chats, setChats, selectedChat, setSelectedChat, notification, setNotification } = useContext(HomeContext)
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`/Api/searchUsers?keyword=${search}`);
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false)
            setSearch('')

        }
    }
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const { data } = await axios.post(`/Api/chat`, { userId });
            if (!chats.find((c) => c._id === data._id))
                setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const fetchChats = async () => {
        try {
            const { data } = await axios.get("/api/chat");
            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };
    useEffect(() => {
        fetchChats();
    }, [fetchAgain]);

    return (
        <ChakraProvider>
            <Box
                d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
                flexDir="column"
                alignItems="center"
                p={3}
                bg="#D4D2DD"
                className="chats"
                w={{ base: "100%", md: "31%" }}
                borderRadius="lg"
                borderWidth="1px"
            >
                <Box
                    pb={3}
                    px={3}
                    fontSize={{ base: "28px", md: "30px" }}
                    fontFamily="Work sans"
                    d="flex"
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Button onClick={onOpen} className='item'  variant='outline' borderColor='blue.500' fontSize={{ base: "17px", md: "10px", lg: "11px" }} colorScheme='blackAlpha'>{t('My Chats')}</Button>
                    <GroupChatModal>
                        <Button
                     colorScheme='telegram' variant='solid'
                            d="flex"
                            fontSize={{ base: "17px", md: "10px", lg: "15px" }}
                            rightIcon={<AddIcon />}
                        >
                            {t('New Group Chat')}
                        </Button>
                    </GroupChatModal>

                </Box>
                <Box
                    d="flex"
                    flexDir="column"
                    p={3}
                    bg="#D4D2DD"
                    className="chats"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                > 
                    {chats ? (
                        <Stack className="box-scroll">
                            {chats.map((chat) => (
                                <Box
                                    onClick={() => {
                                        setSelectedChat(chat)
                                        setNotification(notification.filter((n) => n.chat._id !== chat._id));
                                    }}
                                    cursor="pointer"
                                    bg={selectedChat === chat ?  "#38B2AC" : notification.filter(notif => notif.chat._id === chat._id).length !==0
                                        ? '#7A8593'  : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={chat._id}
                                > 
                                <div style={{ display: "flex" }}>
                                    
                                     <Avatar           
                                        mt={1}                     
                                        mr={3}
                                        size="sm"                                                                 
                                        name={!chat.isGroupChat
                                            ? getSender(auth.user, chat.users)
                                            : chat.chatName}   
                                        src={!chat.isGroupChat
                                                ? getSenderPic(auth.user, chat.users)
                                                : ''}                                         
                                    />
                                    <Text>
                                        {!chat.isGroupChat
                                            ? getSender(auth.user, chat.users)
                                            : chat.chatName}
                                    </Text>
                                    </div>
                                    {chat.latestMessage && (
                                        <Text fontSize="xs" style={{marginLeft: 38, marginTop:'-10px'}}>
                                            <b>
                                                { chat.latestMessage.sender._id == auth.user.id ? ' Me : ' :
                                                chat.latestMessage.sender.fullname + " : " } 
                                            </b>
                                            {chat.latestMessage.content.length > 39
                                                ? chat.latestMessage.content.substring(0, 39) + "..."
                                                : chat.latestMessage.content}
                                        </Text>
                                    )}


                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <ChatLoading />
                    )}



                </Box>

            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent style={{ backgroundColor: darkMode ? 'rgb(31, 30, 30)': 'rgb(225, 228, 232)' }}>
                    <DrawerHeader style={{ color: darkMode ? 'white': 'black' }} borderBottomWidth='1px'>{t('Search Collaborators')}</DrawerHeader>
                    <DrawerBody>
                        <Box d="flex" pb={2}>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'  
                                    color= {darkMode ? 'gray.300' :'gray.500'}            
                                    children={<SearchIcon/>}
                                />
                                <Input
                                    variant='outline'
                                    color= {darkMode ? 'gray.300' :'gray.800'}   
                                    placeholder="Search by name or email"
                                    _placeholder={{ opacity: 1, color: 'gray.500' }}
                                    mr={2}
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </InputGroup>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <div style={{ textAlign: 'center', marginTop: '10px' }}>Loading...</div>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </ChakraProvider>

    );
};

export default MyChats;