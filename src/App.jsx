import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [alldata, setAlldata] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [id, setId] = useState(undefined);
  const selectRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`https://660bdae33a0766e85dbcb367.mockapi.io/api/v1/todo_app`);
        setAlldata(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [isRefresh]);

  const handleSelectChange = async (event, id) => {
    const selectData = event.target.value;
    const selectRef = event.target;

    if (selectData == 'Complete') {
      selectRef.style.backgroundColor = 'lightgreen';
    } else if (selectData == 'notCompleted') {
      selectRef.style.backgroundColor = 'lightcoral';
    }

    try {
      await axios.put(`https://660bdae33a0766e85dbcb367.mockapi.io/api/v1/todo_app/${id}`, {
        status: selectData
      });
      setIsRefresh(!isRefresh);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const createTodo = async () => {
    try {
      await axios.post(`https://660bdae33a0766e85dbcb367.mockapi.io/api/v1/todo_app`, {
        name: name,
        Description: description,
      });
      setIsRefresh(!isRefresh);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const editTodo = async () => {
    try {
      await axios.put(`https://660bdae33a0766e85dbcb367.mockapi.io/api/v1/todo_app/${id}`, {
        name: name,
        Description: description,
      });
      setIsRefresh(!isRefresh);
      setName('');
      setDescription('');
      setId(undefined);
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const removeTodo = async (id) => {
    try {
      await axios.delete(`https://660bdae33a0766e85dbcb367.mockapi.io/api/v1/todo_app/${id}`);
      setIsRefresh(!isRefresh);
    } catch (error) {
      console.error('Error removing todo:', error);
    }
  };

  return (
    <div className='container'>
      <div className='row header md-10'>
        <h3>My ToDo</h3>
      </div>
      <div className='row todoDiv md-10'>
        <div className='col-lg-4 col-sm-2'>
          <input type="text" className="form-control" placeholder="Todo Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className='col-lg-4 col-sm-2'>
          <input type="text" className="form-control" placeholder="Todo Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className='col-lg-2'>
          <button className='btn btn-success' onClick={id ? editTodo : createTodo}>Add Todo</button>
        </div>
      </div>
      <div className='demo md-10'>
        {alldata.map((element) => (
          <div className='card md-10' key={element.id}>
            <div className='card-body'>
              <span>{`Name : ${element.name}`}</span><br />
              <span>{`Description : ${element.Description}`}</span><br />
              <label>Status: </label>
              <select name="status"  ref={selectRef} className='status' value={element.status} onChange={(e) => handleSelectChange(e, element.id)}>
                <option value="Complete">Completed</option>
                <option value="notCompleted">Not Completed</option>
              </select>
            </div>
            <div className='card-footer'>
              <button type="button" className="btn btn-success btn-sm editbtn" onClick={() => { setId(element.id); setName(element.name); setDescription(element.Description) }}>Edit</button>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeTodo(element.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
