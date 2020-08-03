/* Automatically maintained from package.json. Do not edit! */
import { CompilerApi } from "./CompilerApi";
import { CompilerPackageNames, importCompilerApi, importLibFiles } from "./compilerVersions";

const compilerTypes: { [name: string]: Promise<CompilerApi> } = {};
const compilerTypesLoaded: { [name: string]: true } = {};

export function getCompilerApi(packageName: CompilerPackageNames): Promise<CompilerApi> {
    if (compilerTypes[packageName] == null) {
        compilerTypes[packageName] = loadCompilerApi(packageName);
        compilerTypes[packageName].catch(() => delete compilerTypes[packageName]);
    }
    return compilerTypes[packageName];
}

export function hasLoadedCompilerApi(packageName: CompilerPackageNames) {
    return compilerTypesLoaded[packageName] === true;
}

async function loadCompilerApi(packageName: CompilerPackageNames) {
    const libFilesPromise = importLibFiles(packageName);
    const zodFilesPromise = import("../resources/libFiles/index");
    const compilerApiPromise = importCompilerApi(packageName);
    const api = await compilerApiPromise as any as CompilerApi;

    api.tsAstViewer = {
        packageName,
        cachedSourceFiles: {},
    };
    const libFiles = await libFilesPromise;
    const zodFiles = await zodFilesPromise;

    for (const sourceFile of getLibSourceFiles(libFiles))
        api.tsAstViewer.cachedSourceFiles[sourceFile.fileName] = sourceFile;
    for (const sourceFile of getLibSourceFiles(zodFiles))
        api.tsAstViewer.cachedSourceFiles[sourceFile.fileName] = sourceFile;

    compilerTypesLoaded[packageName] = true;

    return api;

    function getLibSourceFiles(files: any) {
        return Object.keys(files)
            .map(key => files[key] as { fileName: string; text: string })
            .map(libFile => api.createSourceFile(libFile.fileName, libFile.text, api.ScriptTarget.Latest, false, api.ScriptKind.TS));
    }
}
