import { GET_CATEGORIES, FOLLOW, CREATE_CATEGORY} from "../types";

const initialState = {
  categories:  [],
  loading: true
};
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        loading:false
      };

      case CREATE_CATEGORY:
        return {
          ...state,
          categories: [...state.categories, action.payload.data],
        };
  

      
    case FOLLOW:
      return {
        ...state,
        categories: state.categories.map((category) => {
        if (category._id == +action.payload._id) {
          return action.payload;
        }
        return category;
      }),
    };

    default:
      return state;
     
  }
}