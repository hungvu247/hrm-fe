import React from "react";

const LoginLayout = ({
  username,
  password,
  onChangeUsername,
  onChangePassword,
  onLogin,
}) => {
  return (
    <div className="page-login">
      <div className="login-form-wrapper">
        <div className="login-form">
          <h1 className="login-form-title">Login to your account</h1>
          <div className="login-form-body">
            <div className="input-login mb-3">
              <span className="input-group-text">
                <i className="fa-solid fa-user"></i>
              </span>
              <input
                type="text"
                className="form-control-login"
                placeholder="username"
                value={username}
                onChange={onChangeUsername}
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                className="form-control-login"
                placeholder="password"
                value={password}
                onChange={onChangePassword}
              />
            </div>
            <button className="btn btn-login btn-block" onClick={onLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
