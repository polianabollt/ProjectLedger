import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Popconfirm,
  message,
  Modal,
  Space,
} from "antd";

const { Title } = Typography;
const { Option } = Select;

type LessonType = {
  id: number;
  name: string;
  unit_type: "hour" | "unit";
  value: number;
};

const Types: React.FC = () => {
  const [types, setTypes] = useState<LessonType[]>([]);
  const [form] = Form.useForm();
  const [editingType, setEditingType] = useState<LessonType | null>(null);
  const [open, setOpen] = useState(false);

  const fetchTypes = () => {
    fetch("http://127.0.0.1:8000/types/")
      .then((res) => res.json())
      .then((data) => setTypes(data))
      .catch((err) => console.error("Erro ao buscar types:", err));
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const addType = async (values: any) => {
    const res = await fetch("http://127.0.0.1:8000/types/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      message.success("Tipo adicionado!");
      fetchTypes();
    }
  };

  const deleteType = async (id: number) => {
    const res = await fetch(`http://127.0.0.1:8000/types/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      message.success("Tipo excluído!");
      fetchTypes();
    }
  };

  const handleEdit = (record: LessonType) => {
    setEditingType(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const saveType = async () => {
    if (!editingType) return;

    const values = await form.validateFields();
    const res = await fetch(`http://127.0.0.1:8000/types/${editingType.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      message.success("Tipo atualizado!");
      setOpen(false);
      fetchTypes();
    }
  };

  const columns = [
    { title: "Nome", dataIndex: "name", key: "name" },
    {
      title: "Telas",
      dataIndex: "unit_type",
      key: "unit_type",
      render: (v: "hour" | "unit") => (v === "hour" ? "Hora" : "Telas"),
    },
    {
      title: "Valor (R$)",
      dataIndex: "value",
      key: "value",
      align: "right" as const,
      render: (val: number) => `R$ ${val.toFixed(2)}`,
    },
    {
      title: "Ações",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: LessonType) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Popconfirm
            title="Excluir tipo?"
            onConfirm={() => deleteType(record.id)}
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
      <Title level={3}>⚙️ Lesson Types</Title>

      <Card style={{ marginBottom: 20 }}>
        <Form layout="inline" onFinish={addType}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Digite o nome do tipo" }]}
          >
            <Input placeholder="Nome do tipo" />
          </Form.Item>

          <Form.Item
            name="unit_type"
            rules={[{ required: true, message: "Selecione a unidade" }]}
            initialValue="hour"
          >
            <Select style={{ width: 160 }}>
              <Option value="hour">Por Hora</Option>
              <Option value="unit">Por Telas</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            rules={[{ required: true, message: "Digite o valor" }]}
          >
            <InputNumber
              placeholder="Valor"
              min={0}
              step={0.01}
              style={{ width: 120 }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table dataSource={types} columns={columns} rowKey="id" pagination={false} />
      </Card>

      <Modal
        title="Editar Tipo"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={saveType}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="unit_type" label="Unidade" rules={[{ required: true }]}>
            <Select>
              <Option value="hour">Por Hora</Option>
              <Option value="unit">Por Telas</Option>
            </Select>
          </Form.Item>
          <Form.Item name="value" label="Valor (R$)" rules={[{ required: true }]}>
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Types;
