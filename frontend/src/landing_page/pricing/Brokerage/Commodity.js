import React from "react";

const commodityCharges = [
  {
    charge: "Brokerage",
    futures: "0.03% or ₹20/executed order whichever is lower",
    options: "₹20/executed order",
  },
  {
    charge: "STT/CTT",
    futures: "0.01% on sell side (Non-Agri)",
    options: "0.05% on sell side",
  },
  {
    charge: "Transaction charges",
    futures: (
      <>
        MCX: 0.0021%
        <br />
        NSE: 0.0001%
      </>
    ),
    options: (
      <>
        MCX: 0.0418%
        <br />
        NSE: 0.001%
      </>
    ),
  },
  {
    charge: "GST",
    futures: "18% on (brokerage + SEBI charges + transaction charges)",
    options: "18% on (brokerage + SEBI charges + transaction charges)",
  },
  {
    charge: "SEBI charges",
    futures: (
      <>
        Agri:
        <br />
        ₹1 / crore
        <br />
        Non-agri:
        <br />
        ₹10 / crore
      </>
    ),
    options: "₹10 / crore",
  },
  {
    charge: "Stamp charges",
    futures: "0.002% or ₹200 / crore on buy side",
    options: "0.003% or ₹300 / crore on buy side",
  },
];

function Commodity() {
  return (
    <>
      <div className="table-responsive">

        <table className="table brokerage-table align-middle">

          <thead>

            <tr>
              <th></th>
              <th>Commodity futures</th>
              <th>Commodity options</th>
            </tr>

          </thead>

          <tbody>

            {commodityCharges.map((row) => (

              <tr key={row.charge}>

                <td className="charge-title">
                  {row.charge}
                </td>

                <td>{row.futures}</td>

                <td>{row.options}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="text-center mt-4">

        <a
          href="/"
          className="brokerage-calculator-link"
        >
          Calculate your costs upfront using our brokerage calculator
        </a>

      </div>
    </>
  );
}

export default Commodity;