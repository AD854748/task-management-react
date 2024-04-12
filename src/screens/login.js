// src/Login.js
import React, { useState } from 'react';
import './Login.css'; // Import CSS file for styling
import { useHistory } from 'react-router-dom';
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const [loader, setLoader] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        // Call login API here
        try { 
            console.log("data coming is ",username,password)
            const response = await fetch('http://127.0.0.1:8000/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email:username ,password:password })
            });
            console.log("res is..",response?.status)
            console.log("res is..11111",response?.body)
            const data = await response.json();
            if(data?.email?.[0] == "custom user with this email already exists."){
            alert("Login Successful")
            setLoader(false)
            history.push('home')
            }
            else{
                alert(JSON.stringify(data))
                setLoader(false)
              
            }
            console.log("res is..11112333",data?.email?.[0] == "custom user with this email already exists."); 
           
        } catch (error) {
            console.error('Error:11111', error);
            setLoader(false)
            console.error('Error:11111', error);
        }
    };

    return (
        <div className="login-container">
            <div style={{top:0,width:'100vw',height:'5vh',backgroundColor:'royalblue',position:"absolute",fontWeight:"bold",color:'palegoldenrod'}}>JIRA - A Ticket Management System</div>
            <form className="login-form"  onSubmit={handleSubmit}>
                <h3>Log In to Jira Board</h3>
                <div className="form-group">
                    <label>Username:</label>
                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {loader ? (
        // Show loader when loading is true
        <div className="loader">Loading...</div>
      ) :
                <button type="submit" className="btn btn-primary">Login</button>}
            </form>
        </div>
    );
};

export default Login;
