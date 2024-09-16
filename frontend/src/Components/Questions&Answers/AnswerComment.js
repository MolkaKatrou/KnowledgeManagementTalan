import { Avatar, Box, Button, ChakraProvider, Menu, MenuButton, MenuItem, MenuList, Textarea } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { HomeContext } from '../../Context/HomeContext'
import { deleteAnswerComment } from '../../Redux/Actions/questionsActions'
import moment from 'moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import { Confirm } from 'semantic-ui-react'
import { updateComment } from '../../Redux/Actions/postsActions';
import Delete from '@mui/icons-material/Delete';


export default function AnswerComment({ c}) {
    const dispatch = useDispatch()
    const { fetch, setFetch, t } = useContext(HomeContext)
    const auth = useSelector(state => state.auth)
    const [activeComment, setActiveComment] = useState(null)
    const [newComment, setNewComment] = useState(c.comment)
    const [commentId, setCommentId] = useState('')
    const [openComment, setOpenComment ]=useState(false)
    const isEditingComment = activeComment && activeComment.type === "editingComment" && activeComment.id
    const handleDelete = (id) =>{
        setOpenComment(true)
        setCommentId(id)
    }
    const DeleteAnswerComment = () => {
        dispatch(deleteAnswerComment(commentId))
        toast.success("The comment is successfully deleted!")
        setOpenComment(false)
        setFetch(!fetch)
    }

    const handleCancel = () => {
        setActiveComment(null)
    }

    const EditAnswerComment = () => {
        dispatch(updateComment(c._id, { comment: newComment }))
        toast.success("The comment is successfully updated!")
        setFetch(!fetch)
        setActiveComment(null)
    }

    return (
        <div className="comments">
            <div className="d-flex justify-content-between author-answer">
                <div className=" my-1 d-flex flex-row ">
                    <ChakraProvider>
                        <Avatar style={{ height: 30, width: 30 }} size='sm' className='mx-2' name={c.user.fullname} src={c.user.pic} />
                    </ChakraProvider>
                    <Box className="mt-2 mx-2 author-infos" style={{ fontSize: '11px', fontWeight: '600' }}> {c.user.fullname}</Box>
                    <Box className="mt-2 mx-2 me-2" style={{ color: 'grey', fontSize: '11px' }}>{`Added ${moment(c.createdAt).fromNow()}`}</Box>

                </div>
                {
                    auth.user.email === c.user.email ? (
                        <ChakraProvider>
                            <Menu isLazy>
                                <MenuButton className='info'><MoreVertIcon /></MenuButton>
                                <MenuList className='backgroundColor'>
                                    <MenuItem icon={<DeleteIcon style={{ marginRight: '30px', color: 'gray' }} />}
                                        onClick={() => handleDelete(c._id)}>
                                        Delete
                                    </MenuItem>
                                    <MenuItem icon={<EditIcon style={{ marginRight: '30px', color: 'gray' }} />}
                                        onClick={() => setActiveComment({ id: c._id, type: 'editingComment' })}  >
                                        Edit
                                    </MenuItem>
                                </MenuList>
                            </Menu>

                        </ChakraProvider>

                    ) : ('')
                }
                <Confirm
                    open={openComment}
                    confirmButton={t("Delete Comment")}
                    cancelButton={t('Cancel')}
                    content={t('Are you sure you want to delete this comment?')}
                    onCancel={() => { setOpenComment(false) }}
                    onConfirm={DeleteAnswerComment}
                    style={{ height: '19%', overflow:'hidden' }}
                />
            </div>
            {!isEditingComment && <div className="comment">
                {c.comment}
            </div>}
            {isEditingComment && <div className="comment">
                <Textarea style={{ backgroundColor: 'transparent' }} value={newComment} onChange={(e) => setNewComment(e.target.value)}></Textarea>
                <ChakraProvider>
                    <div className="d-flex mt-2">
                        <Button size='sm' disabled={!newComment} onClick={EditAnswerComment} colorScheme='blue'>Update</Button>
                        <Button size='sm' className="mx-3" onClick={handleCancel}>Cancel</Button>
                    </div>
                </ChakraProvider>
            </div>}
        </div>
    )
}
