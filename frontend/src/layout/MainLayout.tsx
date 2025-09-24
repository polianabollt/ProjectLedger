import React, { useEffect } from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  BookOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // adiciona classe no body
    document.body.classList.add("app-body");

    // remove quando desmontar (boa prática, caso use outro layout no futuro)
    return () => {
      document.body.classList.remove("app-body");
    };
  }, []);

  // Mapeia rotas para chaves do menu
  const menuKeyMap: Record<string, string> = {
    "/": "1",
    "/clients": "2",
    "/courses": "3",
    "/types": "4",
  };

const selectedKey =
  Object.entries(menuKeyMap).find(([path]) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)
  )?.[1] || "1";

  const menuItems = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: <Link to="/">Dashboard</Link>,
  },
  {
    key: "2",
    icon: <DashboardOutlined />,
    label: <Link to="/clients">Clientes</Link>,
  },
  {
    key: "3",
    icon: <BookOutlined />,
    label: <Link to="/courses">Courses</Link>,
  },
  {
    key: "4",
    icon: <SettingOutlined />,
    label: <Link to="/types">Lesson Types</Link>,
  },
];


  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      {/* Menu lateral */}
      <Sider collapsible>
        <div
          style={{
            height: 64,
            margin: 16,
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: 8,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          ProjectLedger
        </div>
         <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            />
      </Sider>

      {/* Conteúdo */}
      <Layout style={{ width: "100%" }}>
        <Header style={{ background: "#fff", padding: "0 20px" }}>
          <h2 style={{ margin: 0 }}>📊 ProjectLedger</h2>
        </Header>
        <Content style={{ padding: 24, background: "#f5f5f5" }}>
          <div
                style={{
                background: "#fff",
                padding: 24,
                minHeight: "calc(100vh - 112px)", // altura total - header(64) - footer(48)
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                width: "100%", // pega 100% da largura disponível
                }}
            >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ProjectLedger ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
