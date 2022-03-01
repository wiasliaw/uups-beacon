import { expect, use } from 'chai';
import { ethers, waffle } from 'hardhat';
import { simpleFixture } from './shared/index';

import { Wallet } from 'ethers';
import { Simple } from '../dist/types';

use(waffle.solidity);

describe('Simple', () => {
  let user: Wallet, other: Wallet;
  let simple: Simple;
  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;

  before('create fixture loader', async () => {
    [user, other] = await (ethers as any).getSigners();
    loadFixture = waffle.createFixtureLoader([user, other]);
  });

  beforeEach('deploy fixture', async () => {
    ({ simple } = await loadFixture(simpleFixture));
  });

  it('set/get', async () => {
    await simple.set(33);
    expect(await simple.get()).to.eq(33);
  });
});
