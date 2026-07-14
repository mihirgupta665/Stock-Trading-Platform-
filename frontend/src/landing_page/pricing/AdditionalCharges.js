import React from 'react';

function AdditionalCharges() {
  return (
    <div className="container additional-charges-container mt-5 pt-3">
      
      {/* 1. Charges for account opening */}
      <div className="additional-section mb-5">
        <h2 className="additional-title mb-4">Charges for account opening</h2>
        <div className="table-responsive">
          <table className="table additional-table align-middle">
            <thead>
              <tr>
                <th style={{ width: '60%' }}>Type of account</th>
                <th style={{ width: '40%' }}>Charges</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Individual account</td>
                <td><span className="badge-free">FREE</span></td>
              </tr>
              <tr>
                <td>Minor account</td>
                <td><span className="badge-free">FREE</span></td>
              </tr>
              <tr>
                <td>NRI account</td>
                <td>₹ 500</td>
              </tr>
              <tr>
                <td>HUF account</td>
                <td>
                  <span className="badge-free">FREE</span> (online) / ₹ 500 (offline)
                </td>
              </tr>
              <tr>
                <td>Partnership, LLP, and Corporate accounts (offline only)</td>
                <td>₹ 500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Demat AMC */}
      <div className="additional-section mb-5">
        <h2 className="additional-title mb-4">Demat AMC (Annual Maintenance Charge)</h2>
        
        <div className="amc-callout mb-4">
          Free for first year*
        </div>

        <p className="amc-subtitle mb-3 text-muted">From second year onwards, for BSDA accounts:</p>
        
        <div className="table-responsive">
          <table className="table additional-table align-middle">
            <thead>
              <tr>
                <th style={{ width: '60%' }}>Value of holdings</th>
                <th style={{ width: '40%' }}>AMC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Up to ₹4 lakh</td>
                <td><span className="badge-free">FREE</span></td>
              </tr>
              <tr>
                <td>₹4 lakh – ₹10 lakh</td>
                <td>₹100 per year + 18% GST, charged quarterly</td>
              </tr>
              <tr>
                <td>Above ₹10 lakh</td>
                <td>₹300 per year + 18% GST, charged quarterly</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="amc-footer mt-4 text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>
          <p className="mb-2">For a non-BSDA account, AMC is ₹300 per year + 18% GST, regardless of holdings value, charged quarterly.</p>
          <p className="mb-2">To learn more about BSDA, <a href="#" className="amc-link">click here</a>. To learn more about AMC, <a href="#" className="amc-link">click here</a>.</p>
          <p className="small mb-0">*Resident individual accounts only.</p>
        </div>
      </div>

      {/* 3. Charges for optional value added services */}
      <div className="additional-section mb-5">
        <h2 className="additional-title mb-4">Charges for optional value added services</h2>
        <div className="table-responsive">
          <table className="table additional-table align-middle">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Service</th>
                <th style={{ width: '40%' }}>Billing Frequency</th>
                <th style={{ width: '30%' }}>Charges</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tickertape</td>
                <td>Monthly / Quarterly / Annual</td>
                <td>Free: 0 | Pro: 249/699/2399</td>
              </tr>
              <tr>
                <td>Smallcase</td>
                <td>Per transaction</td>
                <td>Buy & Invest More: 100 | SIP: 10</td>
              </tr>
              <tr>
                <td>Kite Connect</td>
                <td>Monthly</td>
                <td>Connect: 500 | Personal: Free</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default AdditionalCharges;
