import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { dLogout } from "../http";
import { setAuth } from "../store/auth-slice";
import axios from "axios";

const Navigation = () => {
    const { name, image } = useSelector((state) => state.authSlice.user);
    const dispatch = useDispatch();
    const history = useHistory();
    const [notifications, setNotifications] = useState([]);

    // Fetch Notifications (Pending Leave Requests)
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get("/api/notifications/admin"); // Adjust API endpoint
                setNotifications(res.data);
            } catch (error) {
                console.error("Error fetching notifications", error);
            }
        };
        fetchNotifications();
    }, []);

    // Mark a Notification as Read
    const markAsRead = async (id) => {
        try {
            await axios.put(`/api/notifications/read/${id}`);
            setNotifications(notifications.filter((notif) => notif._id !== id));
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    // Logout Function
    const logout = async () => {
        await dLogout();
        dispatch(setAuth(null));
        return history.push("/login");
    };

    return (
        <>
            <div className="navbar-bg"></div>
            <nav className="navbar navbar-expand-lg main-navbar">
                <form className="form-inline mr-auto">
                    <ul className="navbar-nav mr-3">
                        <li>
                            <NavLink to="/" id="sidebarCollapse" data-toggle="sidebar" className="nav-link nav-link-lg">
                                <i className="fas fa-bars"></i>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/" data-toggle="search" className="nav-link nav-link-lg d-sm-none">
                                <i className="fas fa-search"></i>
                            </NavLink>
                        </li>
                    </ul>
                    <div className="search-element">
                        <input className="form-control" type="search" placeholder="Search" aria-label="Search" data-width="250" />
                        <button className="btn" type="submit">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </form>

                <ul className="navbar-nav navbar-right">
                    {/* Notification Dropdown */}
                    <li className="dropdown dropdown-list-toggle">
                        <a href="#" data-toggle="dropdown" className="nav-link notification-toggle nav-link-lg beep">
                            <i className="far fa-bell"></i>
                            {notifications.length > 0 && <span className="badge badge-danger">{notifications.length}</span>}
                        </a>
                        <div className="dropdown-menu dropdown-list dropdown-menu-right">
                            <div className="dropdown-header">
                                Notifications
                                <div className="float-right">
                                    <NavLink to="/">Mark All As Read</NavLink>
                                </div>
                            </div>
                            <div className="dropdown-list-content dropdown-list-icons">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <NavLink to="/" key={notif._id} className="dropdown-item" onClick={() => markAsRead(notif._id)}>
                                            <div className="dropdown-item-icon bg-warning text-white">
                                                <i className="fas fa-user-clock"></i>
                                            </div>
                                            <div className="dropdown-item-desc">
                                                {notif.message}
                                                <div className="time">{new Date(notif.createdAt).toLocaleTimeString()}</div>
                                            </div>
                                        </NavLink>
                                    ))
                                ) : (
                                    <p className="dropdown-item text-center">No new notifications</p>
                                )}
                            </div>
                            <div className="dropdown-footer text-center">
                                <NavLink to="/">View All <i className="fas fa-chevron-right"></i></NavLink>
                            </div>
                        </div>
                    </li>

                    {/* User Dropdown */}
                    <li className="dropdown">
                        <a href="#" data-toggle="dropdown" className="nav-link dropdown-toggle nav-link-lg nav-link-user">
                            <img alt="User" src={image} className="rounded-circle mr-1" />
                            <div className="d-sm-none d-lg-inline-block">Hi, {name}</div>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <div className="dropdown-title">Logged in 5 min ago</div>
                            <NavLink to="/profile" className="dropdown-item has-icon">
                                <i className="far fa-user"></i> Profile
                            </NavLink>
                            <NavLink to="/activities" className="dropdown-item has-icon">
                                <i className="fas fa-bolt"></i> Activities
                            </NavLink>
                            <NavLink to="/settings" className="dropdown-item has-icon">
                                <i className="fas fa-cog"></i> Settings
                            </NavLink>
                            <div className="dropdown-divider"></div>
                            <NavLink to="/" onClick={logout} className="dropdown-item has-icon text-danger">
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </NavLink>
                        </div>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Navigation;
