import express from 'express';
import { resolve } from 'path';
import appRootDir from 'app-root-dir';
import config from '../../../config';

const outputPath = resolve(appRootDir.get(), config.bundles.client.outputPath);

export default express.static(outputPath, { maxAge: config.browserCacheMaxAge });
