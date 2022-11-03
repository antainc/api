import { NextApiRequest, NextApiResponse } from 'next';
import { getCirculatingSupply } from './_utils';

const vestingContracts = [
  ""
];

const unissuedHolders = [
  "", // DAO vesting
  "", // Team
  "", // Corporate property
  "", // Airdrop contract
];


export default async function handler(
  _: NextApiRequest,
  response: NextApiResponse,
) {
  const circulatingSupply = await getCirculatingSupply(vestingContracts, unissuedHolders)
  response.status(200).send(circulatingSupply.toFixed(8));
}
