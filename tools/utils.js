/* eslint no-console: 0 */
import HappyPack from 'happypack';
import notifier from 'node-notifier';
import colors from 'colors/safe';
import { execSync } from 'child_process';
import appRootDir from 'app-root-dir';

export function happyPackPlugin({ name, loaders }) {
  return new HappyPack({
    id: name,
    verbose: false,
    threads: 5,
    loaders,
  });
}

export function unique(array) {
  return Array.from(new Set(array));
}

export function removeEmpty(x) {
  return x.filter(Boolean);
}

export function ifElse(condition) {
  return function ifElseResolver(then, or) {
    const execIfFuc = x => (typeof x === 'function' ? x() : x);

    return condition ? execIfFuc(then) : (or);
  };
}

export function merge(...args) {
  const filtered = removeEmpty(args);

  if (filtered.length < 1) {
    return {};
  }
  if (filtered.length === 1) {
    return args[0];
  }

  return filtered.reduce((acc, cur) => {
    Object.keys(cur).forEach((key) => {
      if (typeof acc[key] === 'object' && typeof cur[key] === 'object') {
        acc[key] = merge(acc[key], cur[key]); // eslint-disable-line no-param-reassign
      } else {
        acc[key] = cur[key]; // eslint-disable-line no-param-reassign
      }
    });

    return acc;
  }, {});
}

export function log(options) {
  const title = `${options.title.toUpperCase()}`;

  if (options.notify) {
    notifier.notify({
      title,
      message: options.message,
    });
  }

  const level = options.level || 'info';
  const msg = `==> ${title} -> ${options.message}`;

  switch (level) {
    case 'warn': console.log(colors.red(msg)); break;
    case 'error': console.log(colors.bgRed.white(msg)); break;
    case 'info':
    default: console.log(colors.green(msg));
  }
}

export function exec(command) {
  execSync(command, { stdio: 'inherit', cwd: appRootDir.get() });
}

export function without(source, remove) {
  return source.filter(module => remove.findIndex(x => x === module) === -1);
}
