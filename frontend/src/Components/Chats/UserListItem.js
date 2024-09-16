import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChakraProvider } from "@chakra-ui/react";

const UserListItem = ({ handleFunction, user }) => {
    return (
        <ChakraProvider>
            <Box
                onClick={handleFunction}
                cursor="pointer"
                bg="#E8E8E8"
                _hover={{
                    background: "#38B2AC",
                    color: "white",
                }}
                w="100%"
                d="flex"
                alignItems="center"
                color="black"
                px={3}
                py={2}
                mb={2}
                borderRadius="lg"
            >
                <Avatar
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    src={user.pic}                 
                    name={user.fullname}
                />
                <Box>
                    <Text>{user.fullname}</Text>
                    <Text fontSize="xs">
                        <b>Email : </b>
                        {user.email}
                    </Text>
                </Box>
            </Box>
        </ChakraProvider>
    );
};

export default UserListItem;