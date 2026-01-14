/**
 * Ant Design TodoList 应用主组件
 * 
 * 本组件展示了Ant Design的核心知识点：
 * 1. 组件导入和使用
 * 2. State状态管理 (useState)
 * 3. 表单组件 (Form, Input, Button)
 * 4. 列表展示 (List)
 * 5. 标签和徽章 (Tag, Badge)
 * 6. 布局组件 (Layout, Card)
 * 7. 图标使用 (Icon)
 * 8. 交互反馈 (Message, Modal)
 * 9. 响应式设计
 * 10. 数据操作（增删改查）
 */

import React, { useState } from 'react'
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  List,
  Tag,
  Badge,
  message,
  Modal,
  Space,
  Typography,
  Empty,
  Tooltip
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'

// 解构常用组件
const { Header, Content } = Layout
const { Title } = Typography
const { confirm } = Modal

const App = () => {
  // ========== 1. State状态管理 ==========
  // useState是React的核心Hook，用于在函数组件中管理状态
  const [todos, setTodos] = useState([]) // Todo列表数据
  const [form] = Form.useForm() // Ant Design的Form Hook，用于表单控制
  const [editingId, setEditingId] = useState(null) // 当前编辑的Todo ID
  const [isEditing, setIsEditing] = useState(false) // 是否处于编辑状态

  // ========== 2. 表单提交处理 ==========
  const onFinish = (values) => {
    if (isEditing && editingId) {
      // 编辑模式：更新现有Todo
      handleUpdate(editingId, values.title)
    } else {
      // 添加模式：创建新Todo
      handleAdd(values.title)
    }
  }

  // ========== 3. 添加Todo ==========
  const handleAdd = (title) => {
    const newTodo = {
      id: Date.now(), // 使用时间戳作为唯一ID
      title: title,
      completed: false,
      createdAt: new Date().toLocaleString('zh-CN')
    }
    
    setTodos([...todos, newTodo])
    form.resetFields() // 重置表单
    message.success('Todo添加成功！') // 成功提示
  }

  // ========== 4. 删除Todo ==========
  const handleDelete = (id) => {
    // 使用Ant Design的确认对话框
    confirm({
      title: '确认删除',
      content: '确定要删除这个Todo吗？此操作不可撤销。',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        setTodos(todos.filter(todo => todo.id !== id))
        message.success('Todo已删除')
      },
      onCancel() {
        console.log('取消删除')
      }
    })
  }

  // ========== 5. 切换完成状态 ==========
  const handleToggle = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
    
    const todo = todos.find(t => t.id === id)
    message.success(`Todo已标记为${!todo.completed ? '完成' : '未完成'}`)
  }

  // ========== 6. 开始编辑 ==========
  const handleStartEdit = (todo) => {
    setEditingId(todo.id)
    setIsEditing(true)
    form.setFieldsValue({ title: todo.title }) // 设置表单初始值
  }

  // ========== 7. 更新Todo ==========
  const handleUpdate = (id, newTitle) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, title: newTitle } : todo
    ))
    setEditingId(null)
    setIsEditing(false)
    form.resetFields()
    message.success('Todo更新成功！')
  }

  // ========== 8. 取消编辑 ==========
  const handleCancelEdit = () => {
    setEditingId(null)
    setIsEditing(false)
    form.resetFields()
  }

  // ========== 9. 清空所有已完成的Todo ==========
  const handleClearCompleted = () => {
    const completedCount = todos.filter(t => t.completed).length
    if (completedCount === 0) {
      message.info('没有已完成的Todo')
      return
    }

    confirm({
      title: '清空已完成',
      content: `确定要清空所有已完成的Todo吗？共${completedCount}个。`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        setTodos(todos.filter(todo => !todo.completed))
        message.success('已清空所有已完成的Todo')
      }
    })
  }

  // ========== 10. 统计信息 ==========
  const total = todos.length
  const completed = todos.filter(t => t.completed).length
  const pending = total - completed

  // ========== 11. 列表项渲染函数 ==========
  const renderTodoItem = (item, index) => {
    return (
      <List.Item
        actions={[
          <Tooltip title={item.completed ? '标记为未完成' : '标记为完成'}>
            <Button
              type={item.completed ? 'primary' : 'default'}
              icon={<CheckCircleOutlined />}
              size="small"
              onClick={() => handleToggle(item.id)}
            />
          </Tooltip>,
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleStartEdit(item)}
            />
          </Tooltip>,
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(item.id)}
            />
          </Tooltip>
        ]}
        style={{
          backgroundColor: item.completed ? '#f6f6f6' : 'white',
          opacity: item.completed ? 0.6 : 1
        }}
      >
        <List.Item.Meta
          title={
            <span style={{
              textDecoration: item.completed ? 'line-through' : 'none',
              color: item.completed ? '#888' : '#333'
            }}>
              {item.title}
            </span>
          }
          description={
            <Space size="middle">
              <Tag 
                color={item.completed ? 'success' : 'processing'}
                icon={item.completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
              >
                {item.completed ? '已完成' : '待完成'}
              </Tag>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {item.createdAt}
              </span>
            </Space>
          }
        />
      </List.Item>
    )
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* ========== 12. 页面头部 ========== */}
      <Header style={{ 
        backgroundColor: '#001529', 
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Title level={4} style={{ color: 'white', margin: 0 }}>
          📝 Ant Design TodoList
        </Title>
        <Space>
          <Badge count={pending} color="blue">
            <Button size="small" type="text" style={{ color: 'white' }}>
              待办
            </Button>
          </Badge>
          <Badge count={completed} color="green">
            <Button size="small" type="text" style={{ color: 'white' }}>
              已完成
            </Button>
          </Badge>
        </Space>
      </Header>

      {/* ========== 13. 页面内容区 ========== */}
      <Content style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          
          {/* ========== 14. 添加/编辑表单 ========== */}
          <Card 
            title={isEditing ? '编辑Todo' : '添加新Todo'}
            extra={
              isEditing && (
                <Button size="small" onClick={handleCancelEdit}>
                  取消编辑
                </Button>
              )
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                name="title"
                rules={[
                  { required: true, message: '请输入Todo内容' },
                  { min: 2, message: '内容至少2个字符' },
                  { max: 100, message: '内容不能超过100个字符' }
                ]}
              >
                <Input
                  placeholder="输入Todo内容，按回车提交"
                  size="large"
                  prefix={<PlusOutlined style={{ color: '#1890ff' }} />}
                  allowClear
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={isEditing ? <EditOutlined /> : <PlusOutlined />}
                  >
                    {isEditing ? '更新Todo' : '添加Todo'}
                  </Button>
                  {total > 0 && (
                    <Button 
                      danger
                      onClick={handleClearCompleted}
                    >
                      清空已完成
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Form>
          </Card>

          {/* ========== 15. Todo列表展示 ========== */}
          <Card 
            title={
              <Space>
                <span>我的Todo列表</span>
                <Tag color="blue">{total} 个</Tag>
                {completed > 0 && <Tag color="green">完成 {completed} 个</Tag>}
                {pending > 0 && <Tag color="orange">待办 {pending} 个</Tag>}
              </Space>
            }
          >
            <List
              dataSource={todos}
              renderItem={renderTodoItem}
              locale={{
                emptyText: (
                  <Empty 
                    description="暂无Todo，快去添加一个吧！"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )
              }}
              pagination={
                total > 5 ? {
                  pageSize: 5,
                  size: 'small',
                  showTotal: (total, range) => 
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                } : false
              }
            />
          </Card>

          {/* ========== 16. 使用说明 ========== */}
          <Card size="small" style={{ backgroundColor: '#fafafa' }}>
            <Space direction="vertical" size="small">
              <strong>💡 Ant Design 核心知识点：</strong>
              <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li><strong>组件化：</strong>使用Layout、Card、Form、Input、Button、List等组件</li>
                  <li><strong>状态管理：</strong>useState Hook管理Todo数据和UI状态</li>
                  <li><strong>表单处理：</strong>Form.useForm()控制表单，rules进行验证</li>
                  <li><strong>交互反馈：</strong>message提示、Modal确认对话框</li>
                  <li><strong>数据展示：</strong>List组件配合renderItem渲染列表</li>
                  <li><strong>视觉反馈：</strong>Tag标签、Badge徽章、Icon图标</li>
                  <li><strong>响应式：</strong>Space布局组件，自动适配间距</li>
                  <li><strong>无障碍：</strong>Tooltip提供额外信息，按钮有明确语义</li>
                </ul>
              </div>
            </Space>
          </Card>
        </Space>
      </Content>
    </Layout>
  )
}

export default App