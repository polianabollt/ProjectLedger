import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Typography, Card } from "antd";

const { Title } = Typography;

type Course = {
  id: number;
  name: string;
  lessons_count: number;
  total_value: number;
};

type ClientReport = {
  client_id: number;
  client_name: string;
  total_value: number;
  courses_count: number;
  lessons_count: number;
};

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ClientReport | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // resumo do cliente
    fetch(`${import.meta.env.VITE_API_URL}clients/${id}/report`)
      .then((res) => res.json())
      .then(setReport);

    // cursos do cliente
    fetch(`${import.meta.env.VITE_API_URL}/clients/${id}/courses`)
      .then((res) => res.json())
      .then(setCourses);
  }, [id]);

  const columns = [
    { title: "Curso", dataIndex: "name", key: "name" },
    { title: "Lições", dataIndex: "lessons_count", key: "lessons_count" },
    {
      title: "Valor Total",
      dataIndex: "total_value",
      key: "total_value",
      render: (v: number) =>
        v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    },
  ];

  return (
    <>
      <Title level={2}>Cliente: {report?.client_name}</Title>
      <Card style={{ marginBottom: 24 }}>
        {report && (
          <p>
            Cursos: {report.courses_count} | Lições: {report.lessons_count} |
            Valor Total:{" "}
            {report.total_value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        )}
      </Card>

      <Card title="Cursos do Cliente">
        <Table
          dataSource={courses}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </>
  );
};

export default ClientDetail;
