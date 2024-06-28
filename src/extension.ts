import * as vscode from 'vscode';

function generateCPF(): string {
    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    let cpf = [];
    for (let i = 0; i < 9; i++) {
        cpf.push(randomInt(0, 9));
    }

    let d1 = 0, d2 = 0;
    for (let i = 0; i < 9; i++) {
        d1 += cpf[i] * (10 - i);
        d2 += cpf[i] * (11 - i);
    }
    d1 = (d1 % 11) < 2 ? 0 : 11 - (d1 % 11);
    d2 = d2 + d1 * 2;
    d2 = (d2 % 11) < 2 ? 0 : 11 - (d2 % 11);

    cpf.push(d1);
    cpf.push(d2);

    return `${cpf[0]}${cpf[1]}${cpf[2]}.${cpf[3]}${cpf[4]}${cpf[5]}.${cpf[6]}${cpf[7]}${cpf[8]}-${cpf[9]}${cpf[10]}`;
}

function generateCNPJ(): string {
    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    let cnpj = [];
    for (let i = 0; i < 12; i++) {
        cnpj.push(randomInt(0, 9));
    }

    let d1 = 0, d2 = 0;
    let weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 12; i++) {
        d1 += cnpj[i] * weights1[i];
        d2 += cnpj[i] * weights2[i];
    }
    d1 = (d1 % 11) < 2 ? 0 : 11 - (d1 % 11);
    d2 = d2 + d1 * 2;
    d2 = (d2 % 11) < 2 ? 0 : 11 - (d2 % 11);

    cnpj.push(d1);
    cnpj.push(d2);

    return `${cnpj[0]}${cnpj[1]}.${cnpj[2]}${cnpj[3]}${cnpj[4]}.${cnpj[5]}${cnpj[6]}${cnpj[7]}/0001-${cnpj[8]}${cnpj[9]}`;
}

async function insertGeneratedText(generateFunction: () => string) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const text = generateFunction();
        const position = editor.selection.active;
        editor.edit(editBuilder => {
            editBuilder.insert(position, text);
        });
    }
}

export function activate(context: vscode.ExtensionContext) {
    let disposableCPF = vscode.commands.registerCommand('extension.generateCPF', () => {
        insertGeneratedText(generateCPF);
    });

    let disposableCNPJ = vscode.commands.registerCommand('extension.generateCNPJ', () => {
        insertGeneratedText(generateCNPJ);
    });

    let disposableShowCommands = vscode.commands.registerCommand('extension.showCommands', async () => {
        const options: vscode.QuickPickItem[] = [
            { label: 'Generate CPF', description: 'Generate a valid CPF' },
            { label: 'Generate CNPJ', description: 'Generate a valid CNPJ' }
        ];

        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: 'Choose a command'
        });

        if (selected) {
            if (selected.label === 'Generate CPF') {
                vscode.commands.executeCommand('extension.generateCPF');
            } else if (selected.label === 'Generate CNPJ') {
                vscode.commands.executeCommand('extension.generateCNPJ');
            }
        }
    });

    context.subscriptions.push(disposableCPF);
    context.subscriptions.push(disposableCNPJ);
    context.subscriptions.push(disposableShowCommands);
}

export function deactivate() {}
