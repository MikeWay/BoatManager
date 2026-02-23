import { AdminPerson } from './model/AdminPerson';
import * as readline from 'readline';

function promptPassword(query: string): Promise<string> {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        // Suppress echoing of the password
        (rl as any)._writeToOutput = function (s: string) {
            if (s === query) {
                (rl as any).output.write(s); // show the prompt itself
            }
            // swallow everything else (the typed characters)
        };
        rl.question(query, answer => {
            (rl as any).output.write('\n');
            rl.close();
            resolve(answer);
        });
    });
}

(async () => {
    const password = await promptPassword('Enter password to hash: ');
    if (!password) {
        console.error('No password entered.');
        process.exit(1);
    }
    const adminPerson = new AdminPerson('', '', '');
    const passwordHash = await adminPerson.setPassword(password);
    console.log('Password hash:', passwordHash);
})();
