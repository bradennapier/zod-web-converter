// dprint-ignore-file
/* Automatically maintained from package.json. Do not edit! */

import { Node, CompilerApi } from "./CompilerApi";
import { assertNever } from "../utils";
export type CompilerVersions = "3.9.2" | "3.8.3" | "3.7.5" | "3.6.4" | "3.5.3" | "3.4.5" | "3.3.3" | "3.2.4" | "3.1.6" | "3.0.3";
export type CompilerPackageNames = "typescript" | "typescript-3.8.3" | "typescript-3.7.5" | "typescript-3.6.4" | "typescript-3.5.3" | "typescript-3.4.5" | "typescript-3.3.3" | "typescript-3.2.4" | "typescript-3.1.6" | "typescript-3.0.3";
export const compilerVersionCollection: { version: CompilerVersions; packageName: CompilerPackageNames; }[] = [
        { version: "3.9.2", packageName: "typescript" },
        { version: "3.8.3", packageName: "typescript-3.8.3" },
        { version: "3.7.5", packageName: "typescript-3.7.5" },
        { version: "3.6.4", packageName: "typescript-3.6.4" },
        { version: "3.5.3", packageName: "typescript-3.5.3" },
        { version: "3.4.5", packageName: "typescript-3.4.5" },
        { version: "3.3.3", packageName: "typescript-3.3.3" },
        { version: "3.2.4", packageName: "typescript-3.2.4" },
        { version: "3.1.6", packageName: "typescript-3.1.6" },
        { version: "3.0.3", packageName: "typescript-3.0.3" }
    ];

export async function importCompilerApi(packageName: CompilerPackageNames) {
    // these explicit import statements are required to get webpack to include these modules
    switch (packageName) {
        case "typescript":
            return await import("typescript");
        case "typescript-3.8.3":
            return await import("typescript-3.8.3");
        case "typescript-3.7.5":
            return await import("typescript-3.7.5");
        case "typescript-3.6.4":
            return await import("typescript-3.6.4");
        case "typescript-3.5.3":
            return await import("typescript-3.5.3");
        case "typescript-3.4.5":
            return await import("typescript-3.4.5");
        case "typescript-3.3.3":
            return await import("typescript-3.3.3");
        case "typescript-3.2.4":
            return await import("typescript-3.2.4");
        case "typescript-3.1.6":
            return await import("typescript-3.1.6");
        case "typescript-3.0.3":
            return await import("typescript-3.0.3");
        default:
            return assertNever(packageName, `Not implemented version: ${packageName}`);
    }
}

export async function importLibFiles(packageName: CompilerPackageNames) {
    // these explicit import statements are required to get webpack to include these modules
    switch (packageName) {
        case "typescript":
            return await import("../resources/libFiles/typescript/index");
        case "typescript-3.8.3":
            return await import("../resources/libFiles/typescript-3.8.3/index");
        case "typescript-3.7.5":
            return await import("../resources/libFiles/typescript-3.7.5/index");
        case "typescript-3.6.4":
            return await import("../resources/libFiles/typescript-3.6.4/index");
        case "typescript-3.5.3":
            return await import("../resources/libFiles/typescript-3.5.3/index");
        case "typescript-3.4.5":
            return await import("../resources/libFiles/typescript-3.4.5/index");
        case "typescript-3.3.3":
            return await import("../resources/libFiles/typescript-3.3.3/index");
        case "typescript-3.2.4":
            return await import("../resources/libFiles/typescript-3.2.4/index");
        case "typescript-3.1.6":
            return await import("../resources/libFiles/typescript-3.1.6/index");
        case "typescript-3.0.3":
            return await import("../resources/libFiles/typescript-3.0.3/index");
        default:
            return assertNever(packageName, `Not implemented version: ${packageName}`);
    }
}

export type FactoryCodeGenerator = (ts: CompilerApi, node: Node) => string;

export async function getGenerateFactoryCodeFunction(packageName: CompilerPackageNames): Promise<FactoryCodeGenerator> {
    // these explicit import statements are required to get webpack to include these modules
    switch (packageName) {
        case "typescript":
            return (await import("../resources/factoryCode/typescript")).generateFactoryCode as any;
        case "typescript-3.8.3":
            return (await import("../resources/factoryCode/typescript-3.8.3")).generateFactoryCode as any;
        case "typescript-3.7.5":
            return (await import("../resources/factoryCode/typescript-3.7.5")).generateFactoryCode as any;
        case "typescript-3.6.4":
            return (await import("../resources/factoryCode/typescript-3.6.4")).generateFactoryCode as any;
        case "typescript-3.5.3":
            return (await import("../resources/factoryCode/typescript-3.5.3")).generateFactoryCode as any;
        case "typescript-3.4.5":
            return (await import("../resources/factoryCode/typescript-3.4.5")).generateFactoryCode as any;
        case "typescript-3.3.3":
            return (await import("../resources/factoryCode/typescript-3.3.3")).generateFactoryCode as any;
        case "typescript-3.2.4":
            return (await import("../resources/factoryCode/typescript-3.2.4")).generateFactoryCode as any;
        case "typescript-3.1.6":
            return (await import("../resources/factoryCode/typescript-3.1.6")).generateFactoryCode as any;
        case "typescript-3.0.3":
            return (await import("../resources/factoryCode/typescript-3.0.3")).generateFactoryCode as any;
        default:
            return assertNever(packageName, `Not implemented version: ${packageName}`);
    }
}

export interface PublicApiInfo {
    nodePropertiesBySyntaxKind: Map<string, Set<string>>;
    symbolProperties: Set<string>;
    typeProperties: Set<string>;
    signatureProperties: Set<string>;
}

export async function getPublicApiInfo(packageName: CompilerPackageNames): Promise<PublicApiInfo> {
    // these explicit import statements are required to get webpack to include these modules
    switch (packageName) {
        case "typescript":
            return (await import("../resources/publicApiInfo/typescript"));
        case "typescript-3.8.3":
            return (await import("../resources/publicApiInfo/typescript-3.8.3"));
        case "typescript-3.7.5":
            return (await import("../resources/publicApiInfo/typescript-3.7.5"));
        case "typescript-3.6.4":
            return (await import("../resources/publicApiInfo/typescript-3.6.4"));
        case "typescript-3.5.3":
            return (await import("../resources/publicApiInfo/typescript-3.5.3"));
        case "typescript-3.4.5":
            return (await import("../resources/publicApiInfo/typescript-3.4.5"));
        case "typescript-3.3.3":
            return (await import("../resources/publicApiInfo/typescript-3.3.3"));
        case "typescript-3.2.4":
            return (await import("../resources/publicApiInfo/typescript-3.2.4"));
        case "typescript-3.1.6":
            return (await import("../resources/publicApiInfo/typescript-3.1.6"));
        case "typescript-3.0.3":
            return (await import("../resources/publicApiInfo/typescript-3.0.3"));
        default:
            return assertNever(packageName, `Not implemented version: ${packageName}`);
    }
}
