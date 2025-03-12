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
          <h2>Welcome Back!</h2>
          <p>Enter your personal details to use all site features.</p>
          <button className="toggle-btn">Sign In</button>
        </div>
        <div className="login-right">
          <h2>Create Account</h2>
          <div className="social-login">
            <button className="social-btn google">G</button>
            <button className="social-btn facebook">F</button>
            <button className="social-btn linkedin">in</button>
          </div>
          <span>or use your email for registration</span>

          <form onSubmit={onSubmit} className="login-form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={inputEvent}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={inputEvent}
              required
            />
            <NavLink to="/forgot" className="forgot-password">
              Forgot Password?
            </NavLink>
            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
