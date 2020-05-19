import {
  GET_SPACES_SUCCESS,
  GET_SPACES_FAILURE,
  ADD_SPACE_FAILURE,
  ADD_SPACE_SUCCESS,
  LOADING_SPACES,
} from './types';
import axios from 'axios';

export const getSpaces = () => {
  return async (dispatch, getState) => {
    dispatch(loadingSpaces());
    const response = await axios({
      url: 'https://randomuser.me/api',
      method: 'get',
    }).catch((error) => {
      dispatch(getSpacesFailure(error.message));
    });
    if (response) {
      console.log(response);
      dispatch(getSpacesSuccess(response.data.results));
    }
  };
};

const loadingSpaces = () => ({
  type: LOADING_SPACES,
});

const getSpacesSuccess = (spaces) => ({
  type: GET_SPACES_SUCCESS,
  payload: spaces,
});

const getSpacesFailure = (error) => ({
  type: GET_SPACES_FAILURE,
  payload: {
    error,
  },
});

export const addSpaces = (data) => {
  return async (dispatch, getState) => {
    dispatch(loadingSpaces());
    const response = await axios({
      url: 'https://randomuser.me/api',
      method: 'get',
    }).catch((error) => {
      dispatch(addSpacesFailure(error.message));
    });
    if (response) {
      console.log(response);
      dispatch(addSpacesSuccess(data));
    }
  };
};

const addSpacesSuccess = (space) => ({
  type: ADD_SPACE_SUCCESS,
  payload: {
    ...space,
  },
});

const addSpacesFailure = (error) => ({
  type: ADD_SPACE_FAILURE,
  payload: {
    error,
  },
});
