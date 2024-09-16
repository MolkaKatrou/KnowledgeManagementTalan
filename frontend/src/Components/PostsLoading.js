import { Stack } from "@chakra-ui/layout";
import { SkeletonCircle, SkeletonText } from "@chakra-ui/react";


const PostsLoading = () => {
    return (
        <Stack>
            <div style={{marginLeft: 60,marginRight: 60, marginBottom:'40px'}}>
                <SkeletonCircle size='10' />
                <SkeletonText p mt='4' noOfLines={4} spacing='4' />
            </div>
            <div style={{marginLeft: 60,marginRight: 60, marginBottom:'40px'}} >
                <SkeletonCircle size='10' />
                <SkeletonText mt='4' noOfLines={4} spacing='4' />
            </div>
            <div style={{marginLeft: 60,marginRight: 60, marginBottom:'40px'}}>
                <SkeletonCircle size='10' />
                <SkeletonText mt='4' noOfLines={4} spacing='4' />
            </div>
            <div style={{marginLeft: 60,marginRight: 60, marginBottom:'40px'}}>
                <SkeletonCircle size='10' />
                <SkeletonText mt='4' noOfLines={4} spacing='4' />
            </div>
        </Stack>
    );
};

export default PostsLoading;