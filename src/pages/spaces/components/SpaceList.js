import React from 'react';
import { Popconfirm, Form, Space, Button } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpaces } from '../../../actions/spaces';
import { Link } from 'react-router-dom';
import Table from '../../../components/Table';
import _ from 'lodash';

function SpaceList() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { spaces = {}, loading } = useSelector((state) => {
    return {
      loading: state.spaces.loading,
      spaces: _.flatten(_.map(state.spaces.spaces, 'spaces')),
    };
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '25%',
      sorter: true,
    },
    {
      title: 'Site Address',
      dataIndex: 'site_address',
      width: '15%',
    },
    {
      title: 'Title',
      dataIndex: 'site_title',
      width: '40%',
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <span>
            <Link
              className="ant-dropdown-link"
              style={{
                marginRight: 8,
              }}
              to={`/spaces/edit?id=${record.id}`}
            >
              Edit
            </Link>
            <Popconfirm title="Sure to cancel?">
              <Button className="ant-dropdown-link">Delete</Button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });

  useEffect(() => {
    dispatch(getSpaces());
  }, [dispatch]);

  return (
    <Form form={form} component={false}>
      <Space direction="vertical">
        <Link className="ant-btn ant-btn-primary" key="1" to="/spaces/create">
          Create New
        </Link>
        <Table columns={mergedColumns} data={spaces} loading={loading} />
      </Space>
    </Form>
  );
}

export default SpaceList;
