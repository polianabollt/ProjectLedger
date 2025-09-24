import React, { useEffect, useState } from "react";

type Lesson = {
  id: number;
  name: string;
  quantity: number;
  status: string;
  course_id: number;
  type_id: number;
  total_value: number;
};

const Lessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/lessons/")
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch((err) => console.error("Erro ao buscar lessons:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📖 Lessons</h1>
      {lessons.length === 0 ? (
        <p>Nenhuma aula cadastrada.</p>
      ) : (
        <table border={1} cellPadding={5} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Status</th>
              <th>Valor Total (R$)</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.id}>
                <td>{l.name}</td>
                <td>{l.quantity}</td>
                <td>{l.status}</td>
                <td>{l.total_value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Lessons;
