import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./tanarfelulet.scss";

interface Quiz {
  id: number;
  name: string;
  completions: number;
}

interface JoinRequest {
  id: number;
  username: string;
}

export default function GroupDetails() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/groups/${code}`, {
          headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          },  
        });
        const data = await res.json();
        console.log("Fetched data:", data);
        setGroup(data);
        setQuizzes(data.quizzes);
        setJoinRequests(data.joinRequests);
      } catch (err) {
        console.error("Hiba a classroom adatainak lekérésekor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  const handleApprove = async (requestId: number) => {
    try {
      await fetch(`http://localhost:8000/api/groups/${code}/approve/${requestId}`, {
        method: "POST",
      });
      setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Hiba a kérés elfogadásakor:", err);
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await fetch(`http://localhost:8000/api/groups/${code}/reject/${requestId}`, {
        method: "POST",
      });
      setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Hiba a kérés elutasításakor:", err);
    }
  };

  const handleNewQuiz = () => {
    navigate(`/group/${code}/create-quiz`);
  };

  if (loading) {
    return <p className="loading-text">Adatok betöltése...</p>;
  }

  return (
    <div className="group-details-page">
      <div className="group-details-header">
        <div className="group-info">
          <p className="classroom-code">Kurzus kód: {group?.classroom_code ?? "ismeretlen"}</p>
          <h2>{group?.name ?? "ismeretlen csoport"}</h2>
        </div>

        <div className="header-buttons">
          <button className="join-btn" onClick={() => setShowModal(true)}>
            Join kérelmek
          </button>
          <button className="new-quiz-btn" onClick={handleNewQuiz}>
            Új kvíz létrehozása
          </button>
        </div>
      </div>

      <h3>Kvízek</h3>
      {quizzes.length === 0 ? (
        <p className="no-quiz">Még nincs létrehozott kvíz ebben a csoportban.</p>
      ) : (
        <ul className="quiz-list">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="quiz-item">
              <span className="quiz-name">{quiz.name}</span>
              <span className="quiz-stats">{quiz.completions} kitöltés</span>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Belépési kérelmek</h3>
            {joinRequests.length === 0 ? (
              <p>Nincsenek függőben lévő kérelmek.</p>
            ) : (
              <ul className="join-request-list">
                {joinRequests.map((req) => (
                  <li key={req.id}>
                    <span>{req.username}</span>
                    <div className="request-buttons">
                      <button onClick={() => handleApprove(req.id)}>Elfogad</button>
                      <button onClick={() => handleReject(req.id)}>Elutasít</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button className="close-modal" onClick={() => setShowModal(false)}>
              Bezárás
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
