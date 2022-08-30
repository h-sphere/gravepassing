import { Project } from 'ts-morph';

let classNameIdx = 0;

// Initialize a project with our tsconfig file
const project = new Project({
  tsConfigFilePath: 'tsconfig.json'
});

// Get all project files
const sourceFiles = project.getSourceFiles();

sourceFiles.forEach(sourceFile => {
  console.log('👉', sourceFile.getBaseName());

  // Get all interfaces in a file
  const interfaces = sourceFile.getClasses();

  interfaces.forEach(i => {
    try {
        // IDog → Dog
        const name = i.getName();
        if (!name) {
            console.warn('Undefined name')
            return;
        }
        const nextName = String.fromCharCode('A'.charCodeAt(0)+classNameIdx);
        classNameIdx++;
        if (name === nextName) {
        return;
        }

        // Rename interface
        console.log(name, '->', nextName);
        i.rename(nextName, {
        renameInComments: true,
        renameInStrings: true
        });
    } catch(e) {
        console.log(e, i);
    }
  });

  console.log();
});

// Save all changed files
project.saveSync();