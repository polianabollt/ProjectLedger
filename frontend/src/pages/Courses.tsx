import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Form,
  Input,
  Select,
  Card,
} from "antd";
import { useNavigate } from "react-router-dom";

type Course = {
  id: number;
  name: string;
  client_id: number;
  client?: { id: number; name: string }; // depende de como vem no backend
};

type Client = {
  id: number;
  name: string;
};

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    const res = await fetch("http://127.0.0.1:8000/courses/");
    const data = await res.json();
    setCourses(data);
  };

  const fetchClients = async () => {
    const res = await fetch("http://127.0.0.1:8000/clients/");
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => {
    fetchCourses();
    fetchClients();
  }, []);

  const deleteCourse = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/courses/${id}`, {
      method: "DELETE",
    });
    message.success("Curso excluído!");
    fetchCourses();
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/courses/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Erro ao criar curso");
      message.success("Curso criado com sucesso!");
      fetchCourses();
    } catch (err) {
      message.error("Erro ao criar curso");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Nome", dataIndex: "name", key: "name" },
    {
      title: "Cliente",
      key: "client",
      render: (_: any, course: Course) => course.client?.name || "-",
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: any, course: Course) => (
        <>
          <Button type="link" onClick={() => navigate(`/courses/${course.id}`)}>
            Ver Aulas
          </Button>
          <Popconfirm
            title="Excluir curso?"
            onConfirm={() => deleteCourse(course.id)}
          >
            <Button type="link" danger>
              Excluir
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Card title="Adicionar Curso" style={{ marginBottom: 24 }}>
        <Form layout="inline" onFinish={onFinish}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Informe o nome do curso" }]}
          >
            <Input placeholder="Nome do curso" />
          </Form.Item>
          <Form.Item
            name="client_id"
            rules={[{ required: true, message: "Selecione um cliente" }]}
          >
            <Select placeholder="Cliente" style={{ width: 200 }}>
              {clients.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Table
        dataSource={courses}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </>
  );
};

export default Courses;
