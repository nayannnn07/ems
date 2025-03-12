import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doLogin } from "../../http";
import { setAuth } from "../../store/auth-slice";
import logo from "../../assets/img/logo2.png";
// import "./LoginForm.css";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("All Fields Required");
      return;
    }

    try {
      const res = await doLogin({ email, password });
      const { success, user } = res;

      if (success) {
        dispatch(setAuth(user));
        toast.success("Login Successful");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-box">
        <div className="login-left">
          <div className="left-content">
            <h2>Welcome to WorkSphere</h2>
            <p>
              Your complete workplace solution for seamless team management and
              productivity
            </p>
            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Manage Employees Easily</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Quick & Easy Team Setup</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>One Click Attendance</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Role Based Access Control</span>
              </div>
            </div>
          </div>
          <div className="decoration-circles">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
        </div>
        <div className="login-right">
          <div className="logo-container">
            <img
              src={logo || "/placeholder.svg"}
              alt="Company Logo"
              className="company-logo"
            />
          </div>
          <h2>Login to Dashboard</h2>

          <form onSubmit={onSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={inputEvent}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={inputEvent}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
          <div className="login-footer">
            © {new Date().getFullYear()} WorkSphere. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
