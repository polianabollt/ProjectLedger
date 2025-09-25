import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  Typography,
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
} from "antd";

const { Title } = Typography;
const { Option } = Select;

type Lesson = {
  id: number;
  name: string;
  quantity: number;
  status: string;
  total_value: number;
  type_id: number;
};

type LessonType = {
  id: number;
  name: string;
  unit_type: "hour" | "unit";
  value: number;
};

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseName, setCourseName] = useState("");
  const [types, setTypes] = useState<LessonType[]>([]);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchLessons = () => {
    if (!id) return;

    fetch(`${import.meta.env.VITE_API_URL}/courses/${id}/lessons`)
      .then((res) => res.json())
      .then((data) => setLessons(data));
  };

  useEffect(() => {
    if (!id) return;

    fetch(`${import.meta.env.VITE_API_URL}/courses/`)
      .then((res) => res.json())
      .then((data) => {
        const course = data.find((c: any) => c.id === Number(id));
        setCourseName(course ? course.name : "Curso não encontrado");
      });

    fetchLessons();

    fetch(`${import.meta.env.VITE_API_URL}/types/`)
      .then((res) => res.json())
      .then((data) => setTypes(data));
  }, [id]);

  const addLesson = async (values: any) => {
    if (!id) return;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/lessons/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        quantity: values.quantity,
        status: "Não iniciado",
        course_id: Number(id),
        type_id: values.type_id,
      }),
    });

    if (res.ok) {
      message.success("Aula adicionada!");
      fetchLessons();
    }
  };

  const deleteLesson = async (lessonId: number) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/lessons/${lessonId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      message.success("Aula excluída!");
      fetchLessons();
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    form.setFieldsValue(lesson);
    setOpen(true);
  };

  const saveLesson = async () => {
    if (!editingLesson) return;

    const values = await form.validateFields();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/lessons/${editingLesson.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      message.success("Aula atualizada!");
      setOpen(false);
      fetchLessons();
    }
  };

  const columns = [
    { title: "Nome", dataIndex: "name", key: "name" },
    { title: "Quantidade", dataIndex: "quantity", key: "quantity", align: "center" as const },
    { title: "Status", dataIndex: "status", key: "status", align: "center" as const },
    {
      title: "Valor Total (R$)",
      dataIndex: "total_value",
      key: "total_value",
      align: "right" as const,
      render: (value: number) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: "Ações",
      key: "actions",
      align: "center" as const,
      render: (_: any, lesson: Lesson) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(lesson)}>
            Editar
          </Button>
          <Popconfirm
            title="Excluir aula?"
            onConfirm={() => deleteLesson(lesson.id)}
          >
            <Button type="link" danger>
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>📖 Curso: {courseName}</Title>
      <Link to="/courses">⬅️ Voltar para cursos</Link>

      <Card style={{ marginTop: 20, marginBottom: 20 }}>
        <Form layout="inline" onFinish={addLesson}>
          <Form.Item name="name" rules={[{ required: true, message: "Digite o nome da aula" }]}>
            <Input placeholder="Nome da aula" />
          </Form.Item>

          <Form.Item name="type_id" rules={[{ required: true, message: "Selecione o tipo" }]}>
            <Select placeholder="Tipo da aula" style={{ width: 220 }}>
              {types.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.name} ({t.unit_type === "hour" ? "Hora" : "Unidade"}) - R${t.value.toFixed(2)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="quantity" initialValue={1} rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Adicionar Aula
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table dataSource={lessons} columns={columns} rowKey="id" pagination={false} />
      </Card>

      <Modal
        title="Editar Aula"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={saveLesson}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type_id" label="Tipo" rules={[{ required: true }]}>
            <Select>
              {types.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Quantidade" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="Não iniciado">Não iniciado</Option>
              <Option value="Entregue">Entregue</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseDetail;
