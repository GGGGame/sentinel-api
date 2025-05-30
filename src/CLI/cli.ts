#!/usr/bin/env node
import { Command } from 'commander';
import { env } from '../config/environment';

const program = new Command();

program
  .name('sentinel')
  .description('CLI for SentinelAPI')
  .version('1.0.0');

program
  .command('test')
  .description('Start the SentinelAPI server')
  .action(() => {
    console.log('Test command sentinel-api')
  });

program.parse(env.ARGV);
