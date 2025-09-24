// frontend/src/pages/Clients.tsx
import React, { useEffect, useState } from "react";
import { Table, Card, Form, Input, Button, Popconfirm, message, Typography } from "antd";

const { Title } = Typography;

type Client = { id: number; name: string };

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/clients/");
    const data = await res.json();
    setClients(data);
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const addClient = async (values: { name: string }) => {
    const res = await fetch("http://127.0.0.1:8000/clients/", {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify(values)
    });
    if (res.ok) { message.success("Cliente criado"); fetchClients(); }
  };

  const deleteClient = async (id: number) => {
    const res = await fetch(`http://127.0.0.1:8000/clients/${id}`, { method: "DELETE" });
    if (res.ok) { message.success("Cliente excluído"); fetchClients(); }
  };

  const columns = [
    { title: "Cliente", dataIndex: "name", key: "name" },
    {
      title: "Ações", key: "actions", render: (_: any, r: Client) => (
        <Popconfirm title="Excluir cliente?" onConfirm={() => deleteClient(r.id)}>
          <Button danger type="link">Excluir</Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <>
      <Title level={3}>👤 Clients</Title>

      <Card style={{ marginBottom: 20 }}>
        <Form layout="inline" onFinish={addClient}>
          <Form.Item name="name" rules={[{ required: true, message: "Nome do cliente" }]}>
            <Input placeholder="Nome do cliente" />
          </Form.Item>
          <Form.Item><Button type="primary" htmlType="submit">Adicionar</Button></Form.Item>
        </Form>
      </Card>

      <Card>
        <Table dataSource={clients} columns={columns} rowKey="id" loading={loading} pagination={false} />
      </Card>
    </>
  );
};

export default Clients;
