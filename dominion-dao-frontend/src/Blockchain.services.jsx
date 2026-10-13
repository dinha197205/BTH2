import Web3 from "web3";
import { setGlobalState, getGlobalState } from "./store";
import abi from "./abi/DominionDAO-ABI.json";

// Dia chi Smart Contract da deploy len Sepolia
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

// Ethereum Sepolia Testnet
const SEPOLIA_CHAIN_ID = "0xaa36a7";

// Lay provider MetaMask
const getEthereum = () => window.ethereum;

// Khoi tao Web3 khi can su dung
const getWeb3 = () => {
  const ethereum = getEthereum();

  if (!ethereum) {
    throw new Error("Please install MetaMask");
  }

  return new Web3(ethereum);
};

// Kiem tra dung mang Sepolia
const checkNetwork = async () => {
  const ethereum = getEthereum();

  if (!ethereum) {
    throw new Error("Please install MetaMask");
  }

  const chainId = await ethereum.request({
    method: "eth_chainId",
  });

  if (chainId.toLowerCase() !== SEPOLIA_CHAIN_ID) {
    throw new Error("Please switch MetaMask to Ethereum Sepolia Testnet");
  }
};

// 1. Ket noi MetaMask
const connectWallet = async () => {
  try {
    const ethereum = getEthereum();

    if (!ethereum) {
      alert("Please install MetaMask");
      return;
    }

    await checkNetwork();

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts.length) {
      throw new Error("No wallet account found");
    }

    setGlobalState("connectedAccount", accounts[0].toLowerCase());

    return accounts[0];
  } catch (error) {
    reportError(error);
    throw error;
  }
};

// 2. Kiem tra vi da ket noi
const isWallectConnected = async () => {
  try {
    const ethereum = getEthereum();

    if (!ethereum) {
      console.log("Please install MetaMask");
      return;
    }

    const accounts = await ethereum.request({
      method: "eth_accounts",
    });

    const chainId = await ethereum.request({
      method: "eth_chainId",
    });

    if (accounts.length > 0 && chainId.toLowerCase() === SEPOLIA_CHAIN_ID) {
      setGlobalState("connectedAccount", accounts[0].toLowerCase());
    } else {
      setGlobalState("connectedAccount", "");
    }

    return accounts;
  } catch (error) {
    reportError(error);
  }
};

// Cap nhat giao dien khi doi tai khoan hoac mang
if (typeof window !== "undefined" && window.ethereum) {
  window.ethereum.on("accountsChanged", () => {
    window.location.reload();
  });

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });
}

// 3. Lay doi tuong Smart Contract
const getEtheriumContract = async () => {
  const ethereum = getEthereum();

  if (!ethereum) {
    throw new Error("Please install MetaMask");
  }

  await checkNetwork();

  if (!contractAddress) {
    throw new Error("VITE_CONTRACT_ADDRESS is missing from .env");
  }

  const web3 = getWeb3();

  const contract = new web3.eth.Contract(abi, contractAddress);

  setGlobalState("contract", contract);

  return contract;
};

// 4. Dong gop ETH cho DAO
const performContribute = async (amount) => {
  try {
    const contract = await getEtheriumContract();

    const account = getGlobalState("connectedAccount");

    if (!account) {
      throw new Error("Please connect your wallet first");
    }

    if (!amount || Number(amount) <= 0) {
      throw new Error("Contribution must be greater than zero");
    }

    const value = getWeb3().utils.toWei(amount.toString(), "ether");

    const receipt = await contract.methods.contribute().send({
      from: account,
      value: value,
    });

    await getInfo();

    return receipt;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

// 5. Lay thong tin DAO
const getInfo = async () => {
  try {
    const account = getGlobalState("connectedAccount");

    if (!account) {
      return;
    }

    const contract = await getEtheriumContract();
    const web3 = getWeb3();

    const isStakeholder = await contract.methods
      .isStakeholder()
      .call({ from: account });

    const balance = await contract.methods.daoBalance().call();

    const mybalance = await contract.methods
      .getBalance()
      .call({ from: account });

    setGlobalState("balance", web3.utils.fromWei(balance.toString(), "ether"));

    setGlobalState(
      "mybalance",
      web3.utils.fromWei(mybalance.toString(), "ether"),
    );

    setGlobalState("isStakeholder", isStakeholder);

    return {
      isStakeholder,
      balance,
      mybalance,
    };
  } catch (error) {
    reportError(error);
    throw error;
  }
};

// 6. Tao de xuat moi
const raiseProposal = async ({ title, description, beneficiary, amount }) => {
  try {
    const contract = await getEtheriumContract();
    const account = getGlobalState("connectedAccount");

    if (!account) {
      throw new Error("Please connect your wallet first");
    }

    const web3 = getWeb3();

    const value = web3.utils.toWei(amount.toString(), "ether");

    const receipt = await contract.methods
      .createProposal(title, description, beneficiary, value)
      .send({ from: account });

    await getProposals();

    return receipt;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

// 7. Chuyen du lieu Proposal thanh dang de su dung
const structuredProposals = (proposals) => {
  const web3 = getWeb3();

  return proposals
    .map((proposal) => ({
      id: proposal.id.toString(),
      amount: web3.utils.fromWei(proposal.amount.toString(), "ether"),
      title: proposal.title,
      description: proposal.description,
      paid: proposal.paid,
      passed: proposal.passed,
      proposer: proposal.proposer,
      upvotes: Number(proposal.upvotes),
      downvotes: Number(proposal.downvotes),
      beneficiary: proposal.beneficiary,
      executor: proposal.executor,
      duration: proposal.duration.toString(),
    }))
    .reverse();
};

// 8. Lay danh sach de xuat
const getProposals = async () => {
  try {
    const contract = await getEtheriumContract();

    const proposals = await contract.methods.getProposals().call();

    const formatted = structuredProposals(proposals);

    setGlobalState("proposals", formatted);

    return formatted;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

// 9. Lay chi tiet mot de xuat
const getProposal = async (id) => {
  try {
    const proposals = getGlobalState("proposals");

    return proposals.find(
      (proposal) => proposal.id.toString() === id.toString(),
    );
  } catch (error) {
    reportError(error);
    throw error;
  }
};

// 10. Bo phieu cho de xuat
const voteOnProposal = async (proposalId, supported) => {
  try {
    const contract = await getEtheriumContract();

    const account = getGlobalState("connectedAccount");

    if (!account) {
      throw new Error("Please connect your wallet first");
    }

    const receipt = await contract.methods
      .performVote(proposalId, supported)
      .send({ from: account });

    await getProposals();

    return receipt;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

// 11. Lay danh sach nguoi bo phieu
const listVoters = async (id) => {
  try {
    const contract = await getEtheriumContract();

    const votes = await contract.methods.getVotesOf(id).call();

    return votes;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

// 12. Thanh toan cho nguoi thu huong
const payoutBeneficiary = async (id) => {
  try {
    const contract = await getEtheriumContract();

    const account = getGlobalState("connectedAccount");

    if (!account) {
      throw new Error("Please connect your wallet first");
    }

    const receipt = await contract.methods
      .payBeneficiary(id)
      .send({ from: account });

    await getProposals();
    await getInfo();

    return receipt;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

// Xu ly loi
const reportError = (error) => {
  console.error("Blockchain error:", error);
};

// Xuat cac ham cho giao dien React
export {
  isWallectConnected,
  connectWallet,
  getEtheriumContract,
  performContribute,
  getInfo,
  raiseProposal,
  getProposals,
  getProposal,
  voteOnProposal,
  listVoters,
  payoutBeneficiary,
};
