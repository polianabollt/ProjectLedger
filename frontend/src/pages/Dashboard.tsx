import React, { useEffect, useState } from "react";
import { Table, Typography, Card, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

type ClientReport = {
  client_id: number;
  client_name: string;
  total_value: number;
  courses_count: number;
  lessons_count: number;
};

const Dashboard: React.FC = () => {
  const [report, setReport] = useState<ClientReport[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/clients/report/all`)
      .then((res) => res.json())
      .then((data) => setReport(data))
      .catch((err) => console.error("Erro ao carregar relatório:", err));
  }, []);

  const columns = [
    { title: "Cliente", dataIndex: "client_name", key: "client_name" },
    { title: "Cursos", dataIndex: "courses_count", key: "courses_count" },
    { title: "Lições", dataIndex: "lessons_count", key: "lessons_count" },
    {
      title: "Valor Total",
      dataIndex: "total_value",
      key: "total_value",
      render: (v: number) =>
        v.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: any, record: ClientReport) => (
        <Button type="link" onClick={() => navigate(`/clients/${record.client_id}`)}>
          Ver Cliente
        </Button>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>📊 Dashboard - Clientes</Title>
      <Card>
        <Table
          dataSource={report}
          columns={columns}
          rowKey="client_id"
          pagination={false}
        />
      </Card>
    </>
  );
};

export default Dashboard;
