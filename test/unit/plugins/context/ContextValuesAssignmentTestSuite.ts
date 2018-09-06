import {test, suite} from 'mocha-typescript';
import {ContextValuesAssignment} from '../../../../src/plugins/context/ContextValuesAssignment';
import {promisify} from 'util';
import {writeFile} from 'fs';
import {dump} from 'js-yaml';
import * as assert from 'assert';
import {basename, dirname} from 'path';
import {ActionSnapshot} from '../../../../src/models';
import {FlowService} from '../../../../src/services';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const tmp = require('tmp-promise');

@suite()
export class ContextValuesAssignmentTestSuite {

    @test()
    async failValidation(): Promise<void> {
        const actionHandler = new ContextValuesAssignment();
        const context = FlowService.generateEmptyContext();
        const snapshot = new ActionSnapshot('.', {}, '', 0);

        await chai.expect(
            actionHandler.validate([], context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate({}, context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate({
                test: {}
            }, context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate({
                test: []
            }, context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate({
                test: 123
            }, context, snapshot)
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate({
                test: 'tst'
            }, context, snapshot)
        ).to.be.rejected;
    }

    @test()
    async passValidation(): Promise<void> {
        const actionHandler = new ContextValuesAssignment();
        const context = FlowService.generateEmptyContext();
        const snapshot = new ActionSnapshot('.', {}, '', 0);

        await chai.expect(
            actionHandler.validate({
                test: {
                    inline: 'test'
                }
            }, context, snapshot)
        ).to.be.not.rejected;

        await chai.expect(
            actionHandler.validate({
                test: {
                    files: ['/tmp/test']
                }
            }, context, snapshot)
        ).to.be.not.rejected;

        await chai.expect(
            actionHandler.validate({
                test: {
                    inline: {
                        test: true
                    },
                    files: ['/tmp/test']
                }
            }, context, snapshot)
        ).to.be.not.rejected;
    }

    @test()
    async priorityCheck(): Promise<void> {
        const actionHandler = new ContextValuesAssignment();
        const context = FlowService.generateEmptyContext();

        const fileContent = {
            content: 'file'
        };

        const inlineContent = {
            content: 'inline'
        };

        const tmpFile = await tmp.file();

        // write to temp file
        await promisify(writeFile)(tmpFile.path, dump(fileContent), 'utf8');

        const options = {
            '.': <{[key: string]: any}>{
                inline: inlineContent,
                files: [tmpFile.path]
            }
        };

        let snapshot = new ActionSnapshot('.', {}, '', 0);
        await actionHandler.validate(options, context, snapshot);
        await actionHandler.execute(options, context, snapshot);
        assert.strictEqual(context.ctx.content, 'inline');

        // explicitly set priority to inline
        options['.'].priority = 'inline';

        snapshot = new ActionSnapshot('.', {}, '', 0);
        await actionHandler.validate(options, context, snapshot);
        await actionHandler.execute(options, context, snapshot);
        assert.strictEqual(context.ctx.content, 'inline');

        // change priority to files
        options['.'].priority = 'files';

        snapshot = new ActionSnapshot('.', {}, '', 0);
        await actionHandler.validate(options, context, snapshot);
        await actionHandler.execute(options, context, snapshot);
        assert.strictEqual(context.ctx.content, 'file');
    }


    @test()
    async assignValues(): Promise<void> {
        const actionHandler = new ContextValuesAssignment();

        const context = FlowService.generateEmptyContext();
        context.ctx.existing = {
            value: 'value'
        };

        const fileContent = {
            file_content: 'ftpo'
        };

        const tmpFile = await tmp.file();

        // write to temp file
        await promisify(writeFile)(tmpFile.path, dump(fileContent), 'utf8');

        const options = {
            test: {
                inline: 123
            },
            existing: {
                inline: {
                    other: 'other'
                }
            },
            fromFile: {
                files: [tmpFile.path]
            }
        };

        const snapshot = new ActionSnapshot('.', {}, '', 0);

        await actionHandler.validate(options, context, snapshot);
        await actionHandler.execute(options, context, snapshot);

        assert.strictEqual(context.ctx.test, 123);
        assert.strictEqual(context.ctx.existing.value, undefined);
        assert.strictEqual(context.ctx.existing.other, 'other');
        assert.strictEqual(context.ctx.fromFile.file_content, fileContent.file_content);

        // do the same with relative path
        options.fromFile.files = [basename(tmpFile.path)];
        snapshot.wd = dirname(tmpFile.path);

        await actionHandler.validate(options, context, snapshot);
        await actionHandler.execute(options, context, snapshot);

        assert.strictEqual(context.ctx.test, 123);
        assert.strictEqual(context.ctx.existing.value, undefined);
        assert.strictEqual(context.ctx.existing.other, 'other');
        assert.strictEqual(context.ctx.fromFile.file_content, fileContent.file_content);
    }

    @test()
    async assignRootValues(): Promise<void> {
        const actionHandler = new ContextValuesAssignment();

        const context = FlowService.generateEmptyContext();
        context.ctx.existing = {
            value: 'value'
        };

        const file1Content = {
            file1_content: 'ftpo1'
        };

        const file2Content = {
            file2_content: 'ftpo2'
        };


        const tmpFile1 = await tmp.file();
        const tmpFile2 = await tmp.file();

        // write to temp files
        await promisify(writeFile)(tmpFile1.path, dump(file1Content), 'utf8');
        await promisify(writeFile)(tmpFile2.path, dump(file2Content), 'utf8');

        const options = {
            test: {
                inline: 123
            },
            '.': {
                inline: {
                    other: 'other'
                }
            },
            fromFile: {
                files: [
                    tmpFile1.path,
                    tmpFile2.path
                ]
            }
        };

        const snapshot = new ActionSnapshot('.', {}, '', 0);

        await actionHandler.validate(options, context, snapshot);
        await actionHandler.execute(options, context, snapshot);

        assert.strictEqual(context.ctx.test, 123);
        assert.strictEqual(context.ctx.existing.value, 'value');
        assert.strictEqual(context.ctx.other, 'other');
        assert.strictEqual(context.ctx.fromFile.file1_content, file1Content.file1_content);
        assert.strictEqual(context.ctx.fromFile.file2_content, file2Content.file2_content);

        // do the same with relative path
        options.fromFile.files = [
            basename(tmpFile1.path),
            tmpFile2.path
        ];
        snapshot.wd = dirname(tmpFile1.path);

        await actionHandler.validate(options, context, snapshot);
        await actionHandler.execute(options, context, snapshot);

        assert.strictEqual(context.ctx.test, 123);
        assert.strictEqual(context.ctx.existing.value, 'value');
        assert.strictEqual(context.ctx.other, 'other');
        assert.strictEqual(context.ctx.fromFile.file1_content, file1Content.file1_content);
        assert.strictEqual(context.ctx.fromFile.file2_content, file2Content.file2_content);
    }
}
