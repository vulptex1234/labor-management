import React, { useState } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const WorkSummary = () => {
  const [entries, setEntries] = useState([]);
  const [summaryByClassification, setSummaryByClassification] = useState({});
  const [totalSummary, setTotalSummary] = useState({ totalHours: 0, totalSalary: 0 });
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    setLoading(true); // 読み込み状態をオン
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("ログインしてください");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching data from Firestore...");
      const querySnapshot = await getDocs(
        collection(db, `users/${currentUser.uid}/work_entries`)
      );

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id, // ドキュメントIDを追加
        ...doc.data(),
      }));

      // 日付でソート
      data.sort((a, b) => new Date(a.date) - new Date(b.date));

      // 集計処理
      const summaryByClassification = {};
      let totalHours = 0;
      let totalSalary = 0;

      data.forEach((entry) => {
        const { classification, workedHours, calculatedSalary } = entry;
        if (!summaryByClassification[classification]) {
          summaryByClassification[classification] = { totalHours: 0, totalSalary: 0 };
        }
        summaryByClassification[classification].totalHours += workedHours;
        summaryByClassification[classification].totalSalary += calculatedSalary;

        // 全体の合計
        totalHours += workedHours;
        totalSalary += calculatedSalary;
      });

      setEntries(data);
      setSummaryByClassification(summaryByClassification);
      setTotalSummary({ totalHours, totalSalary });
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
      alert("データ取得失敗: " + error.message);
    } finally {
      setLoading(false); // 読み込み状態をオフ
    }
  };

  const handleDelete = async (id) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("ログインしてください");
      return;
    }

    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/work_entries`, id));
      alert("データ削除成功");
      fetchEntries(); // データを再取得
    } catch (error) {
      console.error("Error deleting data from Firestore:", error);
      alert("データ削除失敗: " + error.message);
    }
  };

  return (
    <div>
      <h2>集計結果</h2>
      <button onClick={fetchEntries} disabled={loading}>
        {loading ? "集計中..." : "集計結果を取得"}
      </button>

      <table border="1" style={{ marginTop: "20px", width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>No.</th>
            <th>日付</th>
            <th>勤務時間</th>
            <th>労働時間</th>
            <th>分類</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <tr key={entry.id}>
                <td>{index + 1}</td>
                <td>{entry.date}</td>
                <td>
                  {entry.startTime} ~ {entry.endTime}
                </td>
                <td>{entry.workedHours.toFixed(2)}h</td>
                <td>{entry.classification}</td>
                <td>
                  <button onClick={() => handleDelete(entry.id)}>削除</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                データがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>分類ごとの合計</h3>
      <table border="1" style={{ marginTop: "20px", width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>分類</th>
            <th>合計時間 (h)</th>
            <th>合計金額 (円)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summaryByClassification).map(([classification, summary], index) => (
            <tr key={index}>
              <td>{classification}</td>
              <td>{summary.totalHours.toFixed(2)}</td>
              <td>{summary.totalSalary}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>全体の合計</h3>
      <table border="1" style={{ marginTop: "20px", width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>合計時間 (h)</th>
            <th>合計金額 (円)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{totalSummary.totalHours.toFixed(2)}</td>
            <td>{totalSummary.totalSalary}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WorkSummary;