import { GET_POSTS, GET_POST,DELETE_POST, FETCH_BY_SEARCH, LIKE, BOOKMARK, UPDATE_POST, DELETE_COMMENT, CREATE_COMMENT } from "../types";

const initialState = {
  posts: [],
  loading: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload.data,
        loading: false,
      };

    case UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map((post) => {
        if (post._id == +action.payload._id) {
          return action.payload;
        }
        return post;
      }),
    };

    case GET_POST:
      return {
        ...state,
        post: action.payload.post,
        loading: false
      };

    case FETCH_BY_SEARCH:
      return {
        ...state,
        posts: action.payload.data,
        loading: false
      };

    case LIKE:
      return {
        ...state,
        posts: state.posts.map((post) => {
        if (post._id == +action.payload._id) {
          return action.payload;
        }
        return post;
      }),
    };

    case BOOKMARK:
      return {
        ...state,
        posts: state.posts.map((post) => {
        if (post._id == +action.payload._id) {
          return action.payload;
        }
        return post;
      }),
    };
    case DELETE_POST:
      return { 
        ...state, 
        posts: state.posts.filter((post) => post._id !== action.payload) 
      };

    default:
      return state;

  }
}