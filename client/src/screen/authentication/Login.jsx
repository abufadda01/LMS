import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useLoginUserMutation } from '../../store/store';
import { setUser } from '../../store/store';
import Spinner from "../../components/Spinner"
import "../../style/login.scss";



export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState('');

  const dispatch = useDispatch();

  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    
    e.preventDefault()

    try {

      const response = await loginUser({ email, password }).unwrap();

      dispatch(setUser({ user: response.user, token: response.token  }))

      navigate("/")


      localStorage.setItem("token", JSON.stringify(response.token))

    } catch (error) {
      console.log(error)
      
    }
   

  }



  return (

    <section className="login">
<div className="inlogin">
      <div className="heading">
        <h1>Login</h1>
      </div>

      <form onSubmit={handleSubmit}>
      <label>
                  Email Address
                </label>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          value={email}
        />
        <label>
                  Password
                </label>

        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          value={password}
        />

        <button type="submit" disabled={isLoading}>Login</button>

        {isError && <p>Error: {error.data.msg}</p>}

      </form>

      <div className="switchPage">
        <Link to="/signup">Sign up</Link>
      </div>
     </div>   
        {isLoading   && <Spinner/>}
   
    </section>
  );
}


