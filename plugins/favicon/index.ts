import path from 'path';

import { DEFAULT_OPTIONS } from './etc/constants';
import log from './lib/log';
import { generateFavicons, parseHtml } from './lib/utils';
import validate from './lib/validate-options';

import type { FaviconsPluginOptions } from './etc/types';
import type { FaviconResponse } from 'favicons';
import type { PluginContext } from 'rollup';
import type { Plugin, HtmlTagDescriptor, ResolvedConfig } from 'vite';


export default function faviconsPlugin(userOpts: FaviconsPluginOptions) {
  const plugin: Plugin = { name: 'favicons-plugin' };
  const opts = validate({ ...DEFAULT_OPTIONS, ...userOpts }) as FaviconsPluginOptions;
  let parsedHtml: Array<HtmlTagDescriptor> = [];
  let base = '';

  /**
   * Called during the `generateBundle` phase to add assets to the compilation
   * and update the HTML returned by favicons for injection later.
   */
  const emitFiles = (ctx: PluginContext, response: FaviconResponse) => {
    const { files, html, images } = response;

    // Map each file and image returned from `favicons` into an object
    // containing its original name and the resolved name (ie: name it will have
    // in the output bundle).
    const emittedFiles = [...files, ...images].map(file => {
      const id = ctx.emitFile({
        type: 'asset',
        name: path.join(opts.path ?? '', file.name),
        source: file.contents
      });

      const resolvedName = ctx.getFileName(id);
      log.silly(log.prefix('emit'), log.chalk.green(resolvedName));
      return { id, name: file.name, resolvedName };
    });

    // Transform paths in emitted HTML tags using the filenames generated by
    // Vite.
    parsedHtml = parseHtml(emittedFiles, html, base);
  };


  /**
   * During the `generateBundle` phase, generate favicons and emit files to
   * the compilation.
   */
  plugin.generateBundle = async function(this: PluginContext) {
    const time = log.createTimer();
    const response = await generateFavicons(opts);
    log.verbose(`Generated assets in ${log.chalk.yellow(time)}.`);
    emitFiles(this, response);
  };


  /**
   * During the `transformHtml` phase, return a list of HtmlTagDescriptors to
   * inject.
   */
  plugin.transformIndexHtml = () => {
    if (opts.inject) {
      return parsedHtml;
    }
  };


  plugin.configResolved = (config: ResolvedConfig) => {
    base = config.base;
  }

  return plugin;
}
