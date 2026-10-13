import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import Identicon from "./Identicon";
import { truncate } from "../store";
import { listVoters } from "../Blockchain.services";

const Voters = () => {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadVoters = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await listVoters(id);

        if (!cancelled) {
          setData(result || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load voters");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadVoters();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const timeAgo = (timestamp) => {
    return moment(Number(timestamp) * 1000).fromNow();
  };

  const voters = data.filter((vote) => {
    if (filter === "accepted") return vote.choosen;
    if (filter === "rejected") return !vote.choosen;
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
          className={filter === "accepted" ? active : deactive}
          onClick={() => setFilter("accepted")}
        >
          Acceptees
        </button>

        <button
          type="button"
          className={`rounded-r-full ${
            filter === "rejected" ? active : deactive
          }`}
          onClick={() => setFilter("rejected")}
        >
          Rejectees
        </button>
      </div>

      {loading && <p className="text-center mt-6">Loading voters...</p>}

      {error && <p className="text-center mt-6 text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto mt-5">
          <div className="py-2 inline-block min-w-full">
            <div className="overflow-y-auto shadow-md rounded-md">
              <table className="min-w-full">
                <thead className="border-b dark:border-gray-500">
                  <tr>
                    <th className="text-sm font-medium px-6 py-4 text-left">
                      Voter
                    </th>
                    <th className="text-sm font-medium px-6 py-4 text-left">
                      Voted
                    </th>
                    <th className="text-sm font-medium px-6 py-4 text-left">
                      Vote
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {voters.map((voter, i) => (
                    <tr
                      key={`${voter.voter}-${i}`}
                      className="border-b dark:border-gray-500 transition duration-300 ease-in-out"
                    >
                      <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-row justify-start items-center space-x-3">
                          <Identicon
                            string={voter.voter.toLowerCase()}
                            size={25}
                            className="rounded-full mr-3"
                          />

                          <span>{truncate(voter.voter, 4, 4, 11)}</span>
                        </div>
                      </td>

                      <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                        {timeAgo(voter.timestamp)}
                      </td>

                      <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                        {voter.choosen ? (
                          <span className="inline-block border-2 rounded-full px-6 py-2.5 border-blue-600 text-blue-600 font-medium text-xs uppercase">
                            Accepted
                          </span>
                        ) : (
                          <span className="inline-block border-2 rounded-full px-6 py-2.5 border-red-600 text-red-600 font-medium text-xs uppercase">
                            Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {voters.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center px-6 py-8">
                        No voters found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voters;
