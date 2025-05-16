import { useState, useEffect } from 'react';
import { getExpiringSubscribers } from '../services/api';
import { useNavigate } from 'react-router-dom';

function SubscriberTable() {
    const [subscribers, setSubscribers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const data = await getExpiringSubscribers();
                setSubscribers(data);
            } catch (err) {
                console.error('Failed to fetch expiring subscribers:', err);
                setError('Failed to load subscribers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchSubscribers();
    }, []);

    const handleViewHistory = (mobileNumber) => {
        navigate(`/admin/recharge-history/${mobileNumber}`);
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-3">Subscribers with Plans Expiring in 3 Days</h3>

            {loading && <div className="alert alert-info">Loading subscriber data...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && subscribers.length === 0 ? (
                <div className="alert alert-warning">No subscribers with expiring plans.</div>
            ) : (
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Mobile Number</th>
                            <th>Plan Name</th>
                            <th>Expiry Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.map((subscriber) => (
                            <tr key={subscriber.mobileNumber}>
                                <td>{subscriber.name || 'N/A'}</td>
                                <td>{subscriber.mobileNumber}</td>
                                <td>{subscriber.planName || 'N/A'}</td>
                                <td>
                                    {subscriber.expiryDate
                                        ? new Date(subscriber.expiryDate).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: '2-digit',
                                        })
                                        : 'N/A'}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleViewHistory(subscriber.mobileNumber)}
                                    >
                                        View History
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default SubscriberTable;
