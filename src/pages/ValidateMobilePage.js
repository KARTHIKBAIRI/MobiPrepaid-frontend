import MobileValidationForm from '../components/MobileValidationForm';
import { useLocation } from 'react-router-dom';

function ValidateMobilePage() {
    const { state } = useLocation();

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-6">
                {state?.message && <div className="alert alert-success">{state.message}</div>}
                <MobileValidationForm />
            </div>
        </div>
    );
}

export default ValidateMobilePage;