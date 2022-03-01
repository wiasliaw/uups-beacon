import { ethers } from 'hardhat';

import { Fixture } from 'ethereum-waffle';
import { Simple } from '../../dist/types';

interface SimpleFixture {
  simple: Simple;
}

export const simpleFixture: Fixture<SimpleFixture> =
  async function (): Promise<SimpleFixture> {
    const simple = (await (
      await ethers.getContractFactory('Simple')
    ).deploy()) as Simple;
    await simple.deployed();

    return {
      simple,
    };
  };
