import React from "react";

const currencyCharges = [
  {
    charge: "Brokerage",
    futures: "0.03% or ₹20/executed order whichever is lower",
    options: "₹20/executed order",
  },
  {
    charge: "STT/CTT",
    futures: "No STT",
    options: "No STT",
  },
  {
    charge: "Transaction charges",
    futures: (
      <>
        NSE: 0.00035%
        <br />
        BSE: 0.00045%
      </>
    ),
    options: (
      <>
        NSE: 0.0311%
        <br />
        BSE: 0.001%
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
    futures: "₹10 / crore",
    options: "₹10 / crore",
  },
  {
    charge: "Stamp charges",
    futures: "0.0001% or ₹10 / crore on buy side",
    options: "0.0001% or ₹10 / crore on buy side",
  },
];

function Currency() {
  return (
    <>
      <div className="table-responsive">

        <table className="table brokerage-table align-middle">

          <thead>

            <tr>
              <th></th>
              <th>Currency futures</th>
              <th>Currency options</th>
            </tr>

          </thead>

          <tbody>

            {currencyCharges.map((row) => (

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
          href="#"
          className="brokerage-calculator-link"
        >
          Calculate your costs upfront using our brokerage calculator
        </a>

      </div>
    </>
  );
}

export default Currency;