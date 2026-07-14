import React from "react";

const equityCharges = [
    {
        charge: "Brokerage",
        equityDelivery: "Zero Brokerage",
        equityIntraday: "0.03% or ₹20/executed order whichever is lower",
        futures: "0.03% or ₹20/executed order whichever is lower",
        options: "Flat ₹20 per executed order",
    },
    {
        charge: "STT/CTT",
        equityDelivery: "0.1% on buy & sell",
        equityIntraday: "0.025% on the sell side",
        futures: "0.05% on the sell side",
        options: [
            "0.15% of the intrinsic value on options that are bought and exercised",
            "0.15% on sell side (on premium)",
        ],
    },
    {
        charge: "Transaction charges",
        equityDelivery: (
            <>
                NSE: 0.00307%
                <br />
                BSE: 0.00375%
            </>
        ),
        equityIntraday: (
            <>
                NSE: 0.00307%
                <br />
                BSE: 0.00375%
            </>
        ),
        futures: (
            <>
                NSE: 0.00183%
                <br />
                BSE: 0
            </>
        ),
        options: (
            <>
                NSE: 0.03553% (on premium)
                <br />
                BSE: 0.0325% (on premium)
            </>
        ),
    },
    {
        charge: "GST",
        equityDelivery: "18% on (brokerage + SEBI charges + transaction charges)",
        equityIntraday: "18% on (brokerage + SEBI charges + transaction charges)",
        futures: "18% on (brokerage + SEBI charges + transaction charges)",
        options: "18% on (brokerage + SEBI charges + transaction charges)",
    },
    {
        charge: "SEBI charges",
        equityDelivery: "₹10 / crore",
        equityIntraday: "₹10 / crore",
        futures: "₹10 / crore",
        options: "₹10 / crore",
    },
    {
        charge: "Stamp charges",
        equityDelivery: "0.015% or ₹1500 / crore on buy side",
        equityIntraday: "0.003% or ₹300 / crore on buy side",
        futures: "0.002% or ₹200 / crore on buy side",
        options: "0.003% or ₹300 / crore on buy side",
    },
];

function Equity() {
    return (
        <>
            <div className="table-responsive">

                <table className="table brokerage-table align-middle">

                    <thead>

                        <tr>

                            <th></th>

                            <th>Equity delivery</th>

                            <th>Equity intraday</th>

                            <th>F&amp;O - Futures</th>

                            <th>F&amp;O - Options</th>

                        </tr>

                    </thead>

                    <tbody>

                        {equityCharges.map((row) => (

                            <tr key={row.charge}>

                                <td className="charge-title">
                                    {row.charge}
                                </td>

                                <td>{row.equityDelivery}</td>

                                <td>{row.equityIntraday}</td>

                                <td>{row.futures}</td>

                                <td>

                                    {Array.isArray(row.options) ? (

                                        <ul className="mb-0 ps-3">

                                            {row.options.map((item, index) => (

                                                <li key={index}>
                                                    {item}
                                                </li>

                                            ))}

                                        </ul>

                                    ) : (

                                        row.options

                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            <div className="text-center mt-4">

                <a href="#calculator" className="brokerage-calculator-link">

                    Calculate your costs upfront using our brokerage calculator

                </a>

            </div>
        </>
    );
}

export default Equity;