import Identicon from "./Identicon";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { truncate, useGlobalState, daysRemaining } from "../store";
import { payoutBeneficiary } from "../Blockchain.services";
import { toast } from "react-toastify";

const Proposals = () => {
  const [data] = useGlobalState("proposals");
  const [filter, setFilter] = useState("all");
  const [payingId, setPayingId] = useState(null);

  const now = Date.now();

  const proposals = data.filter((proposal) => {
    const expired = now > Number(proposal.duration) * 1000;

    if (filter === "open") return !expired;
    if (filter === "closed") return expired;

    return true;
  });

  const deactive = `
    bg-transparent text-blue-600 font-medium text-xs
    uppercase hover:bg-blue-700 hover:text-white
    border border-blue-600 px-6 py-2.5
    transition duration-150 ease-in-out
  `;

  const active = `
    bg-blue-600 text-white font-medium text-xs
    uppercase hover:bg-blue-700
    border border-blue-600 px-6 py-2.5
    transition duration-150 ease-in-out
  `;

  const handlePayout = async (id) => {
    if (payingId !== null) return;

    try {
      setPayingId(id);
      await payoutBeneficiary(id);
      toast.success("Beneficiary successfully Paid Out!");
    } catch (error) {
      toast.error(error.shortMessage || error.message || "Payout failed");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="flex flex-col p-8">
      <div className="flex flex-row justify-center items-center" role="group">
        <button
          type="button"
          className={`rounded-l-full ${filter === "all" ? active : deactive}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          type="button"
          className={filter === "open" ? active : deactive}
          onClick={() => setFilter("open")}
        >
          Open
        </button>

        <button
          type="button"
          className={`rounded-r-full ${
            filter === "closed" ? active : deactive
          }`}
          onClick={() => setFilter("closed")}
        >
          Closed
        </button>
      </div>

      <div className="overflow-x-auto mt-5">
        <div className="py-2 inline-block min-w-full">
          <div className="overflow-y-auto shadow-md rounded-md">
            <table className="min-w-full">
              <thead className="border-b dark:border-gray-500">
                <tr>
                  <th className="text-sm font-medium px-6 py-4 text-left">
                    Created By
                  </th>
                  <th className="text-sm font-medium px-6 py-4 text-left">
                    Title
                  </th>
                  <th className="text-sm font-medium px-6 py-4 text-left">
                    Expires
                  </th>
                  <th className="text-sm font-medium px-6 py-4 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {proposals.map((proposal) => {
                  const expired = Date.now() > Number(proposal.duration) * 1000;

                  const approved =
                    Number(proposal.upvotes) > Number(proposal.downvotes);

                  return (
                    <tr
                      key={proposal.id.toString()}
                      className="border-b dark:border-gray-500"
                    >
                      <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-row justify-start items-center space-x-3">
                          <Identicon
                            string={proposal.proposer.toLowerCase()}
                            size={25}
                          />

                          <span>{truncate(proposal.proposer, 4, 4, 11)}</span>
                        </div>
                      </td>

                      <td className="text-sm font-light px-6 py-4">
                        {proposal.title.length > 80
                          ? proposal.title.substring(0, 80) + "..."
                          : proposal.title}
                      </td>

                      <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                        {expired ? "Expired" : daysRemaining(proposal.duration)}
                      </td>

                      <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-row items-center space-x-3">
                          <Link
                            to={"/proposal/" + proposal.id}
                            className="rounded-full px-6 py-2.5 text-white bg-blue-600 font-medium text-xs uppercase hover:bg-blue-700"
                          >
                            View
                          </Link>

                          {expired &&
                            (approved ? (
                              proposal.paid ? (
                                <span className="rounded-full px-6 py-2.5 text-white bg-green-600 text-xs font-medium uppercase">
                                  Paid
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={payingId !== null}
                                  className="rounded-full px-6 py-2.5 text-white bg-red-600 text-xs font-medium uppercase hover:bg-red-700 disabled:opacity-50"
                                  onClick={() => handlePayout(proposal.id)}
                                >
                                  {payingId === proposal.id
                                    ? "Processing..."
                                    : "Payout"}
                                </button>
                              )
                            ) : (
                              <span className="rounded-full px-6 py-2.5 text-white bg-red-600 text-xs font-medium uppercase">
                                Rejected
                              </span>
                            ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {proposals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center px-6 py-8">
                      No proposals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposals;
