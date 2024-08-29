import React, { useState } from "react";
import "../../style/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useRegisterUserMutation } from "../../store/store";
import Spinner from "../../components/Spinner";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    role: "student",
    parentName: "",
    parentEmail: "",
    parentAge: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.age || !formData.password) {
      return;
    }

    if (formData.role === "student" && (!formData.parentName || !formData.parentEmail || !formData.parentAge)) {
      return;
    }

    // Create a new object based on role
    const dataToSend = formData.role === "student"
      ? formData
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age,
          role: formData.role,
        };

    try {
      const response = await registerUser(dataToSend).unwrap();
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error(err.data.msg);
    }
  };

  return (
    <>
      <h2>Register as {formData.role}</h2>

      <div className="container">
        <div className="signup-container">
          <form onSubmit={handleSubmit}>
          <div className="inputField">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">admin</option>
              </select>
              <label>Role</label>
            </div>
            <div className="inputField">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label>Name</label>
            </div>

            <div className="inputField">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Email</label>
            </div>

            <div className="inputField">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label>Password</label>
            </div>

            <div className="inputField">
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min={formData.role !== "student" ? 25 : 5}
              />
              <label>Age</label>
            </div>

  

            {formData.role === "student" && (
              <>
                <div className="inputField">
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    required
                  />
                  <label>Parent Name</label>
                </div>

                <div className="inputField">
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    required
                  />
                  <label>Parent Email</label>
                </div>

                <div className="inputField">
                  <input
                    type="number"
                    name="parentAge"
                    value={formData.parentAge}
                    onChange={handleChange}
                    required
                    min={formData.role === "student" && 25}
                  />
                  <label>Parent Age</label>
                </div>
              </>
            )}

            {isLoading && <Spinner />}

            <button type="submit">Register</button>

          </form>
        
        </div>
      
      </div>
    </>
  );
};

export default Signup;
