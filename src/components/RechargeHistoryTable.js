import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRechargeHistory } from "../services/api";

function RechargeHistoryTable() {
  const { mobileNumber } = useParams();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRechargeHistory(mobileNumber);
        // console.debug("Recharge history data:", data);
        setHistory(data || []);
      } catch (err) {
        setError("Failed to load recharge history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [mobileNumber]);

  return (
    <div className="container py-4">
      <h3 className="mb-4 text-center text-primary fw-bold">
        Recharge History for {mobileNumber}
      </h3>

      {loading && (
        <div className="alert alert-info text-center" role="alert">
          Loading recharge history...
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

      {!loading && !error && history.length === 0 && (
        <div className="alert alert-warning text-center" role="alert">
          No recharge history available for this number.
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">Plan Name</th>
                <th scope="col">Recharge Date</th>
                <th scope="col">Payment Mode</th>
                <th scope="col" className="text-end">
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((recharge) => (
                <tr key={recharge.id}>
                  <td>{recharge.planName || "N/A"}</td>
                  <td>
                    {recharge.rechargeDate
                      ? new Date(recharge.rechargeDate).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )
                      : "N/A"}
                  </td>
                  <td>{recharge.paymentMode || "N/A"}</td>
                  <td className="text-end">
                    ₹{Math.floor(recharge.amount) || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RechargeHistoryTable;
