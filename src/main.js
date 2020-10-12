import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';


const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
 return copy(options.templateDirectory, options.targetDirectoryPath, {
   clobber: false,
 });
}

async function initGit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectoryPath,
    });
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize git'));
    }
    return;
}

async function createProjectDir(options) {
  const result = await execa('mkdir', [options.targetDir,"-p"]);
  if (result.failed) {
      return Promise.reject(new Error('Failed to initialize project directory'));
  }
  return;
}

   
export async function createProject(options) {
 options = {
   ...options,
   targetDirectoryPath: process.cwd()+`/${options.targetDir}`,
 };

 const currentFileUrl = import.meta.url;
 const templateDir = path.resolve(
   new URL(currentFileUrl).pathname,
   '../../templates',
   options.template.toLowerCase()
 );
 options.templateDirectory = templateDir;

 try {
   await access(templateDir, fs.constants.R_OK);
 } catch (err) {
   console.error('%s Invalid template name', chalk.red.bold('ERROR'));
   process.exit(1);
 }

 const tasks = new Listr([
    {
      title: 'Creating project directory',
      task: () => createProjectDir(options),
    },
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Initialize git',
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: 'Install dependencies',
      task: () =>
        projectInstall({
          cwd: options.targetDirectoryPath,
        }),
      skip: () =>
        !options.runInstall
          ? 'Pass --install to automatically install dependencies'
          : undefined,
    },
  ]);

 await tasks.run();
 console.log('%s Project ready', chalk.green.bold('DONE'));
 return true;
}