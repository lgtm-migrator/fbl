import {test, suite} from 'mocha-typescript';
import {FlowService} from '../../../../src/services';
import {ActionSnapshot} from '../../../../src/models';
import {MarkEntitiesAsDeleted} from '../../../../src/plugins/context/MarkEntitiesAsDeleted';
import {IContextEntity} from '../../../../src/interfaces';
import * as assert from 'assert';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

@suite
class MarkEntitiesAsDeletedTestSuite {

    @test()
    async failValidation(): Promise<void> {
        const actionHandler = new MarkEntitiesAsDeleted();
        const context = FlowService.generateEmptyContext();
        const snapshot = new ActionSnapshot('.', {}, '', 0);

        await chai.expect(
            actionHandler.validate({}, context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate(1, context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate('test', context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate(true, context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate([], context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate([], context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate([{}], context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate([{
                type: 'test'
            }], context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate([{
                id: 'test'
            }], context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate([{
                type: false,
                id: 'test'
            }], context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate([{
                type: 'test',
                id: true
            }], context, snapshot)
        ).to.be.rejected;
    }

    @test()
    async passValidation(): Promise<void> {
        const actionHandler = new MarkEntitiesAsDeleted();
        const context = FlowService.generateEmptyContext();
        const snapshot = new ActionSnapshot('.', {}, '', 0);

        await chai.expect(
            actionHandler.validate([{
                type: 'test',
                id: 1
            }], context, snapshot)
        ).to.be.not.rejected;
    }

    @test()
    async execution(): Promise<void> {
        const actionHandler = new MarkEntitiesAsDeleted();
        const context = FlowService.generateEmptyContext();
        const snapshot = new ActionSnapshot('.', {}, '', 0);

        const options = [
            <IContextEntity> {
                type: 't1',
                id: 1,
                payload: false
            },

            <IContextEntity> {
                type: 't2',
                id: 'e2',
                payload: [{test: 'yes'}]
            }
        ];

        actionHandler.execute(options, context, snapshot);
        assert.deepStrictEqual(context.entities.unregistered, options);
        assert.deepStrictEqual(context.entities.deleted, options);
    }
}
