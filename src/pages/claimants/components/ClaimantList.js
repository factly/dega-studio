import React from 'react';
import { Popconfirm, Button, Typography, Table } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { getClaimants, deleteClaimant } from '../../../actions/claimants';
import { Link } from 'react-router-dom';
import { entitySelector } from '../../../selectors';

function ClaimantList() {
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);

  const { claimants, total, loading } = useSelector((state) =>
    entitySelector(state, page, 'claimants'),
  );

  React.useEffect(() => {
    fetchClaimants();
  }, [page]);

  const fetchClaimants = () => {
    dispatch(getClaimants({ page: page }));
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    {
      title: 'Tag Line',
      dataIndex: 'tag_line',
      key: 'tag_line',
      width: '20%',
      render: (_, record) => {
        return (
          <Typography.Paragraph ellipsis={{ rows: 2 }}>{record.tag_line}</Typography.Paragraph>
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      render: (_, record) => {
        return (
          <Typography.Paragraph ellipsis={{ rows: 2 }}>{record.description}</Typography.Paragraph>
        );
      },
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
              to={`/claimants/${record.id}/edit`}
            >
              <Button>Edit</Button>
            </Link>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={() => dispatch(deleteClaimant(record.id)).then(() => fetchClaimants())}
            >
              <Link to="" className="ant-dropdown-link">
                <Button>Delete</Button>
              </Link>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <Table
      bordered
      columns={columns}
      dataSource={claimants}
      loading={loading}
      rowKey={'id'}
      pagination={{
        total: total,
        current: page,
        pageSize: 5,
        onChange: (pageNumber, pageSize) => setPage(pageNumber),
      }}
    />
  );
}

export default ClaimantList;