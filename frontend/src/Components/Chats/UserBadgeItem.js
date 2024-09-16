import CloseIcon from '@mui/icons-material/Close';
import { Badge,Box } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Box
      px={3}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      bg="#BB9EC1"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.fullname}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;