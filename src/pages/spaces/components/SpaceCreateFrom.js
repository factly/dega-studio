import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Input, Select } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const SpaceCreateForm = ({ onCreate }) => {
  const [form] = Form.useForm();
  const {
    spaces: { orgs },
  } = useSelector((state) => state);

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Form
        {...layout}
        form={form}
        name="create-space"
        onFinish={(values) => {
          onCreate(values);
          onReset();
        }}
        style={{
          paddingTop: '24px',
        }}
      >
        <Form.Item label="Name">
          <Input.Group compact>
            <Form.Item
              name="organisation_id"
              noStyle
              rules={[{ required: true, message: 'Organazation is required' }]}
            >
              <Select style={{ width: '40%' }} placeholder="Select organazation">
                {orgs.map((org) => (
                  <Option key={org.id} value={org.id}>
                    {org.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="name"
              noStyle
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input style={{ width: '60%' }} placeholder="Input name" />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            {
              required: true,
              message: 'Please input the slug of space!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="site_title" label="Title">
          <Input />
        </Form.Item>
        <Form.Item name="tag_line" label="Tag line">
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea />
        </Form.Item>
        <Form.Item name="site_address" label="Website">
          <Input />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SpaceCreateForm;