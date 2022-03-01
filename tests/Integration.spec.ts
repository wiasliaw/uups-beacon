import { expect, use } from 'chai';
import { ethers, waffle } from 'hardhat';

import { BoxV1, BoxV2, UUPSProxy, UUPSBeacon } from '../dist/types';

use(waffle.solidity);

describe('Integration Test', () => {
  let v1: BoxV1;
  let v2: BoxV2;
  let beacon: UUPSBeacon;
  let proxy: UUPSProxy;

  beforeEach(async () => {
    v1 = await (await ethers.getContractFactory('BoxV1')).deploy() as BoxV1;
    await v1.deployed();

    v2 = await (await ethers.getContractFactory('BoxV2')).deploy() as BoxV2;
    await v2.deployed();

    beacon = await (await ethers.getContractFactory('UUPSBeacon'))
      .deploy(v1.address, '0x') as UUPSBeacon;
    await beacon.deployed();

    proxy = await (await ethers.getContractFactory('UUPSProxy'))
      .deploy(beacon.address, '0x') as UUPSProxy;
    await proxy.deployed();
  });

  describe('Box', async () => {
    it('init revert', async () => {
      await expect(v1.initialize()).reverted;
    });

    it('set/get', async () => {
      await v1.set(11);
      expect(await v1.get()).eq(11);
    });
  });

  describe('beacon', () => {
    it('v1 get/set', async () => {
      // v1 logic
      await v1.attach(beacon.address).set(11);
      expect(await v1.attach(beacon.address).get()).eq(11);
    });

    it('v2 upgrade', async () => {
      // able to upgrade through beacon
      await expect(beacon.upgradeTo(v2.address))
        .emit(beacon, 'Upgraded')
        .withArgs(v2.address);
      // v2 logic
      await v2.attach(beacon.address).set(12);
      expect(await v2.attach(beacon.address).get()).eq(22);
    });
  });

  describe('proxy', () => {
    it('v1 echo', async () => {
      await v1.attach(proxy.address).set(11);
      expect(await v1.attach(proxy.address).callStatic.get()).eq(11);
    });

    it('v2 upgrade should revert', async () => {
      await expect(beacon.attach(proxy.address).upgradeTo(v2.address))
        .reverted;
    });
  });
});
