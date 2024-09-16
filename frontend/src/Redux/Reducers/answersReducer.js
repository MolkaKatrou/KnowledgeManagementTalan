import {GET_ANSWERS,  DELETE_ANSWER, VOTE_UP_ANSWER, VOTE_DOWN_ANSWER } from "../types";

const initialState = {
  answers: [],
  loading: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ANSWERS:
      return {
        ...state,
        answers: action.payload.data,
        loading: false,
      };

    case DELETE_ANSWER:
      return { 
        ...state, 
        answers: state.answers.filter((answer) => answer._id !== action.payload) 
      };

      case VOTE_UP_ANSWER:
        return {
          ...state,
          answers: state.answers.map((answer) => {
          if (answer._id == +action.payload._id) {
            return action.payload;
          }
          return answer;
        }),
      };

      case VOTE_DOWN_ANSWER:
        return {
          ...state,
          answers: state.answers.map((answer) => {
          if (answer._id == +action.payload._id) {
            return action.payload;
          }
          return answer;
        }),
      };


    default:
      return state;

  }
}