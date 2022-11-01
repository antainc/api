const ethers = require("ethers");
const { BigNumber } = ethers;
const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/9f6d45a043aa49cdafe3339691c1928a"
);

const totalSupply = ethers.utils.parseEther("1000000000");

export const getTotalSupply = () => {
  return 1000000000;
};

const ANT = ""; //contract not ready
const tokenABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
const vestingABI = [
  {
    stateMutability: "view",
    type: "function",
    name: "locked",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    gas: 50000,
  },
  {
    stateMutability: "view",
    type: "function",
    name: "total_locked",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    gas: 50000,
  },
];

const token = new ethers.Contract(ANT, tokenABI, provider);

export const getCirculatingSupply = async (vestingContracts: string[], unissuedHolders: string[]) => {
  console.log("\n");
  const unissuedAmountsBN = await Promise.all(
    unissuedHolders.map(getTokenBalance)
  );

  unissuedAmountsBN.forEach((la, idx) => {
    console.log(unissuedHolders[idx], ethers.utils.formatEther(la));
  });

  const unissuedTotal = unissuedAmountsBN.reduce(
    (acc: typeof BigNumber, u: typeof BigNumber) => acc.add(u),
    BigNumber.from(0)
  );
  const lockedAmounts = await getSumOfLockedAmounts(vestingContracts);
  const circulating = totalSupply.sub(unissuedTotal).sub(lockedAmounts);
  return parseFloat(ethers.utils.formatEther(circulating));
};

const getSumOfLockedAmounts = async (vestingContracts: string[]) => {
  const lockedAmounts = await Promise.all(
    vestingContracts.map((v) => {
      return (async () => {
        const vesting = new ethers.Contract(v, vestingABI, provider);
        const locked = await vesting.locked();
        return locked;
      })();
    })
  );

  lockedAmounts.forEach((la, idx) => {
    console.log(vestingContracts[idx], ethers.utils.formatEther(la));
  });

  return lockedAmounts.reduce(
    (acc: typeof BigNumber, u: typeof BigNumber) => acc.add(u),
    BigNumber.from(0)
  );
};

const getTokenBalance = async (address: string) => {
  const bal = await token.balanceOf(address);
  return bal;
};
