import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setError(null);
        setLoading(true);
        try {
            await registerUser(data);
            reset(); // Clear form on success for good measure
            navigate('/validate', { state: { message: 'Registration successful! Please validate your mobile number.' } });
        } catch (err) {
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4" style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2 className="card-title text-center mb-4">Register</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        id="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        {...register('name', { required: 'Name is required' })}
                        disabled={loading}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                    <input
                        type="text"
                        id="mobileNumber"
                        className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                        {...register('mobileNumber', {
                            required: 'Mobile number is required',
                            pattern: {
                                value: /^[6-9][0-9]{9}$/,
                                message: 'Mobile number must be 10 digits starting with 6-9',
                            },
                        })}
                        disabled={loading}
                        maxLength={10}
                    />
                    {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Invalid email address',
                            },
                        })}
                        disabled={loading}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        })}
                        disabled={loading}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default RegisterForm;
