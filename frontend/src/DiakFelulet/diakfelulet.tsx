import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./diakfelulet.scss";

interface Classroom {
  id: number;
  name: string;
  members: number;
}

export default function DiakFelulet() {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/student/classrooms", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!response.ok) throw new Error("Hiba a classroomok lekérésekor");
        const data = await response.json();
        setClassrooms(data);
      } catch (err) {
        console.error(err);
        setError("Nem sikerült betölteni a classroomokat");
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const handleJoinClassroom = () => {
    // Navigálás join classroom oldalra
    window.location.href = "/join-classroom"; // vagy navigate, ha react-router-dom-ot használsz
  };

  const handleClassroomClick = (id: number) => {
    window.location.href = `/classroom/${id}`;
  };

  if (loading) return <p className="loading-text">Classroomok betöltése...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="diak-page">
        <div className="diak-header">
            <h1>Saját Classroomok</h1>
            <button className="join-btn" onClick={handleJoinClassroom}>
                Join Classroom
            </button>
        </div>

      {classrooms.length === 0 ? (
        <p className="no-classrooms">Még nem vagy egyetlen classroom tagja sem.</p>
      ) : (
        <div className="classroom-list">
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="classroom-card"
              onClick={() => handleClassroomClick(classroom.id)}
            >
              <h3>{classroom.name}</h3>
              <p>{classroom.members} diák</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
