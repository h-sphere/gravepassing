import { Project } from 'ts-morph';

let name = [65, 65];
let generateNextName = () => {
  if (name[1] === 90) {
    name[0]++;
    name[1] = 65;
  }
  name[1]++;
}

let nameString = () => 
  name.map(n => String.fromCharCode(n)).join('');

let classNameIdx = 0;
let mId = 0;
let pId = 0;

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
        const nextName = nameString();
        generateNextName();
        if (name === nextName) {
        return;
        }

        // Rename class
        console.log(name, '->', nextName);
        i.rename(nextName, {
        renameInComments: true,
        renameInStrings: true
        });


        console.log('--- Methods');
        const methods = i.getMethods();
        methods.forEach(m => {
          const mName = m.getName();
          const newName = nameString();
          generateNextName();
          console.log(`  ${name}::${mName} ->  ${nextName}::${newName}`);
          m.rename(newName, {
            renameInComments: false,
            renameInStrings: false,
          });
        });

        console.log('--- Props');
        const props = i.getProperties();
        props.forEach(p => {
          const pName = p.getName();
          const newName = nameString();
          generateNextName();
          console.log(`  ${name}::${pName} ->  ${nextName}::${newName}`);
          p.rename(newName, {
            renameInComments: false,
            renameInStrings: false, // This renames too much.
          });
        })

    } catch(e) {
        console.log(e, i);
    }
  });

  console.log();
});

// Save all changed files
project.saveSync();