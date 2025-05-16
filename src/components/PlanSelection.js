import { useState, useEffect } from 'react';
import { getPlans } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

function PlanSelection() {
    const [plans, setPlans] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { state } = useLocation();
    const mobileNumber = state?.mobileNumber;

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getPlans();
                // console.debug('Plans API response:', data); // Commented out for production
                setPlans(data);
            } catch (err) {
                console.error('Plans fetch error:', err);
                setError('Failed to load plans: ' + (err.message || 'Unknown error'));
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handlePlanSelect = (plan) => {
        // console.debug('Selected plan:', plan);
        navigate('/payment', { state: { selectedPlan: plan, mobileNumber } });
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-5 fw-bold text-primary">
                Available Recharge Plans
            </h2>

            {loading && (
                <div className="alert alert-info text-center" role="alert">
                    Loading plans, please wait...
                </div>
            )}

            {error && (
                <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                >
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setError(null)}
                    ></button>
                </div>
            )}

            {!loading && Object.keys(plans).length === 0 && (
                <div className="alert alert-warning text-center" role="alert">
                    No plans available at the moment. Check back soon!
                </div>
            )}

            {!loading &&
                Object.keys(plans).map((category) => {
                    const categoryPlans = plans[category] || [];
                    return (
                        <section key={category} className="mb-5">
                            <h3 className="mb-3 border-bottom pb-2 text-secondary">{category}</h3>

                            {categoryPlans.length === 0 ? (
                                <p className="text-muted fst-italic">
                                    No plans available in this category.
                                </p>
                            ) : (
                                <div className="row gy-4">
                                    {categoryPlans.map((plan, index) => (
                                        <div
                                            key={plan.id || index}
                                            className="col-md-4"
                                        >
                                            <div
                                                className="card h-100 shadow-sm hover-shadow"
                                                style={{ cursor: plan.id ? 'pointer' : 'not-allowed' }}
                                                onClick={() => plan.id && handlePlanSelect(plan)}
                                            >
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title fw-semibold">
                                                        {plan.name || 'Unnamed Plan'}
                                                    </h5>
                                                    <p className="card-text mb-1">
                                                        <strong>Price:</strong> ₹{plan.amount ?? 'N/A'}
                                                    </p>
                                                    <p className="card-text mb-1">
                                                        <strong>Validity:</strong> {plan.validityDays ?? 'N/A'} days
                                                    </p>
                                                    <p className="card-text text-muted flex-grow-1">
                                                        {plan.description || 'No description provided.'}
                                                    </p>
                                                    <button
                                                        className="btn btn-primary mt-auto"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (plan.id) handlePlanSelect(plan);
                                                        }}
                                                        disabled={!plan.id}
                                                        aria-disabled={!plan.id}
                                                    >
                                                        Select Plan
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    );
                })}
        </div>
    );
}

export default PlanSelection;
