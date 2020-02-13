  import 'antd/dist/antd.css'
  import { Layout, Menu, Form, InputNumber, Radio, Select, Input, Icon} from 'antd'
  import React from 'react'
  import './AppLayout.css'
  // import {train_model} from './model/train_data.js'
  
  const { Header, Content, Footer, Sider } = Layout
  const InputGroup = Input.Group
  const { Option } = Select
  
  interface IState {
    collapsed: boolean;
  }

  class AppLayout extends React.Component {
      state: IState = {
        collapsed: false,
      }
    
      toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      }

      //train_model()
      render() {
        return (
          <Layout className="layout">
            <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
              <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                  <Icon type="upload" />
                  <span>Ввод параметров для диагностики</span>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Header className="header">
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              </Header>
              <Content className="content">
                <Form layout="inline">
                  <Form.Item className="formItem">
                    <InputNumber className="numberInput Input" placeholder="Возраст" min={18} max={120}/>
                  </Form.Item>
                  <Form.Item className="formItem">
                    <InputNumber className="numberInput Input" placeholder="Рост" min={100} max={240}/>
                  </Form.Item>
                  <InputNumber className="numberInput Input" placeholder="Вес" min={40} max={200}/>
                  <Radio.Group className="Input radioInput" defaultValue="a" buttonStyle="solid">
                      <Radio.Button value="f">Женский</Radio.Button>
                      <Radio.Button value="m">Мужской</Radio.Button>
                  </Radio.Group>
                  <InputNumber className="numberInput Input" placeholder="Систолическое давление" min={40} max={200}/>
                  <InputNumber className="numberInput Input" placeholder="Диастолическое давление" min={40} max={200}/>
                  <InputGroup className="Input">
                      <Select defaultValue="Normal">
                          <Option value="Normal">Норма</Option>
                          <Option value="AboveNormal">Ниже нормы</Option>
                          <Option value="WellAboveNormal">Выше нормы</Option>
                      </Select>
                  </InputGroup>
                </Form>
              </Content>
              <Footer className="footer">Приложение распространияется под лицензией MIT</Footer>
            </Layout>
          </Layout>
        )
      }
  }
  
  export default AppLayout  