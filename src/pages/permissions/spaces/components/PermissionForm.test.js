import React from 'react';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import '../../../../matchMedia.mock';
import PermissionForm from './PermissionForm';
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const data = {
  id: 8,
  fact_check: true,
  space_id: 8,
  media: 10,
  posts: 10,
  podcast: false,
  episodes: 0,
};

let onCreate, store;

describe('Space Permission Form component', () => {
  store = mockStore({
    spacePermissions: {
      req: [],
      details: {},
      loading: true,
    },
  });
  useDispatch.mockReturnValue(jest.fn());
  useSelector.mockImplementation((state) => ({ details: [], total: 0, loading: false }));

  describe('snapshot testing', () => {
    beforeEach(() => {
      onCreate = jest.fn();
      onCreate.mockImplementationOnce(
        (values) => new Promise((resolve, reject) => resolve(values)),
      );
    });
    it('should render the component', () => {
      const tree = mount(
        <Provider store={store}>
          <PermissionForm data={[]} />
        </Provider>,
      );
      expect(tree).toMatchSnapshot();
    });
    it('should match component with empty data', () => {
      const tree = mount(
        <Provider store={store}>
          <PermissionForm data={[]} />
        </Provider>,
      );
      expect(tree).toMatchSnapshot();
    });
    it('should match component with data', () => {
      const tree = mount(
        <Provider store={store}>
          <PermissionForm onCreate={onCreate} data={data} />
        </Provider>,
      );
      expect(tree).toMatchSnapshot();
    });
  });
  describe('component testing', () => {
    let wrapper, props;
    beforeEach(() => {
      props = {
        onCreate: jest.fn(),
        data: data,
      };
      act(() => {
        wrapper = mount(
          <Provider store={store}>
            <PermissionForm {...props} />
          </Provider>,
        );
      });
    });
    afterEach(() => {
      wrapper.unmount();
    });
    it('should not submit form with empty data', (done) => {
      act(() => {
        wrapper = mount(
          <Provider store={store}>
            <PermissionForm onCreate={props.onCreate} />
          </Provider>,
        );
      });

      act(() => {
        const submitButtom = wrapper.find('Button').at(0);
        expect(submitButtom.text()).toBe('Submit');
        submitButtom.simulate('submit');
        wrapper.update();
      });

      setTimeout(() => {
        expect(props.onCreate).not.toHaveBeenCalled();
        done();
      }, 0);
    });
    it('should submit form with given data', (done) => {
      act(() => {
        const submitButtom = wrapper.find('Button').at(0);
        expect(submitButtom.text()).toBe('Submit');
        submitButtom.simulate('submit');
        wrapper.update();
      });

      setTimeout(() => {
        expect(props.onCreate).toHaveBeenCalledTimes(1);
        expect(props.onCreate).toHaveBeenCalledWith({
          fact_check: true,
          space_id: 8,
          media: 10,
          posts: 10,
          podcast: false,
        });
        done();
      }, 0);
    });
    it('should submit form with updated data', (done) => {
      act(() => {
        const input = wrapper.find('FormItem').at(1).find('InputNumber');
        input.props().onChange({ target: { value: 5 } });

        const submitButtom = wrapper.find('Button').at(0);
        expect(submitButtom.text()).toBe('Submit');
        submitButtom.simulate('submit');
      });

      setTimeout(() => {
        expect(props.onCreate).toHaveBeenCalledTimes(1);
        expect(props.onCreate).toHaveBeenCalledWith({
          fact_check: true,
          space_id: 8,
          media: 10,
          posts: 5,
          podcast: false,
        });
        done();
      }, 0);
    });
  });
});
