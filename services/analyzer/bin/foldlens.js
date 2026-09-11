#!/usr/bin/env node
import { runCli } from '../dist/index.js';

runCli().catch((err) => {
  console.error('FoldLens CLI Error:', err);
  process.exit(1);
});
