import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';
import { postProjectCreated } from './postProjectCreated';

function parseArgumentsIntoOptions(rawArgs) {
 const args = arg(
   {
     '--git': Boolean,
     '--yes': Boolean,
     '--install': Boolean,
     '--targetDir' : String,
     '-g': '--git',
     '-y': '--yes',
     '-i': '--install',
   },
   {
     argv: rawArgs.slice(2),
   }
   );
   return {
   skipPrompts: args['--yes'] || false,
   git: args['--git'] || false,
   template: args._[0],
   runInstall: args['--install'] || false,
   targetDir : args['--targetDir'] || false
 };
}

async function promptForMissingOptions(options) {
    const defaultTemplate = 'Express';
    if (options.skipPrompts) {
      return {
        ...options,
        template: options.template || defaultTemplate,
      };
    }
   
    const questions = [];
    if (!options.template) {
      questions.push({
        type: 'list',
        name: 'template',
        message: 'Please choose which project template to use',
        choices: ['Express'],
        default: defaultTemplate,
      });
    }
   
    if (!options.git) {
      questions.push({
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: false,
      });
    }

    if (!options.targetDir) {
      questions.push({
        name: 'targetDir',
        message: 'Creating new project in target directory',
        default: 'my-app',
      });
    }
   
    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      template: options.template || answers.template,
      git: options.git || answers.git,
      targetDir: options.targerDir || answers.targetDir
    };
   }

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    const projectCreated = await createProject(options);
    if(projectCreated) {
      await postProjectCreated(options);
    }
}