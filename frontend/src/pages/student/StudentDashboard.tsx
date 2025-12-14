import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./StudentDashboard.scss";

interface Classroom {
  id: number;
  name: string;
  members: number;
}

export default function DiakFelulet() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/diak/dasboard", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!response.ok) throw new Error("Error fetching classrooms");
        const data = await response.json();
        console.log("Diak Dashboard Data:", data);

        if (Array.isArray(data)) {
          setClassrooms(data);
        } else if (data.classrooms && Array.isArray(data.classrooms)) {
          setClassrooms(data.classrooms);
        } else {
          console.error("Unexpected response format:", data);
          setClassrooms([]);
        }
      } catch (err) {
        console.error(err);
        setError(t("common.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const handleJoinClassroom = () => {
    navigate("/student/join-classroom");
  };

  const handleClassroomClick = (id: number) => {
    navigate(`/student/classroom/${id}`);
  };

  if (loading) return <p className="loading-text">{t("common.loading")}</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="diak-page">
      <div className="diak-header">
        <h1>{t("student.myClassrooms")}</h1>
        <button className="btn btn-primary" onClick={handleJoinClassroom}>
          {t("student.joinClassroom")}
        </button>
      </div>

      {classrooms.length === 0 ? (
        <p className="no-classrooms">{t("student.noClassrooms")}</p>
      ) : (
        <div className="classroom-list">
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="classroom-card"
              onClick={() => handleClassroomClick(classroom.id)}
            >
              <h3>{classroom.name}</h3>
              <p>{classroom.members} {t("student.students")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
