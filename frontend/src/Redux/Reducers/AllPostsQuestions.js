import { GET_All } from "../types";

const initialState = {
  postsQuestions: [],
  loading: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_All:
      return {
        ...state,
        postsQuestions: action.payload.data,
        loading: false,
      };

    default:
      return state;

  }
}