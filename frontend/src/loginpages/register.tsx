import {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./Register.scss";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); 
  const [error, setError] = useState("");
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword || !role){
      setError("Kérlek, tölts ki minden mezőt!");
      return;
    }

    if (password !== confirmPassword) {
      setError("A két jelszó nem egyezik meg!");
      return;
    }

    if (role !== "tanar" && role !== "diak"){
      setError("Kérlek, válaszd ki, hogy tanár vagy diák vagy!");
      return;
    }
async function handleRegister(){
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: username,
          email,
          password,
          role
        }),
      });
      if (!response.ok) {
          const error = await response.json().catch(() => ({ message: 'Nem JSON válasz' }));
          console.error("Register error:", error);
        return;
      }
      alert("Sikeres regisztráció!");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };
}
  return (
    <div className="register-page">
      <h1>Regisztráció</h1>
      <div className="form-wrapper">
        <form className="register-form" onSubmit={handleRegister}> 
          <input type="text" placeholder="Felhasználónév" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <input type="password" placeholder="Jelszó újra" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          <input type="email" placeholder="Email cím" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Tanár / Diák</option>
            <option value="tanar">Tanár</option>
            <option value="diak">Diák</option>
          </select>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Regisztráció</button>
        </form>
      </div>
    </div>
  );
}
