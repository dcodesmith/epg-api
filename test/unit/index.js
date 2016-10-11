/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import HTTPStatus from 'http-status';
import createController from '../../src/controller';
import model from '../../src/model/Channel';
import handler from '../../util/handler';

const req = { body: {} };
const res = {
  status: sinon.stub().returnsThis(),
  json: sinon.stub().returnsThis()
};
const next = sinon.spy();

const mHandler = {
  create: sinon.stub().callsArgWith(1, null, { a: 1 }),
};
// sinon.stub(model, 'create').returns(Promise.resolve({}));
// modelCreateStub.returns(Promise.resolve({}));

const controller = createController(model);

const handlers = sinon.stub().returns(mHandler);
// const modelHandler = handler(model);
// sinon.stub(modelHandler, 'create').callsArgWith(1, null, { a: 1 });

describe.skip('Given a request', () => {
  before(() => {
    controller.create(req, res, next);
  });

  after(() => {
    // modelHandler.create.restore();
    // modelCreateStub.restore();
  });

  it('res.status', () => {
    console.log('modelHandler.create', mHandler.create.callCount);
    console.log('res.status.callCount', res.status.callCount);
    expect(res.status.calledWith(HTTPStatus.CREATED)).to.equal(true);
  });

  it('res.json', () => {
    console.log('res.json.callCount', res.json.callCount);
    expect(res.json.callCount).to.equal(1);
    expect(res.json.calledWith({})).to.equal(true);
  });
});
