import 'antd/dist/antd.css'
import { Layout, Menu, Select, Input, Icon} from 'antd'
import React from 'react'
import './AppLayout.less'
 import DataForm from './DataForm/DataForm'

const { Header, Content, Footer, Sider } = Layout

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
            <Layout className="allLayout">
              <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                  <Menu.Item key="1">
                    <Icon type="upload" />
                    <span>Ввод параметров для диагностики</span>
                  </Menu.Item>
                </Menu>
              </Sider>
              <Layout className="bodyLayout">
                <Header className="header">
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
                </Header>
                <Content className="content">
                  <DataForm />
                </Content>
                <Footer className="footer">Приложение распространияется под лицензией MIT</Footer>
              </Layout>
            </Layout>
        )
      }
}

export default AppLayout  