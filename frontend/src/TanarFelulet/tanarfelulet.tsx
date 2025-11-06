import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import "./tanarfelulet.scss";

export default function Groups() {
    const navigate = useNavigate();

    const[groups, setGroups] = useState<any[]>([]);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/groups");
                const data = await response.json();

                setGroups(data); 
      } catch (err) {
        console.error("Hiba a csoportok lekérésekor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

    const handleNewGroup = () => {
    navigate("/new-group");
  };

  const handleGroupClick = (id: number) => {
    navigate(`/group/${id}`);
  };

  if (loading) {
    return <p className="loading-text">Csoportok betöltése...</p>;
  }
  return (
    <div className="groups-page">
      <div className="groups-header">
        <h1>Csoportok</h1>
        <button className="new-group-btn" onClick={handleNewGroup}>
          Új csoport létrehozása
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="no-group">Még nincsen csoportja.</p>
      ) : (
        <div className="groups-list">
          {groups.map((group) => (
            <div
              key={group.id}
              className="group-card"
              onClick={() => handleGroupClick(group.id)}
            >
              <h3>{group.name}</h3>
              <p>{group.members} tag</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
