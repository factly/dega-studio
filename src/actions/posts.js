import axios from 'axios';
import {
  ADD_POST,
  ADD_POSTS,
  ADD_POSTS_REQUEST,
  SET_POSTS_LOADING,
  RESET_POSTS,
  POSTS_API,
} from '../constants/posts';
import { addErrorNotification } from './notifications';
import { addCategories } from './categories';
import { addTags } from './tags';
import { addFormats } from './formats';
import { addMediaList } from './media';

export const getPosts = (query) => {
  return (dispatch) => {
    dispatch(loadingPosts());
    return axios
      .get(POSTS_API, {
        params: query,
      })
      .then((response) => {
        dispatch(
          addTags(
            response.data.nodes
              .filter((post) => post.tags.length > 0)
              .map((post) => {
                return { ...post.tags };
              }),
          ),
        );
        dispatch(
          addCategories(
            response.data.nodes
              .filter((post) => post.categories.length > 0)
              .map((post) => {
                return { ...post.categories };
              }),
          ),
        );
        dispatch(
          addFormats(
            response.data.nodes
              .filter((post) => post.format)
              .map((post) => {
                return post.format;
              }),
          ),
        );
        dispatch(
          addMediaList(
            response.data.nodes
              .filter((post) => post.medium)
              .map((post) => {
                return post.medium;
              }),
          ),
        );
        dispatch(
          addPostsList(
            response.data.nodes.map((post) => {
              return {
                ...post,
                categories: post.categories.map((category) => category.id),
                tags: post.tags.map((tag) => tag.id),
                format: post.format.id,
              };
            }),
          ),
        );
        dispatch(
          addPostsRequest({
            data: response.data.nodes.map((item) => item.id),
            query: query,
            total: response.data.total,
          }),
        );
        dispatch(stopPostsLoading());
      })
      .catch((error) => {
        console.log(error.message);
        dispatch(addErrorNotification(error.message));
      });
  };
};

export const getPost = (id) => {
  return (dispatch) => {
    dispatch(loadingPosts());
    return axios
      .get(POSTS_API + '/' + id)
      .then((response) => {
        let post = response.data;

        dispatch(addTags(post.tags));
        dispatch(addCategories(post.categories));
        if (post.format) dispatch(addFormats([post.format]));
        if (post.medium) dispatch(addMediaList([post.medium]));

        dispatch(
          getPostByID({
            ...post,
            categories: post.categories.map((category) => category.id),
            tags: post.tags.map((tag) => tag.id),
            format: post.format?.id,
          }),
        );
        dispatch(stopPostsLoading());
      })
      .catch((error) => {
        dispatch(addErrorNotification(error.message));
      });
  };
};

export const addPost = (data) => {
  return (dispatch) => {
    dispatch(loadingPosts());
    return axios
      .post(POSTS_API, data)
      .then((response) => {
        let post = response.data;
        dispatch(addTags(post.tags));
        dispatch(addCategories(post.categories));
        if (post.format) dispatch(addFormats([post.format]));
        if (post.medium) dispatch(addMediaList([post.medium]));
        dispatch(resetPosts());
      })
      .catch((error) => {
        dispatch(addErrorNotification(error.message));
      });
  };
};

export const updatePost = (data) => {
  return (dispatch) => {
    dispatch(loadingPosts());
    return axios
      .put(POSTS_API + '/' + data.id, data)
      .then((response) => {
        let post = response.data;
        dispatch(addTags(post.tags));
        dispatch(addCategories(post.categories));
        if (post.format) dispatch(addFormats([post.format]));
        if (post.medium) dispatch(addMediaList([post.medium]));

        dispatch(
          getPostByID({
            ...post,
            categories: post.categories.map((category) => category.id),
            tags: post.tags.map((tag) => tag.id),
            format: post.format?.id,
          }),
        );
        dispatch(stopPostsLoading());
      })
      .catch((error) => {
        dispatch(addErrorNotification(error.message));
      });
  };
};

export const deletePost = (id) => {
  return (dispatch) => {
    dispatch(loadingPosts());
    return axios
      .delete(POSTS_API + '/' + id)
      .then(() => {
        dispatch(resetPosts());
      })
      .catch((error) => {
        dispatch(addErrorNotification(error.message));
      });
  };
};

const loadingPosts = () => ({
  type: SET_POSTS_LOADING,
  payload: true,
});

const stopPostsLoading = () => ({
  type: SET_POSTS_LOADING,
  payload: false,
});

const getPostByID = (data) => ({
  type: ADD_POST,
  payload: data,
});

const addPostsList = (data) => ({
  type: ADD_POSTS,
  payload: data,
});

const addPostsRequest = (data) => ({
  type: ADD_POSTS_REQUEST,
  payload: data,
});

const resetPosts = () => ({
  type: RESET_POSTS,
});
