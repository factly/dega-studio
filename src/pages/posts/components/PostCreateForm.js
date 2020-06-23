import React from 'react';
import { Row, Col, Form, Input, Button, Space } from 'antd';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import Selector from '../../../components/Selector';
import { maker, checker } from '../../../utils/sluger';
import MediaSelector from '../../../components/MediaSelector';

function CreatePost({ onCreate, data = {} }) {
  const [form] = Form.useForm();

  const editor = new EditorJS({
    /**
     * Id of Element that should contain the Editor
     */

    holder: 'editorjs',

    /**
     * Available Tools list.
     * Pass Tool's class or Settings object for each Tool you want to use
     */

    tools: {
      header: Header,
      list: List,
      paragraph: Paragraph,
      quote: Quote,
      table: Table,
    },
    data: data.description,
  });

  const onSave = (values) => {
    editor
      .save()
      .then((outputData) => {
        onCreate({
          ...values,
          description: outputData,
        });
      })
      .catch((error) => {
        console.log('Saving failed: ', error);
      });
  };

  const onTitleChange = (string) => {
    form.setFieldsValue({
      slug: maker(string),
    });
  };

  const [mediaSelector, setMediaSelector] = React.useState(null);

  const setMediumValues = (value) => {
    form.setFieldsValue({
      feat: value,
    });
  };

  return (
    <Form
      form={form}
      initialValues={{ ...data }}
      style={{ maxWidth: '100%', width: '100%' }}
      onFinish={(values) => onSave(values)}
      layout="vertical"
    >
      <Row gutter={16}>
        <Col span={18}>
          <Form.Item name="title" label="Title">
            <Input placeholder="title" onChange={(e) => onTitleChange(e.target.value)} />
          </Form.Item>
          <Form.Item name="excerpt" label="Excerpt">
            <Input.TextArea rows={4} placeholder="excerpt" />
          </Form.Item>
          <Form.Item label="Description">
            <div id="editorjs" style={{ border: '1px solid black' }}></div>
          </Form.Item>
        </Col>
        <Col span={6}>
          <MediaSelector
            show={mediaSelector !== null}
            handleCancel={() => setMediaSelector(null)}
            handleSelect={(value) => {
              setMediumValues(value);
              setMediaSelector(null);
            }}
          />
          <Form.Item name="feat" label="Image">
            <Space direction="vertical">
              {form.getFieldValue('feat') ? (
                <img src={form.getFieldValue('feat').url} width="100%" />
              ) : null}
              <Button onClick={() => setMediaSelector('feat')}>Select</Button>
            </Space>
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[
              {
                required: true,
                message: 'Please input the slug!',
              },
              {
                pattern: checker,
                message: 'Slug can not have whitespaces!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="categories" label="Categories">
            <Selector
              mode="multiple"
              action="Categories"
              defaultIds={data.categories}
              onBlur={(values) => form.setFieldsValue({ category: values })}
            />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Selector
              mode="multiple"
              action="Tags"
              defaultIds={data.tags.map((item) => item.id)}
              onBlur={(values) => form.setFieldsValue({ tag: values })}
            />
          </Form.Item>
          <Form.Item name="format" label="Formats">
            <Selector
              defaultIds={data.format}
              action="Formats"
              onBlur={(values) => form.setFieldsValue({ format: values })}
            />
          </Form.Item>
          <Form.Item name="authors" label="Authors">
            <Selector
              mode="multiple"
              display={'email'}
              action="Authors"
              onBlur={(values) => form.setFieldsValue({ authors: values })}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default CreatePost;