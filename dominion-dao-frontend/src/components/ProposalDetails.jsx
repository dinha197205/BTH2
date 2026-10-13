import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";
import { getProposal, voteOnProposal } from "../Blockchain.services";
import { useGlobalState, daysRemaining } from "../store";

const ProposalDetails = () => {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [data, setData] = useState([]);
  const [isStakeholder] = useGlobalState("isStakeholder");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const retrieveProposal = async () => {
      try {
        const result = await getProposal(id);

        if (!result) return;

        setProposal(result);
        setData([
          {
            name: "Voters",
            Acceptees: Number(result.upvotes),
            Rejectees: Number(result.downvotes),
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    retrieveProposal();
  }, [id]);

  const onVote = async (choice) => {
    if (!proposal || submitting) return;

    if (Date.now() > Number(proposal.duration) * 1000) {
      toast.warning("Proposal expired!");
      return;
    }

    try {
      setSubmitting(true);
      await voteOnProposal(id, choice);
      toast.success("Voted successfully!");
    } catch (error) {
      toast.error(error.shortMessage || error.message || "Voting failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!proposal) {
    return (
      <div className="p-8">
        <p>Proposal not found or not loaded yet.</p>
      </div>
    );
  }

  const totalVotes = Number(proposal.upvotes) + Number(proposal.downvotes);

  return (
    <div className="p-8">
      <h2 className="font-semibold text-3xl mb-5">{proposal.title}</h2>

      <p>
        This proposal is to payout <strong>{proposal.amount} Eth</strong> and
        currently has <strong>{totalVotes} votes</strong> and will expire in{" "}
        <strong>{daysRemaining(proposal.duration)}</strong>
      </p>

      <hr className="my-6 border-gray-300" />

      <p>{proposal.description}</p>

      <div className="flex flex-row justify-start items-center w-full mt-4 overflow-auto">
        <BarChart width={730} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Acceptees" fill="#2563eb" />
          <Bar dataKey="Rejectees" fill="#dc2626" />
        </BarChart>
      </div>

      <div
        className="flex flex-row justify-start items-center space-x-3 mt-4"
        role="group"
      >
        {isStakeholder ? (
          <>
            <button
              type="button"
              disabled={submitting}
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs uppercase rounded-full shadow-md hover:bg-blue-700 disabled:opacity-50"
              onClick={() => onVote(true)}
            >
              Accept
            </button>

            <button
              type="button"
              disabled={submitting}
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs uppercase rounded-full shadow-md hover:bg-blue-700 disabled:opacity-50"
              onClick={() => onVote(false)}
            >
              Reject
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProposalDetails;
