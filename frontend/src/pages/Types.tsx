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
  unit_type: "hour" | "unit" | "minute" | "page" | "daily";
  value: number;
};


const Types: React.FC = () => {
  const [types, setTypes] = useState<LessonType[]>([]);
  const [form] = Form.useForm();
  const [editingType, setEditingType] = useState<LessonType | null>(null);
  const [open, setOpen] = useState(false);

  const fetchTypes = () => {
    fetch(`${import.meta.env.VITE_API_URL}/types/`)
      .then((res) => res.json())
      .then((data) => setTypes(data))
      .catch((err) => console.error("Erro ao buscar types:", err));
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const addType = async (values: any) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/types/`, {
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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/types/${id}`, {
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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/types/${editingType.id}`, {
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
      render: (v: LessonType["unit_type"]) => {
            switch (v) {
              case "hour": return "Hora";
              case "unit": return "Telas";
              case "minute": return "Minuto";
              case "page": return "Página";
              case "daily": return "Diária";
              default: return v;
            }
          },

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
              <Option value="minute">Por Minuto</Option>
              <Option value="page">Por Página</Option>
              <Option value="daily">Por Diária</Option>
            </Select>
          </Form.Item>


          <Form.Item
            name="value"
            label="Valor (R$)"
            rules={[{ required: true, message: "Informe o valor" }]}
          >
           <InputNumber<number>
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              decimalSeparator=","
              formatter={(value) =>
                value ? `R$ ${value}`.replace(".", ",") : ""
              }
              parser={(value) =>
                value ? parseFloat(value.replace("R$ ", "").replace(",", ".")) : 0
              }
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
              <Option value="minute">Por Minuto</Option>
              <Option value="page">Por Página</Option>
              <Option value="daily">Por Diária</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="Valor (R$)"
            rules={[{ required: true, message: "Informe o valor" }]}
          >
           <InputNumber<number>
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              decimalSeparator=","
              formatter={(value) =>
                value ? `R$ ${value}`.replace(".", ",") : ""
              }
              parser={(value) =>
                value ? parseFloat(value.replace("R$ ", "").replace(",", ".")) : 0
              }
            />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default Types;
