import 'antd/dist/antd.css'
import { Layout, Menu, Icon} from 'antd'
import React from 'react'
import './AppLayout.less'
import DataForm from './DataForm/DataForm'
import Train from './model/Train/Train.jsx'
import {HashRouter, NavLink, Route} from 'react-router-dom'

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
    render() {
        return (
          <HashRouter>
            <Layout className="allLayout">
              <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                  <Menu.Item key="1">
                    <NavLink exact to="/" activeClassName="selected">
                    // @ts-ignore
                      <Icon type="upload" />
                      <span>Ввод параметров для диагностики</span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="1">
                    <NavLink exact to="/train" activeClassName="selected">
                    // @ts-ignore
                      <Icon type="upload" />
                      <span>Обучение моделей</span>
                    </NavLink>
                  </Menu.Item>
                </Menu>
              </Sider>
              <Layout className="bodyLayout">
                <Header className="header">
                  // @ts-ignore
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
                </Header>
                <Content className="content">
                  <Route exact path="/" component={DataForm} />
                  <Route exact path="/train" component={Train} />
                </Content>
                <Footer className="footer">Приложение распространияется под лицензией MIT</Footer>
              </Layout>
            </Layout>
          </HashRouter>
        )
      }
}

export default AppLayout  