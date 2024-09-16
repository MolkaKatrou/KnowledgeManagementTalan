import React from 'react'
import { Avatar, Box, Button, ButtonGroup, ChakraProvider, Editable, EditableInput, EditablePreview, Flex, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useEditableControls } from '@chakra-ui/react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    box: {
        backgroundColor: '#AFAFAF',
        '&:hover': {
          backgroundColor: '#7378A5',
        },
    },
    loadingPaper: {
      display: 'flex',
      justifyContent: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '250px'
    },
  }));

export default function CategoriesModal({ categoryModal, title, categories }) {
    const classes=useStyles()
    return (
        <div>
            <ChakraProvider>
                <Modal
                    onClose={categoryModal.onClose}
                    isOpen={categoryModal.isOpen}
                    scrollBehavior='inside'
                >
                    <ModalOverlay />
                    <ModalContent style={{backgroundColor:'#E9EAED'}}>
                        <ModalHeader style={{fontWeight:'600', color:'#500C0C'}}>{title}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        {categories.map((category) => (
                                <Box
                                    className={classes.box}
                                    cursor="pointer"
                                    color="black"
                                    px={3}
                                    py={2}
                                    mt={2}
                                    borderRadius="lg"
                                    key={category._id}
                                > 
                                {category.name}
                                </Box>
                        ))}

                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={categoryModal.onClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </ChakraProvider>
        </div>
    )
}
