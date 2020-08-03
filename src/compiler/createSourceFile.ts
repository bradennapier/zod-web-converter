import * as ts from 'typescript'
import { CompilerApi, TypeChecker, Program, SourceFile, CompilerOptions, ScriptTarget, ScriptKind, CompilerHost } from "./CompilerApi";
import { assertNever } from "../utils";
import * as path from "path";
export function createSourceFile(api: CompilerApi, code: string, scriptTarget: ScriptTarget, scriptKind: ScriptKind) {
    const filePath = `/ts-ast-viewer${getExtension(api, scriptKind)}`;
    const sourceFile = api.createSourceFile(filePath, code, scriptTarget, false, scriptKind);
    let bindingResult: { typeChecker: TypeChecker; program: Program } | undefined;

    return { sourceFile, bindingTools: getBindingTools };

    // binding may be disabled, so make this deferred
    function getBindingTools() {
        if (bindingResult == null)
            bindingResult = getBindingResult();
        return bindingResult;
    }

    function getBindingResult() {
        const options: CompilerOptions = { strict: true, target: scriptTarget, allowJs: true, moduleResolution: ts.ModuleResolutionKind.NodeJs, module: api.ModuleKind.ES2015 };
        const files: { [name: string]: SourceFile | undefined } = { [filePath]: sourceFile, '/abc.d.ts': api.createSourceFile('abc.ts', 'export const one = 2', scriptTarget, false, scriptKind), ...api.tsAstViewer.cachedSourceFiles };

        const compilerHost: CompilerHost = {
            getSourceFile: (fileName: string, languageVersion: ScriptTarget, onError?: (message: string) => void) => {
                console.log("Get Source File:", fileName, !!files[fileName])
                return files[fileName];
            },
            // getSourceFileByPath(fileName: string, path: any, languageVersion: ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean) {
            //     console.log('Get Source File By Path: ', fileName, path, languageVersion, shouldCreateNewSourceFile);
            //     return files[fileName]

            // },
            // getSourceFileByPath: (...) => {}, // not providing these will force it to use the file name as the file path
            // getDefaultLibLocation: (...) => {},
            // getDefaultLibLocation() {
            //     return '/'
            // },
            resolveModuleNames(moduleNames, containingFile, reusedNames, redirectedReference, options) {
                const mapped = moduleNames.map(moduleName => {
                    console.log('Resolve: ', moduleName, containingFile, reusedNames, redirectedReference, options);
                    return {
                        resolvedFileName: moduleName.endsWith('.') ? path.resolve(path.dirname(containingFile), moduleName, 'index.d.ts') : path.resolve(path.dirname(containingFile), moduleName.replace('.ts', '')) + '.d.ts'
                    }
                })
                console.log(mapped)
                return mapped;
            },
            getDefaultLibFileName: (defaultLibOptions: CompilerOptions) => {
                console.log('GetDefault lib File Name: ', "/" + api.getDefaultLibFileName(defaultLibOptions));
                return  "/" + api.getDefaultLibFileName(defaultLibOptions)
            },

            writeFile: () => {
                // do nothing
            },
            getCurrentDirectory: () => "/",
            getDirectories: (path: string) => {
                console.log('Get Directories: ', path);
                return []
            },
            fileExists: (fileName: string) => {
                console.log('File Exists? ', fileName, files[fileName] != null)

                return files[fileName] != null
            },
            readFile: (fileName: string) => {
                console.log('Read File: ', fileName, files[fileName] != null ? files[fileName]!.getFullText() : undefined);
                return files[fileName] != null ? files[fileName]!.getFullText() : undefined
            },
            getCanonicalFileName: (fileName: string) => fileName,
            useCaseSensitiveFileNames: () => true,
            getNewLine: () => "\n",
            getEnvironmentVariable: () => "",
        };
        const program = api.createProgram([...Object.keys(files)], options, compilerHost);
        const typeChecker = program.getTypeChecker();

        return { typeChecker, program };
    }
}

function getExtension(api: CompilerApi, scriptKind: ScriptKind) {
    switch (scriptKind) {
        case api.ScriptKind.TS:
            return ".ts";
        case api.ScriptKind.TSX:
            return ".tsx";
        case api.ScriptKind.JS:
            return ".js";
        case api.ScriptKind.JSX:
            return ".jsx";
        case api.ScriptKind.JSON:
            return ".json";
        case api.ScriptKind.External:
        case api.ScriptKind.Deferred:
        case api.ScriptKind.Unknown:
            return "";
        default:
            return assertNever(scriptKind, `Not implemented ScriptKind: ${api.ScriptKind[scriptKind]}`);
    }
}
