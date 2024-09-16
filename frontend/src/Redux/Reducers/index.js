import {combineReducers} from 'redux';
import authReducer from './authReducer'
import errorsReducer from './errorsReducer'
import categoriesReducer from './categoriesReducer'
import postsReducer from './postsReducer'
import questionsReducer from './questionsReducer';
import answersReducer from './answersReducer';
import usersReducer from './usersReducer';
import AllPostsQuestions from './AllPostsQuestions';


export default combineReducers({
    auth: authReducer,
    users: usersReducer,
    categories: categoriesReducer,
    posts: postsReducer,
    questions:questionsReducer,
    answers: answersReducer,
    all: AllPostsQuestions,
    errors: errorsReducer,

})