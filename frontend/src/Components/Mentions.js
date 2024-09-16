import React, { useEffect } from 'react'
import { useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions'
import { useSelector } from 'react-redux'

import { getAllUsers } from "../Redux/Actions/authActions";


export default function Mentions() {
    const [value, setValue] = useState("")
    const { users } = useSelector(state => state.users)
    const dispatch = useDisptach()
    useEffect(() => {
        dispatch(getAllUsers())
    }, [])

    return (
        <div>
            <MentionsInput value={value} onChange={e=> setValue(e.target.value)}>
                <Mention data ={users}/>
            </MentionsInput>
        </div>

    )
}
