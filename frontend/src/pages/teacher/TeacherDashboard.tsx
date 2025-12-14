import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./TeacherDashboard.scss";
import { api } from "../../services/api";

export default function TanarFelulet() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await api.teacherDashboard();
        if (data.classrooms) {
          setGroups(data.classrooms);
        } else if (Array.isArray(data)) {
          setGroups(data);
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    fetchGroups();
  }, []);

  const handleNewGroup = () => {
    navigate("/teacher/create-classroom");
  };

  const handleGroupClick = (group: any) => {
    navigate(`/teacher/classroom/${group.id}`, { state: { group } });
  };


  return (
    <div className="groups-page">
      <div className="groups-header">
        <h1>{t("teacher.groups")}</h1>
        <button className="btn btn-primary" onClick={handleNewGroup}>
          {t("teacher.newGroup")}
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="no-group">{t("teacher.noGroups")}</p>
      ) : (
        <div className="groups-list">
          {groups.map((group) => (
            <div
              key={group.id}
              className="group-card"
              onClick={() => handleGroupClick(group)}
            >
              <h3>{group.name}</h3>
              <p>{group.students_count} {t("teacher.members")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
