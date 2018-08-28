import {ActionSnapshot} from '../../models';
import {IActionHandlerMetadata, IContext} from '../../interfaces';
import {BaseCrypto} from './BaseCrypto';
import {FSUtil} from '../../utils/FSUtil';

const version = require('../../../../package.json').version;

export class Encrypt extends BaseCrypto {
    private static metadata = <IActionHandlerMetadata> {
        id: 'com.fireblink.fbl.fs.encrypt',
        version: version,
        aliases: [
            'fbl.fs.encrypt',
            'fs.encrypt',
            'encrypt'
        ]
    };

    getMetadata(): IActionHandlerMetadata {
        return Encrypt.metadata;
    }

    async execute(options: any, context: IContext, snapshot: ActionSnapshot): Promise<void> {
        const files = await FSUtil.findFilesByMasks(options.include, options.exclude, snapshot.wd);
        for (const file of files) {
            snapshot.log(`Encrypting ${file}`);
            await this.encrypt(file, options.password);
        }
    }
}
