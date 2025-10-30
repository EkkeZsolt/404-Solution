<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a5e0610 (register error message update)
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
<<<<<<< HEAD
<<<<<<< HEAD
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
=======
  const handleRegister = () => {
>>>>>>> a5e0610 (register error message update)
=======
  const handleRegister = (e: React.FormEvent) => {
>>>>>>> dc6b96f (register javítása)
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

    setError("");
    alert("Sikeres regisztráció");
    navigate("/login");
  };
  
<<<<<<< HEAD
=======
import "./Register.scss";

export default function Register() {
>>>>>>> b7e6022 (Create register.tsx)
=======
>>>>>>> a5e0610 (register error message update)
  return (
    <div className="register-page">
      <h1>Regisztráció</h1>
      <div className="form-wrapper">
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> dc6b96f (register javítása)
        <form className="register-form" onSubmit={handleRegister}> 
          <input type="text" placeholder="Felhasználónév" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <input type="password" placeholder="Jelszó újra" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          <input type="email" placeholder="Email cím" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
<<<<<<< HEAD
=======
        <form className="register-form">
          <input type="text" placeholder="Felhasználónév" />
          <input type="password" placeholder="Jelszó" />
          <input type="password" placeholder="Jelszó újra" />
          <input type="email" placeholder="Email cím" />
          <select>
>>>>>>> b7e6022 (Create register.tsx)
=======
>>>>>>> dc6b96f (register javítása)
            <option value="">Tanár / Diák</option>
            <option value="tanar">Tanár</option>
            <option value="diak">Diák</option>
          </select>
<<<<<<< HEAD
<<<<<<< HEAD
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Regisztráció</button>
=======
=======
          {error && <p className="error-message">{error}</p>}
>>>>>>> a5e0610 (register error message update)
          <button type="button">Regisztráció</button>
>>>>>>> b7e6022 (Create register.tsx)
        </form>
      </div>
    </div>
  );
}
