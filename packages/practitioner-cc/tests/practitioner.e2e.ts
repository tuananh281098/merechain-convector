// tslint:disable:no-unused-expression
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import 'mocha';

import { CouchDBStorage } from '@worldsibu/convector-storage-couchdb';
import { FabricControllerAdapter } from '@worldsibu/convector-platform-fabric';
import { BaseStorage, ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';

import { Practitioner, PractitionerController } from '../src';

describe('Practitioner', () => {
  let adapter: FabricControllerAdapter;
  let practitionerCtrl: ConvectorControllerClient<PractitionerController>;

  before(async () => {
      adapter = new FabricControllerAdapter({
        skipInit: true,
        txTimeout: 300000,
        user: 'user1',
        channel: 'ch1',
        chaincode: 'practitioner',
        keyStore: '$HOME/hyperledger-fabric-network/.hfc-org1',
        networkProfile: '$HOME/hyperledger-fabric-network/network-profiles/org1.network-profile.yaml',
        userMspPath: '$HOME/hyperledger-fabric-network/artifacts/crypto-config/peerOrganizations/org1.hurley.lab/users/User1@org1.hurley.lab/msp',
        userMsp: 'org1MSP'
      });
      practitionerCtrl = ClientFactory(PractitionerController, adapter);
      await adapter.init(true);

      BaseStorage.current = new CouchDBStorage({
        host: 'localhost',
        protocol: 'http',
        port: '5084'
      }, 'ch1_practitioner');
  });

  after(() => {
    // Close the event listeners
    adapter.close();
  });

  it('should create a default model', async () => {
    const modelSample = new Practitioner({
      id: uuid(),
      name: 'Test',
      created: Date.now(),
      modified: Date.now()
    });

    await practitionerCtrl.create(modelSample);

    const justSavedModel = await Practitioner.getOne(modelSample.id);
    expect(justSavedModel.id).to.exist;
  });
});