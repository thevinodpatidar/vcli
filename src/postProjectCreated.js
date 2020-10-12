import chalk from 'chalk';

export async function postProjectCreated(options){
    console.log(chalk.blue(`Change directory to ${options.targetDir}`))
    console.log(chalk.cyan(`cd ${options.targetDir}`));
}