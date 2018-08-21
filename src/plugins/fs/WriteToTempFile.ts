import {ActionHandler, ActionSnapshot} from '../../models';
import * as Joi from 'joi';
import {writeFile} from 'fs';
import {promisify} from 'util';
import {IActionHandlerMetadata, IContext} from '../../interfaces';

const tmp = require('tmp-promise');

export class WriteToTempFile extends ActionHandler {
    private static metadata = <IActionHandlerMetadata> {
        id: 'com.fireblink.fbl.fs.temp.file.write',
        version: '1.0.0',
        description: 'Write string content to a temporary file.',
        aliases: [
            'fbl.fs.temp.file.write',
            'fs.temp.file.write',
            'temp.file.write',
            'tmp.->'
        ],
        examples: [
`'->':
  # The name of the variable to store the temp file path to, e.g. in this example file path will be stored at: ctx.varName
  context: 'varName'
  # File content to write
  content: |-
    {
      "version": "<%- ctx.version %>"
    }`
        ]
    };

    private static validationSchema = Joi.object({
        context: Joi.string()
            .min(1)
            .required(),
        content: Joi.alternatives(Joi.number(), Joi.string())
            .required()
    })
        .required()
        .options({ abortEarly: true });

    getMetadata(): IActionHandlerMetadata {
        return WriteToTempFile.metadata;
    }

    getValidationSchema(): Joi.SchemaLike | null {
        return WriteToTempFile.validationSchema;
    }

    async execute(options: any, context: IContext, snapshot: ActionSnapshot): Promise<void> {
        const tmpFile = await tmp.file({
            keep: true
        });
        context.ctx[options.context] = tmpFile.path;
        snapshot.log(`Writing content to a temp file: ${tmpFile.path}`);
        await promisify(writeFile)(tmpFile.path, options.content, 'utf8');
    }
}