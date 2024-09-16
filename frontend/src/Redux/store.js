import React from 'react'
import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import Middleware from 'redux-thunk'
import Reducers from './Reducers'

const initialState={}
const store = createStore(
    Reducers,
    initialState,
    composeWithDevTools(applyMiddleware(Middleware))
)

export default store;