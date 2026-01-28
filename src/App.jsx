import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Space,
  message,
  Row,
  Col,
  Typography,
  Popconfirm
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined
} from '@ant-design/icons';

import './index.less'

const { Title } = Typography;

const EmailMaintenanceSystem = () => {
  // 表单实例
  const [form] = Form.useForm();
  
  // 状态管理
  const [emails, setEmails] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // 初始化一些示例数据
  useEffect(() => {
    const initialData = [
      {
        key: '1',
        email: 'john.doe@company.com',
        name: 'John Doe',
        user: '约翰·多伊',
      },
      {
        key: '2',
        email: 'jane.smith@company.com',
        name: 'Jane Smith',
        user: '简·史密斯',
      },
      {
        key: '3',
        email: 'robert.johnson@company.com',
        name: 'Robert Johnson',
        user: '罗伯特·约翰逊',
      },
    ];
    setEmails(initialData);
  }, []);

  // 表单提交处理（新增/更新）
  const onFinish = (values) => {
    setLoading(true);
    
    // 模拟API调用延迟
    setTimeout(() => {
      if (isEditing && editingKey) {
        // 更新现有记录
        const updatedEmails = emails.map(item => 
          item.key === editingKey ? { ...values, key: editingKey } : item
        );
        setEmails(updatedEmails);
        message.success('邮箱信息更新成功');
      } else {
        // 新增记录
        const newKey = Date.now().toString();
        const newEmail = {
          key: newKey,
          ...values,
        };
        setEmails([...emails, newEmail]);
        message.success('邮箱信息添加成功');
      }
      
      // 重置表单和状态
      form.resetFields();
      setIsEditing(false);
      setEditingKey(null);
      setLoading(false);
    }, 300);
  };

  // 编辑邮箱信息
  const handleEdit = (record) => {
    form.setFieldsValue({
      email: record.email,
      name: record.name,
      user: record.user,
    });
    setIsEditing(true);
    setEditingKey(record.key);
  };

  // 删除邮箱信息
  const handleDelete = (key) => {
    const newEmails = emails.filter(item => item.key !== key);
    setEmails(newEmails);
    message.success('邮箱信息删除成功');
    
    // 如果正在编辑被删除的项，重置表单
    if (editingKey === key) {
      form.resetFields();
      setIsEditing(false);
      setEditingKey(null);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
    setEditingKey(null);
  };

  // 表格列定义
  const columns = [
    {
      title: '邮箱地址',
      dataIndex: 'email',
      key: 'email',
      width: '30%',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: '使用人名称',
      dataIndex: 'user',
      key: 'user',
      width: '25%',
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: '#1890ff' }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条邮箱记录吗？"
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className='mainContentWrap'>
      <div className='comTitle'>
        网联发票邮箱维护
      </div>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col span={24}>
          <Card title="邮箱信息管理">
            <Form
              form={form}
              layout="inline"
              onFinish={onFinish}
              style={{ marginBottom: '20px' }}
            >
              <Form.Item
                name="email"
                label="邮箱地址"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入邮箱地址" style={{ width: '200px' }} />
              </Form.Item>
              
              <Form.Item
                name="name"
                label="名称"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input placeholder="请输入名称" style={{ width: '150px' }} />
              </Form.Item>
              
              <Form.Item
                name="user"
                label="使用人"
                rules={[{ required: true, message: '请输入使用人' }]}
              >
                <Input placeholder="请输入使用人" style={{ width: '150px' }} />
              </Form.Item>
              
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={isEditing ? <SaveOutlined /> : <PlusOutlined />}
                    loading={loading}
                  >
                    {isEditing ? '更新' : '添加'}
                  </Button>
                  
                  {isEditing && (
                    <Button
                      icon={<CloseOutlined />}
                      onClick={handleCancel}
                    >
                      取消
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Form>
            
            <Table
              columns={columns}
              dataSource={emails}
              rowKey="key"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
              loading={loading}
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmailMaintenanceSystem;