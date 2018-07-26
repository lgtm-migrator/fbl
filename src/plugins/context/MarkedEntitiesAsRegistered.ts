import {ActionHandler, ActionSnapshot, IHandlerMetadata} from '../../models';
import * as Joi from 'joi';
import {Container} from 'typedi';
import {FlowService} from '../../services';
import {IContext} from '../../interfaces';
import {IContextEntity} from '../../interfaces/IContext';

export class MarkedEntitiesAsRegistered extends ActionHandler {
    private static metadata = <IHandlerMetadata> {
        id: 'com.fireblink.fbl.context.entities.registered',
        version: '1.0.0',
        description: 'Context values assignment. Either inline or from file for each key individually. Only top level keys are supported. Assignment directly to context is possible when "." key is provided.',
        aliases: [
            'fbl.context.entities.registered',
            'context.entities.registered',
            'ctx.entities.registered'
        ]
    };

    private static validationSchema = Joi.array()
        .items(Joi.object({
            type: Joi.string().min(1).required(),
            id: Joi.alternatives(
                Joi.string().min(1).required(),
                Joi.number().required(),
            ).required(),
            payload: Joi.any()
        }))
        .min(1)
        .required()
        .options({ abortEarly: true });

    getMetadata(): IHandlerMetadata {
        return MarkedEntitiesAsRegistered.metadata;
    }

    getValidationSchema(): Joi.SchemaLike | null {
        return MarkedEntitiesAsRegistered.validationSchema;
    }

    async execute(options: any, context: IContext, snapshot: ActionSnapshot): Promise<void> {
        context.entities.registered.push(...options);
        snapshot.setContext(context);
    }
}
