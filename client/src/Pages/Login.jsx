import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App"; // import from App.js where you created AuthContext

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // get login function from context
  const navigate = useNavigate(); // hook to redirect

  const handleLogin = async () => {
    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      // Verify with backend
      const res = await axios.post(
        "http://localhost:5007/api/auth/login",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update app state
      login(); // set isAuthenticated = true
      navigate("/upload"); // redirect to upload page

      alert("Login success: " + res.data.message);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Not registered? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
