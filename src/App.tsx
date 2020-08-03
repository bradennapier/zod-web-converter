import React from "react";
import * as ts from "typescript";
import SplitPane from "react-split-pane";
import * as components from "./components";
import {
  Node,
  CompilerPackageNames,
  getDescendantAtRange,
  getStartSafe,
} from "./compiler";
import { css as cssConstants } from "./constants";
import { StoreState, OptionsState, ApiLoadingState } from "./types";
import "./App.css";

import { getValue } from "compiler/zod/getValue";

export interface Props extends StoreState {
  onCodeChange: (
    compilerPackageName: CompilerPackageNames,
    code: string
  ) => void;
  onNodeChange: (node: Node) => void;
  onOptionsChange: (
    compilerPackageName: CompilerPackageNames,
    options: Partial<OptionsState>
  ) => void;
}

export default function App(props: Props) {
  const compiler = props.compiler;

  return (
    <div className="App">
      <SplitPane split="horizontal" defaultSize={50} allowResize={false}>
        <header className="AppHeader clearfix">
          <h2 id="title">Zod Type Converter</h2>
          <components.Options
            api={compiler == null ? undefined : compiler.api}
            options={props.options}
            onChange={(options) =>
              props.onOptionsChange(
                options.compilerPackageName ||
                  props.options.compilerPackageName,
                options
              )
            }
          />
        </header>
        <SplitPane split="vertical" minSize={50} defaultSize="33%">
          {getCodeEditorArea()}
          {getCompilerDependentPanes()}
        </SplitPane>
      </SplitPane>
    </div>
  );

  function getCodeHighlightRange() {
    if (props.compiler == null) return undefined;

    const { selectedNode, sourceFile } = props.compiler;
    return selectedNode === sourceFile
      ? undefined
      : {
          start: getStartSafe(selectedNode, sourceFile),
          end: selectedNode.end,
        };
  }

  function getCodeEditorArea() {
    if (props.options.showFactoryCode) {
      return (
        <SplitPane split="horizontal" defaultSize={window.innerHeight * 0.7}>
          {getCodeEditor()}
          {getFactoryCodeEditor()}
        </SplitPane>
      );
    } else {
      return getCodeEditor();
    }

    function getFactoryCodeEditor() {
      if (compiler == null || props.apiLoadingState === ApiLoadingState.Loading)
        return <components.Spinner />;

      return (
        <components.ErrorBoundary getResetHash={() => props.code}>
          <components.FactoryCodeEditor compiler={compiler} />
        </components.ErrorBoundary>
      );
    }

    function getCodeEditor() {
      return (
        <components.CodeEditor
          id={cssConstants.mainCodeEditor.id}
          onChange={(code) =>
            props.onCodeChange(props.options.compilerPackageName, code)
          }
          onClick={(range) => {
            if (props.compiler == null) return;
            const descendant = getDescendantAtRange(
              props.options.treeMode,
              props.compiler.sourceFile,
              range,
              props.compiler.api
            );
            props.onNodeChange(descendant);
          }}
          onZod={(range, editor) => {
            if (props.compiler == null) return;

            const edits: any[] = [];

            const { interfaceNode } = getValue({
              filename: props.compiler.sourceFile.fileName,
              range,
              config: {
                defaultZodValueName: "z",
                jsDocRenderErrorMessages: false,
                jsDocUseMainContentAsErrorMessage: false,
                jsDocErrorTag: "error,throws",
                importStarAs: true,
              },
              compiler: props.compiler,
              insert(pos: ts.LineAndCharacter, value: string) {
                console.log("INSERT: ", pos, value);
                const editorModel = editor.getModel();
                if (!editorModel) {
                  throw new Error("No Editor Model");
                }
                const range = editorModel
                  .getFullModelRange()
                  .setStartPosition(pos.line + 1, pos.character + 1)
                  .setEndPosition(pos.line + 1, pos.character + 1);

                edits.push({
                  range,
                  text: `${value}\n\n`,
                });
              },
              replace(range: [number, number], value: string) {
                console.log("Replace: ", range, value);
                const editorModel = editor.getModel();

                if (!editorModel) {
                  throw new Error("No Editor Model");
                }
                const pos = editorModel.getPositionAt(range[0]);
                const endPos = editorModel.getPositionAt(range[1]);
                const editorRange = editorModel
                  .getFullModelRange()
                  .setStartPosition(pos.lineNumber, pos.column)
                  .setEndPosition(endPos.lineNumber, endPos.column);
                console.log("Range: ", editorRange);

                edits.push({
                  range: editorRange,
                  text: `${value}\n`,
                });
              },
            });
            console.log("Edits: ", edits);
            try {
              editor.executeEdits("my-source", edits);
            } catch (err) {
              console.error(err);
            }

            props.onNodeChange(interfaceNode);
          }}
          text={props.code}
          highlight={getCodeHighlightRange()}
          showInfo={true}
          renderWhiteSpace={true}
          editorDidMount={codeEditorDidMount}
        />
      );
    }
  }

  function getCompilerDependentPanes() {
    if (compiler == null || props.apiLoadingState === ApiLoadingState.Loading)
      return <components.Spinner />;
    else if (props.apiLoadingState === ApiLoadingState.Error)
      return (
        <div className={"errorMessage"}>
          Error loading compiler API. Please refresh the page to try again.
        </div>
      );

    return (
      <components.ErrorBoundary>
        <SplitPane split="vertical" minSize={50} defaultSize="50%">
          <components.TreeViewer
            api={compiler.api}
            selectedNode={compiler.selectedNode}
            sourceFile={compiler.sourceFile}
            onSelectNode={(node) => props.onNodeChange(node)}
            mode={props.options.treeMode}
          />
          <components.PropertiesViewer
            compiler={compiler}
            selectedNode={compiler.selectedNode}
            sourceFile={compiler.sourceFile}
            bindingTools={compiler.bindingTools}
            bindingEnabled={props.options.bindingEnabled}
            showInternals={props.options.showInternals}
          />
        </SplitPane>
      </components.ErrorBoundary>
    );
  }

  function codeEditorDidMount(
    editor: import("monaco-editor").editor.IStandaloneCodeEditor
  ) {
    console.log("editor: ", editor);

    // For some reason a slight delay is necessary here. Otherwise it won't let the user type.
    setTimeout(() => editor.focus(), 100);

    // global method for cypress
    (window as any).setMonacoEditorText = (text: string) => {
      const editorModel = editor.getModel();

      if (editorModel == null) return;

      editor.executeEdits("my-source", [
        {
          range: editorModel.getFullModelRange(),
          text,
        },
      ]);
    };
  }
}
