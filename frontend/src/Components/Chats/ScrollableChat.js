import { Avatar, Tooltip } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import ScrollableFeed from "react-scrollable-feed";
import { isFirstMessage, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './ChatLogic';
import Linkify from 'react-linkify';


export default function ScrollableChat({ messages, user }) {
    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {(isSameSender(messages, m, i, user.id) ||
                            isLastMessage(messages, i, user.id)) && (
                                <Tooltip label={m.sender?.fullname} placement="bottom-start" hasArrow>
                                    <Avatar
                                        mt="11px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender?.fullname}
                                        src={m.sender?.pic}

                                    />
                                </Tooltip>
                            )}
                        <span
                            style={{
                                backgroundColor: `${m.sender?._id === user.id ? "#2979FF" : "#F3F3F3"}`,
                                color: `${m.sender?._id === user.id ? "white" : "#353535"}`,
                                marginLeft: isSameSenderMargin(messages, m, i, user.id),
                                marginTop: isSameUser(messages, m, i, user.id) ? 3 : 10,
                                borderRadius: "13px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                                display: 'flex',
                                alignItems: 'center',
                                fontFamily: 'Helvetica',
                                letterSpacing: '0.3px'
                            }}
                        >
                            <Linkify properties={{ target: '_blank' }}>
                                {m.content}
                            </Linkify>

                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    )
}
