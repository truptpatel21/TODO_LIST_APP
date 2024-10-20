import React, { useState, useEffect } from 'react';
import Create from './Create';
import './App.css';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil } from 'react-icons/bs';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [updatetask, setUpdatetask] = useState('');
    const [taskid, setTaskid] = useState('');
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:5000/get', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(result => setTodos(result.data))
                .catch(err => console.log(err));
        }
    }, [token]);


useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
        setToken(savedToken);
        setLoggedIn(true); 
    }
}, []);

const login = () => {
    axios.post('http://localhost:5000/login', { username, password })
        .then(result => {
            setToken(result.data.token);
            localStorage.setItem('token', result.data.token); 
            setLoggedIn(true);
            setShowLogin(false);
        })
        .catch(err => console.log('Login failed', err));
};

const signup = () => {
    axios.post('http://localhost:5000/signup', { username, password })
        .then(result => {
            alert('Signup successful, you can now log in!');
        })
        .catch(err => console.log('Signup failed', err));
};

const toggleLoginView = () => {
    setShowLogin(!showLogin); 
};


const edit = (id) => {
        axios.put(`http://localhost:5000/edit/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(result => {
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, done: !todo.done };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    const Update = (id, updatedTask) => {
        axios.put(`http://localhost:5000/update/${id}`, { task: updatedTask }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(result => {
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, task: updatedTask };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
                setTaskid('');
                setUpdatetask('');
            })
            .catch(err => console.log(err));
    };

    const Hdelete = (id) => {
        axios.delete(`http://localhost:5000/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(result => {
                const updatedTodos = todos.filter(todo => todo._id !== id);
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    if (showLogin) {
        return (
            <div>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                /> <br/>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={login}>Login</button>
                <h2>Or Sign Up</h2>
                <button onClick={signup}>Sign Up</button>
            </div>
        );
    }

    return (
        <main>
            <button onClick={toggleLoginView}>Go to Login/Signup</button> 
            <Create />
            {
                todos.length === 0 ? <div className='task'>No tasks found</div> :
                    todos.map((todo) => (
                        <div className='task' key={todo._id}>
                            <div className='checkbox'>
                                {todo.done ? <BsFillCheckCircleFill className='icon' /> :
                                    <BsCircleFill className='icon' onClick={() => edit(todo._id)} />}
                                {taskid === todo._id ?
                                    <input type='text' value={updatetask} onChange={e => setUpdatetask(e.target.value)} />
                                    :
                                    <p className={todo.done ? 'through' : 'normal'}>{todo.task}</p>
                                }
                            </div>
                            <div>
                                <span>
                                    <BsPencil className='icon' onClick={() => {
                                        if (taskid === todo._id) {
                                            Update(todo._id, updatetask);
                                        } else {
                                            setTaskid(todo._id);
                                            setUpdatetask(todo.task);
                                        }
                                    }} />
                                    <BsFillTrashFill className='icon' onClick={() => Hdelete(todo._id)} />
                                </span>
                            </div>
                        </div>
                    ))
            }
        </main>
    );
};

export default Home;