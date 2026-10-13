import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { setGlobalState, useGlobalState } from "../store";
import { raiseProposal } from "../Blockchain.services";
import { toast } from "react-toastify";

const CreateProposal = () => {
  const [createModal] = useGlobalState("createModal");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const closeModal = () => {
    setGlobalState("createModal", "scale-0");
    setTitle("");
    setAmount("");
    setBeneficiary("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !beneficiary || !amount) return;
    if (submitting) return;

    try {
      setSubmitting(true);

      await raiseProposal({
        title,
        description,
        beneficiary,
        amount,
      });

      toast.success("Proposal created successfully");
      closeModal();
    } catch (error) {
      toast.error(
        error.shortMessage || error.message || "Failed to create proposal",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${createModal}`}
    >
      <div className="bg-white dark:bg-[#212936] shadow-xl rounded-xl w-11/12 md:w-2/5 p-6">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Raise Proposal</p>
            <button
              type="button"
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <input
            className="block w-full p-3 text-sm bg-transparent border border-gray-500 rounded-xl mt-5"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="block w-full p-3 text-sm bg-transparent border border-gray-500 rounded-xl mt-5"
            type="number"
            min="0"
            step="any"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            className="block w-full p-3 text-sm bg-transparent border border-gray-500 rounded-xl mt-5"
            type="text"
            placeholder="Beneficiary Wallet Address"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
            required
          />

          <textarea
            className="block w-full p-3 text-sm bg-transparent border border-gray-500 rounded-xl mt-5"
            placeholder="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="inline-block px-6 py-2.5 mt-5 bg-blue-600 text-white font-medium text-xs uppercase rounded-full hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Submit Proposal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProposal;
