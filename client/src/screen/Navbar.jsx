import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.svg";
// import logoAr from "../../public/images/logo/LogoAr.png"
// style
import "../style/navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import { useLoginUserMutation } from "../store/store";
import { logout } from "../store/slices/userSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const userSlice = useSelector((state) => state.user);
  const { user, token } = userSlice;

  const [showNav, setShowNav] = useState(false);

  const handlerCloseNav = () => {
    if (showNav) setShowNav(false);
  };

  const handelLogout = () => {
    if (showNav) setShowNav(false);
    dispatch(logout());
    nav("/login");
  };

  return (
    <section
      className="navbar"
      style={{
        display:
          window.location.pathname.slice(0, 10) === "/dashboard"
            ? "none"
            : "block",
      }}
    >
      <div className="bottomPart">
        <div className="bottom1">
          <div className="logo">
            <NavLink to="/">
              <img className="logoAr" src={logo} width={100} alt="" />
            </NavLink>
          </div>
          <div className="nav">
            <ul>
              {token && (
                <>
                  <li>
                    <NavLink
                      to="/course"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      دروس
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/quiz"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      اختبار
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/result"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      النتيجة
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/ticket"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      الحصول على مساعده
                    </NavLink>
                  </li>
                  {user?.isAdmin && (
                    <>
                      <li>
                        <NavLink
                          to="/admin/tickets"
                          className={({ isActive }) =>
                            isActive ? "active-link" : ""
                          }
                        >
                          admin tickets
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/admin/instructors/courses"
                          className={({ isActive }) =>
                            isActive ? "active-link" : ""
                          }
                        >
                          courses
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/admin/courses/filtered"
                          className={({ isActive }) =>
                            isActive ? "active-link" : ""
                          }
                        >
                          Filtered Courses
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/instructor/courses"
                          className={({ isActive }) =>
                            isActive ? "active-link" : ""
                          }
                        >
                          my courses
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="admin/courses/enrolments"
                          className={({ isActive }) =>
                            isActive ? "active-link" : ""
                          }
                        >
                          Enrolments
                        </NavLink>
                      </li>
                    </>
                  )}
                  {user?.role === "instructor" && (
                    <>
                      <li>
                        <NavLink
                          to="/instructor/courses"
                          className={({ isActive }) =>
                            isActive ? "active-link" : ""
                          }
                        >
                          my courses
                        </NavLink>
                      </li>
                    </>
                  )}
                </>
              )}

              {token ? (
                <>
                  <li onClick={handelLogout}>
                    <NavLink to="#">
                      الخروج
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      الدخول
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/signUp"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      تسجيل
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="hamburger" onClick={() => setShowNav(!showNav)}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
        <div className={`hamburgerNavbar  ${showNav ? "show" : "hidden"}`}>
          <div className="HamburgerNav">
            <ul>
              {token && (
                <>
                  <li onClick={handlerCloseNav}>
                    <NavLink
                      to="/course"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      الدروس
                    </NavLink>
                  </li>
                  <li onClick={handlerCloseNav}>
                    <NavLink
                      to="/quiz"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      اختبار
                    </NavLink>
                  </li>
                  <li onClick={handlerCloseNav}>
                    <NavLink
                      to="/result"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      النتيجة
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/ticket"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      الحصول على مساعده
                    </NavLink>
                  </li>
                  {user?.isAdmin && (
                    <>
                      <li>
                        <NavLink
                          to="/admin/tickets"
                          className={({ isActive }) =>
                            isActive ? "active-link" : ""
                          }
                        >
                          admin tickets
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/admin/instructors/courses"
                          className={({ isActive }) =>
                            isActive ? "active-link" : ""
                          }
                        >
                          courses
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/admin/courses/filtered"
                          className={({ isActive }) =>
                            isActive ? "active-link" : ""
                          }
                        >
                          Filtered Courses
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/instructor/courses"
                          className={({ isActive }) =>
                            isActive ? "active-link" : ""
                          }
                        >
                          my courses
                        </NavLink>
                      </li>
                    </>
                  )}
                  {user?.role === "instructor" && (
                    <>
                      <li onClick={handlerCloseNav}>
                        <NavLink
                          to="/instructor/courses"
                          className={({ isActive }) =>
                            isActive ? "active-link" : ""
                          }
                        >
                          my courses
                        </NavLink>
                      </li>
                    </>
                  )}
                </>
              )}
              {token ? (
                <>
                  <li onClick={handelLogout}>
                    <NavLink to="#">
                      الخروج
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li onClick={handlerCloseNav}>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      الدخول
                    </NavLink>
                  </li>
                  <li onClick={handlerCloseNav}>
                    <NavLink
                      to="/signUp"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      تسجيل
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
