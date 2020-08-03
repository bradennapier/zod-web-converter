import * as ts from "typescript";
import { findInterface } from "./findInterface";
import {
  generateZodCall,
  generateZodObjectVar,
  generateZodInferredType,
} from "./generate/generate";
import { GetValueProps } from "./types";

// function doTypescriptDiagnostics(
//   program: ts.Program,
//   output: vscode.OutputChannel
// ) {
//   const diagnostics = ts.getPreEmitDiagnostics(program);

//   const error = diagnostics.find(
//     (d) => d.category === ts.DiagnosticCategory.Error
//   );

//   if (error !== undefined) {
//     const msg = `TS Compilation Error: ${ts.flattenDiagnosticMessageText(
//       error.messageText,
//       "\n"
//     )}`;
//     output.appendLine(`Typescript Compilation Error:\n${msg}`);
//     vscode.window.showErrorMessage(
//       "Failed: Typescript Compilation Error (See Output)"
//     );
//     return;
//   }
// }

/* Get export interface identifiers */
export const getValue = (props: GetValueProps) => {
  try {
    console.log("Get Program", props);
    const { filename, range } = props;

    const { program, typeChecker } = props.compiler.bindingTools();



    console.log("Program: ", program);

    // doTypescriptDiagnostics(program, output)

    const sourceFile = props.compiler.sourceFile;

    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

    console.log('printer')

    const pos = range[0]

    console.log('pos: ', pos)

    const {
      interfaceNode,
      // zodImportNode,
      zodImportValue,
      isExported,
    } = findInterface({ filename, sourceFile, range, pos }, props);

    console.log(zodImportValue, isExported, interfaceNode);

    const interfaceType = typeChecker.getTypeAtLocation(interfaceNode);
    const interfaceName = interfaceNode.name.text;
    const zodConstName = `${interfaceName}Schema`;

    // Get Fixture
    const fixture = generateZodCall({
      interfaceType,
      typeChecker,
      zodImportValue,
      sourceFile,
    });

    const start = sourceFile.getLineAndCharacterOfPosition(
      interfaceNode.getStart()
    );

    const end = sourceFile.getLineAndCharacterOfPosition(interfaceNode.getEnd());
      
    console.log({ start, end }, interfaceNode.getEnd())

    // const ${interfaceName}Schema = ${zodImportValue}.object({ ... });
    const zodObj = generateZodObjectVar(
      zodConstName,
      zodImportValue,
      fixture,
      isExported
    );
    // type ${interfaceName} = ${zodImportValue}.infer<typeof ${zodConstName}>;
    const zodInferred = generateZodInferredType(
      interfaceName,
      zodImportValue,
      zodConstName,
      isExported
    );

    // converted values into string
    const sourceString = [
      printer.printNode(ts.EmitHint.Unspecified, zodObj, sourceFile),
      printer.printNode(ts.EmitHint.Unspecified, zodInferred, sourceFile),
    ].join("\n\n");

    // replace in vscode
    props.replace(
      [interfaceNode.getStart(),interfaceNode.getEnd()],

      sourceString
    );

    return {
      interfaceNode,
    };
  } catch (err) {
    console.error("Failed To Get Value: ", err);
    throw err;
  }
};
