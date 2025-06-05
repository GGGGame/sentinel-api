#!/usr/bin/env node
import { Command } from 'commander';
import { env } from '../config/environment';
import { registerCommands } from './Commands/registerCommands';

const program = new Command();

program
  .name('sentinel')
  .description('CLI for SentinelAPI')
  .version('1.0.0');

registerCommands(program);

program.parse(env.ARGV);
