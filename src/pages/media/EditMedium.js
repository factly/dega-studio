import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Row, Col, Skeleton, Form, Input, Button, Space, Popconfirm } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getMedium, updateMedium, deleteMedium } from '../../actions/media';
import RecordNotFound from '../../components/ErrorsAndImage/RecordNotFound';
import { ArrowLeftOutlined } from '@ant-design/icons';
import getUserPermission from '../../utils/getUserPermission';
import { useHistory } from 'react-router-dom';

function EditMedium() {
  const [form] = Form.useForm();
  const [valueChange, setValueChange] = React.useState(false);

  const { id } = useParams();
  const history = useHistory();
  const spaces = useSelector(({ spaces }) => spaces);
  const actions = getUserPermission({ resource: 'media', action: 'get', spaces });
  const disabled = !(actions.includes('admin') || actions.includes('update'));
  const dispatch = useDispatch();
  const { media, loading } = useSelector((state) => {
    return {
      media: state.media.details[id] ? state.media.details[id] : null,
      loading: state.media.loading,
    };
  });

  React.useEffect(() => {
    dispatch(getMedium(id));
  }, [dispatch, id]);

  const updateMedia = (values) => {
    const data = {
      ...media,
      ...values,
    };
    dispatch(updateMedium(data));
  };

  if (loading) return <Skeleton />;

  if (!media) {
    return <RecordNotFound />;
  }

  return (
    <Row gutter={['20', '20']}>
      <Col span={'24'}>
        <Link to="/media">
          <Button>
            <ArrowLeftOutlined /> Back
          </Button>
        </Link>
      </Col>
      <Col span={'12'}>
        <img
          src={media.url?.proxy}
          alt={'space'}
          style={{ maxHeight: '500px', maxWidth: '100%', margin: '0 auto', display: 'block' }}
        />
      </Col>
      <Col span={'12'}>
        <Form
          layout="vertical"
          form={form}
          name="create-space"
          onFinish={(values) => {
            updateMedia(values);
          }}
          onValuesChange={() => {
            setValueChange(true);
          }}
          initialValues={media}
        >
          <Form.Item name="name" label="Name">
            <Input disabled={disabled} />
          </Form.Item>
          <Form.Item name="alt_text" label="Alt Text">
            <Input disabled={disabled} />
          </Form.Item>
          <Form.Item name="caption" label="Caption">
            <Input disabled={disabled} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} disabled={disabled} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Popconfirm
                title="Sure to Delete?"
                onConfirm={() => {
                  dispatch(deleteMedium(id)).then(() => history.push('/media'));
                }}
              >
                <Button type="primary" danger disabled={disabled}>
                  Delete
                </Button>
              </Popconfirm>
              <Button type="primary" htmlType="submit" disabled={disabled || !valueChange}>
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

export default EditMedium;
