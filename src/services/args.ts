import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

export const CLI_ARGS = {
  env: (args.env || 'local') as 'local' | 'production',
  debug: !!args.debug
}