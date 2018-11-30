import React, { Component } from "react";
import { Layout, Icon } from "antd";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "antd/dist/antd.css";
import "./static/index.css";

import ListMenu from "./layout/ListMenu";
import Conteudos from "./conteudos/Conteudos";
import Habilidades from "./habilidades/Habilidades";
import AreasConhecimento from "./areas-de-conhecimento/AreasConhecimento";
import AreaGestor from "./area-do-gestor/AreaGestor";
import Questoes from "./questoes/Questoes";

const { Header, Sider, Content, Footer } = Layout;

const routes = [
  {
    path: "/admin",
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <h1>Dashboard</h1>
  },
  {
    path: "/admin/cadastros/habilidades",
    sidebar: () => <div>Cadastro/Habilidade</div>,
    main: () => <Habilidades />
  },
  {
    path: "/admin/cadastros/conteudos",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Conteudos />
  },
  {
    path: "/admin/cadastros/areas-de-conhecimento",
    sidebar: () => <div>Cadastro/Áreas de Conhecimento</div>,
    main: () => <AreasConhecimento />
  },
  {
    path: "/admin/cadastros/questões",
    sidebar: () => <div>Cadastro/Questoes</div>,
    main: () => <Questoes />
  },
  {
    path: "/admin/area-do-gestor",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <AreaGestor />
  },
  {
    path: "/admin/simulado",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <h1>Simulado</h1>
  },
  {
    path: "/admin/banco-de-questoes",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Questoes />
  },
  {
    path: "/admin/meus-alunos",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <h1>Meus Alunos</h1>
  },
  {
    path: "/admin/editar-perfil",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <h1>Editar Perfil</h1>
  }
];

class AdminIndex extends Component {
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  render() {
    return (
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo">UNITOLEDO</div>
            <ListMenu />
          </Sider>
          <Layout>
            <Header style={{ background: "#fff", padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                onClick={this.toggle}
              />
            </Header>
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                background: "#fff",
                minHeight: 280
              }}
            >
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.main}
                />
              ))}
            </Content>
            <Footer style={{ textAlign: "center" }}>UNITOLEDO ©2018</Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default AdminIndex;
