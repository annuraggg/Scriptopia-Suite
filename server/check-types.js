import { exec } from "child_process";
import chalk from "chalk";
import ora from "ora";

const spinner = ora({
  text: "Checking for type errors...",
  color: "cyan",
  spinner: "monkey",
}).start();

exec("tsc --noEmit", (error, stdout, stderr) => {
  spinner.stop();

  if (error) {
    console.error(chalk.red.bold("Error occurred during type checking:"));
    console.error(chalk.red(stderr));
    console.error(chalk.red(error));
    console.error(chalk.red.bold("TypeScript type checking failed."));
    process.exit(1);
  } else {
    if (stdout.trim()) {
      console.log(chalk.yellow.bold("TypeScript Errors:"));
      console.log(chalk.yellow(stdout));
    } else {
      console.log(chalk.green.bold("✔ No type errors found!"));
    }
    process.exit(0);
  }
});
