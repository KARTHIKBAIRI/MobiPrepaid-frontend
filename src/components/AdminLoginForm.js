import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginAdmin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminLoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const token = await loginAdmin(data);
            login(token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div
            className="card shadow-lg rounded-4 p-4"
            style={{ maxWidth: '400px', margin: '6rem auto', backgroundColor: '#f9fafb' }}
        >
            <h2 className="card-title text-center mb-4 fw-bold text-primary">
                Admin Login
            </h2>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setError(null)}
                    ></button>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-floating mb-4">
                    <input
                        type="text"
                        className={`form-control form-control-lg ${errors.username ? 'is-invalid' : ''}`}
                        id="username"
                        placeholder="Username"
                        {...register('username', { required: 'Username is required' })}
                    />
                    <label htmlFor="username">👤 Username</label>
                    {errors.username && (
                        <div className="invalid-feedback">{errors.username.message}</div>
                    )}
                </div>

                <div className="form-floating mb-4">
                    <input
                        type="password"
                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        placeholder="Password"
                        {...register('password', { required: 'Password is required' })}
                    />
                    <label htmlFor="password">🔒 Password</label>
                    {errors.password && (
                        <div className="invalid-feedback">{errors.password.message}</div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm">
                    Login
                </button>
            </form>
        </div>
    );
}

export default AdminLoginForm;
