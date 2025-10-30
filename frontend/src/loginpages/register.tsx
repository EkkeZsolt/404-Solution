import "./Register.scss";

export default function Register() {
  return (
    <div className="register-page">
      <h1>Regisztráció</h1>
      <div className="form-wrapper">
        <form className="register-form">
          <input type="text" placeholder="Felhasználónév" />
          <input type="password" placeholder="Jelszó" />
          <input type="password" placeholder="Jelszó újra" />
          <input type="email" placeholder="Email cím" />
          <select>
            <option value="">Tanár / Diák</option>
            <option value="tanar">Tanár</option>
            <option value="diak">Diák</option>
          </select>
          <button type="button">Regisztráció</button>
        </form>
      </div>
    </div>
  );
}
