  import 'antd/dist/antd.css'
  import { Layout, Menu, InputNumber, Radio, Select, Input} from 'antd'
  import React from 'react'
  import './AppLayout.css'
  import {train_model} from './model/train_data.js'
  
  const { Header, Content, Footer } = Layout
  const InputGroup = Input.Group
  const { Option } = Select
  
  function AppLayout(props: any) {
      train_model()
      return (
        <Layout className="layout">
          <Header>
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">Ввод параметров для диагностики</Menu.Item>
            </Menu>
          </Header>
          <Content className="content">
              <InputNumber className="numberInput Input" placeholder="Возраст" min={18} max={120}/>
              <InputNumber className="numberInput Input" placeholder="Рост" min={100} max={240}/>
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
          </Content>
          <Footer className="footer">Приложение распространияется под лицензией MIT</Footer>
          </Layout>
      )
  }
  
  export default AppLayout  