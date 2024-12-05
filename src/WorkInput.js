import React, { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const WorkInput = () => {
  const [date, setDate] = useState("");
  const [classification, setClassification] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSave = async () => {
    const start = new Date(`2024-01-01T${startTime}:00`);
    const end = new Date(`2024-01-01T${endTime}:00`);
    const workedHours = (end - start) / 3600000; // 時間に変換

    // 現在のユーザーを取得
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("ログインしてください");
      return;
    }

    // 業務分類の時給を取得
    const hourlyRate = parseInt(classification, 10); // `classification` を数値に変換
    const calculatedSalary = workedHours * hourlyRate;

    try {
      await addDoc(collection(db, `users/${currentUser.uid}/work_entries`), {
        date,
        classification: `${hourlyRate}円`, // 分類の説明を保存
        startTime,
        endTime,
        workedHours,
        calculatedSalary,
      });
      alert("データ保存成功");
    } catch (error) {
      alert("データ保存失敗: " + error.message);
    }
  };

  return (
    <div>
      <h2>労働時間入力</h2>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <select
        value={classification}
        onChange={(e) => setClassification(e.target.value)}
      >
        <option value="">業務分類を選択</option>
        <option value="0">0円</option>
        <option value="50">50円</option>
        <option value="100">100円</option>
        <option value="200">200円</option>
        <option value="250">250円</option>
        <option value="300">300円</option>
        <option value="350">350円</option>
        <option value="400">400円</option>
        <option value="600">600円</option>
        <option value="800">800円</option>
      </select>
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <button onClick={handleSave}>保存</button>
    </div>
  );
};

export default WorkInput;