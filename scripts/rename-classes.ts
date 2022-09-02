import { ClassDeclaration, DefinitionInfo, Project } from 'ts-morph';

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

const renameAll = (entries: any[]) => {
  entries.forEach(info => {
    const mName = info.getName();
    if (mName.length < 3) {
      console.log(`I THINK I ALREADY RENAMED THAT: ${mName}`);
      return;
    }
    const newName = nameString();
    generateNextName();
    console.log(`  ${mName} -> ${newName}`);
    info.rename(newName, {
      renameInComments: false,
      renameInStrings: false,
    });
  })
}

// Initialize a project with our tsconfig file
const project = new Project({
  tsConfigFilePath: 'tsconfig.json'
});

// Get all project files
const sourceFiles = project.getSourceFiles();

sourceFiles.forEach(sourceFile => {
  console.log('👉', sourceFile.getBaseName());


  // INTERFACES: let's change the props only
  sourceFile.getInterfaces().forEach(i => {
    console.log(`${i.getName()}`);
    console.log('RENAME PROP');
    renameAll(i.getProperties());
    // console.log('RENAME METHODS');
    // renameAll(i.getMethods());
  })

  // Get all interfaces in a file
  const classes = [...sourceFile.getClasses(), /*...sourceFile.getInterfaces()*/];

  classes.forEach(i => {
    try {
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
        renameInComments: false,
        renameInStrings: false
        });

        if (i instanceof ClassDeclaration) {

          console.log('-- Static methods');
          renameAll(i.getStaticMethods());
          
          console.log("--- Renaming method parameters too");
          // rename method params
          i.getStaticMethods().forEach(m => {
            console.log(m.getName());
            renameAll(m.getParameters());
          })

          console.log('-- Static Props');
          renameAll(i.getStaticProperties());


          console.log('-- Static members');
          renameAll(i.getStaticMembers());
        }


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
});

// Save all changed files
project.saveSync();