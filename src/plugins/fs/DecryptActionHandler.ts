import {ActionSnapshot} from '../../models';
import {IActionHandlerMetadata, IContext} from '../../interfaces';
import {FSUtil} from '../../utils/FSUtil';
import {BaseCryptoActionHandler} from './BaseCryptoActionHandler';

const version = require('../../../../package.json').version;

export class DecryptActionHandler extends BaseCryptoActionHandler {
    private static metadata = <IActionHandlerMetadata> {
        id: 'com.fireblink.fbl.fs.decrypt',
        version: version,
        aliases: [
            'fbl.fs.decrypt',
            'fs.decrypt',
            'decrypt'
        ]
    };

    getMetadata(): IActionHandlerMetadata {
        return DecryptActionHandler.metadata;
    }

    async execute(options: any, context: IContext, snapshot: ActionSnapshot): Promise<void> {
        const files = await FSUtil.findFilesByMasks(options.include, options.exclude, snapshot.wd);
        for (const file of files) {
            snapshot.log(`Decrypting ${file}`);
            await this.decrypt(file, options.password);
        }
    }
}