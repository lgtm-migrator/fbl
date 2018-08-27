import {ActionSnapshot} from '../../models';
import {IActionHandlerMetadata, IContext} from '../../interfaces';
import {BaseMarkEntityAs} from './BaseMarkEntityAs';

const version = require('../../../../package.json').version;

export class MarkEntitiesAsUpdated extends BaseMarkEntityAs {
    private static metadata = <IActionHandlerMetadata> {
        id: 'com.fireblink.fbl.context.entities.updated',
        version: version,
        aliases: [
            'fbl.context.entities.updated',
            'context.entities.updated',
            'ctx.entities.updated'
        ]
    };

    getMetadata(): IActionHandlerMetadata {
        return MarkEntitiesAsUpdated.metadata;
    }

    async execute(options: any, context: IContext, snapshot: ActionSnapshot): Promise<void> {
        context.entities.updated.push(...options);
        context.entities.registered.push(...options);
        snapshot.setContext(context);
    }
}
