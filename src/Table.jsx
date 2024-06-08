import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Table = () => {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/user')
            .then(res => setData(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleForm = (event) => {
        event.preventDefault();
        const id = data.length + 1;

        axios.post('http://localhost:3000/user', { id, name, email })
            .then(res => {
                setData(prevData => [...prevData, res.data]);
                setName('');
                setEmail('');
            })
            .catch(err => console.log(err));
    };

    const handleEdit = (id) => {
        const user = data.find(item => item.id === id);
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setEditId(id);
        }
    };

    const handleUpdate = (event) => {
        event.preventDefault();

        axios.put('http://localhost:3000/user/' + editId, { id: editId, name, email })
            .then(res => {
                setData(prevData => prevData.map(item => item.id === editId ? res.data : item));
                setEditId(null);
                setName('');
                setEmail('');
            })
            .catch(err => console.log(err));
    };

    const handleDelete = (id) => {
        axios.delete('http://localhost:3000/user/' + id)
            .then(() => {
                setData(prevData => prevData.filter(item => item.id !== id));
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='container'>
            <div>
                <form onSubmit={editId !== null ? handleUpdate : handleForm}>
                    <input
                        type='text'
                        placeholder='Name'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    />
                    <button style={{ marginLeft: '10px' }}>
                        {editId !== null ? 'Update' : 'Add'}
                    </button>
                </form>
            </div>
            <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                <table className='table-border'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>
                                    {editId === item.id ? (
                                        <input
                                            type='text'
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    ) : (
                                        item.name
                                    )}
                                </td>
                                <td>
                                    {editId === item.id ? (
                                        <input
                                            type='email'
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    ) : (
                                        item.email
                                    )}
                                </td>
                                <td>{item.age}</td>
                                <td>
                                    {editId === item.id ? (
                                        <button onClick={handleUpdate}>Update</button>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(item.id)}>Edit</button>
                                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
