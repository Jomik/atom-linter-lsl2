"use babel";

const errorMatcher = /^(ERROR|WARN|INFO):: *\( *(\d+), *(\d+)\)-\( *(\d+), *(\d+)\): *(.*$)/;

module.exports = {
  activate: () => {
    require("atom-package-deps").install();
  },

  provideLinter: () => {
    return {
      name: "LSL2",
      grammarScopes: ["source.lsl2"],
      scope: "file",
      lintsOnChange: false,
      lint: textEditor => {
        const { exec } = require("atom-linter");
        const editorPath = textEditor.getPath();
        return exec("lslint", ["-l", editorPath], {
          uniqueKey: "linter-lsl2",
          stream: "both",
          timeout: 30000
        }).then(output => {
          const lines = output.stderr.split(/\n/);
          lines.pop();
          let messages = [];
          for (const line of lines) {
            const match = line.match(errorMatcher);
            if (match) {
              const [
                _,
                type,
                rowStart,
                columnStart,
                rowEnd,
                columnEnd,
                excerpt
              ] = match;
              const severity = type === "WARN" ? "warning" : type.toLowerCase();
              messages.push({
                severity,
                excerpt,
                location: {
                  file: editorPath,
                  position: [
                    [rowStart - 1, columnStart - 1],
                    [rowEnd - 1, columnEnd - 1]
                  ]
                }
              });
            }
          }
          return messages;
        });
      }
    };
  }
};
