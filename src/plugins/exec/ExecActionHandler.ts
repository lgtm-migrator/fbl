import {ActionSnapshot} from '../../models';
import {IActionHandlerMetadata, IContext, IDelegatedParameters} from '../../interfaces';
import * as Joi from 'joi';
import {BaseExecutableActionHandler} from './BaseExecutableActionHandler';
import {FBL_ASSIGN_TO_SCHEMA} from '../../schemas';

export class ExecActionHandler extends BaseExecutableActionHandler {
    private static metadata = <IActionHandlerMetadata> {
        id: 'com.fireblink.fbl.exec',
        aliases: [
            'fbl.exec',
            'exec'
        ]
    };

    private static validationSchema = Joi.object({
            command: Joi.string().min(1).required(),
            args: Joi.array().items(
                Joi.alternatives(
                    Joi.string().min(1),
                    Joi.number()
                )
            ),
            options: Joi.object({
                stdout: Joi.boolean(),
                stderr: Joi.boolean(),
                verbose: Joi.boolean()
            }),
            assignResultTo: FBL_ASSIGN_TO_SCHEMA,
            pushResultTo: FBL_ASSIGN_TO_SCHEMA,
            wd: Joi.string().min(1)
        })
        .required()
        .options({ abortEarly: true });

    getValidationSchema(): Joi.SchemaLike | null {
        return ExecActionHandler.validationSchema;
    }

    getMetadata(): IActionHandlerMetadata {
        return ExecActionHandler.metadata;
    }

    async execute(options: any, context: IContext, snapshot: ActionSnapshot, parameters: IDelegatedParameters): Promise<void> {
        const result = await this.exec(
            snapshot,
            options.command,
            options.args,
            options.wd || snapshot.wd,
            options.options
        );

        await this.storeResult(
            snapshot,
            context,
            parameters,
            options.assignResultTo,
            options.pushResultTo,
            result
        );
    }
}
