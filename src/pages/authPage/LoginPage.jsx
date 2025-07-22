import React from "react";
import AuthService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { Message } from "semantic-ui-react";
import "../../css/login.css";

function LoginPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const onLogin = async () => {
    setErrorMessage("");

    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    try {
      const credentials = { Username: username, Password: password };
      const response = await AuthService.login(credentials);
      const {
        accessToken,
        refreshToken,
        userName,
        employeeId,
        positionId,
        roleId,
      } = response.data;
      console.log("Login response:", response.data);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", userName);
      localStorage.setItem("employeeId", employeeId);
      localStorage.setItem("positionId", positionId); // 🔧 phải là "positionId"
      localStorage.setItem("roleId", roleId);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("Login failed. Please check your username or password.");
    }
  };

  return (
    <div className="page-login">
      <div className="login-form-wrapper">
        <h2 className="login-form-title">Login to your account</h2>

        {errorMessage && (
          <Message negative>
            <Message.Header>Login Error</Message.Header>
            <p>{errorMessage}</p>
          </Message>
        )}

        <div className="input-group">
          <span className="input-group-text">
            <i className="fa fa-user" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <span className="input-group-text">
            <i className="fa fa-lock" />
          </span>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-login" onClick={onLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
