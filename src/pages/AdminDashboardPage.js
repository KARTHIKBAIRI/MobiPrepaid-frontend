import SubscriberTable from '../components/SubscriberTable';

function AdminDashboardPage() {
    return (
        <div className="row">
            <div className="col">
                <h2>Admin Dashboard</h2>
                <SubscriberTable />
            </div>
        </div>
    );
}

export default AdminDashboardPage;