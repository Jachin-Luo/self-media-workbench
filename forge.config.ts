import { spawn } from 'node:child_process';
import path from 'node:path';
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    executableName: 'self-media-workbench',
    ignore: (filePath) => {
      if (!filePath) return false;
      const includedPaths = [
        '/.vite',
        '/drizzle',
        '/node_modules/better-sqlite3',
        '/node_modules/bindings',
        '/node_modules/file-uri-to-path',
      ];
      return !includedPaths.some(
        (includedPath) =>
          filePath === includedPath ||
          filePath.startsWith(`${includedPath}/`) ||
          includedPath.startsWith(`${filePath}/`),
      );
    },
  },
  rebuildConfig: {
    ignoreModules: ['better-sqlite3'],
  },
  hooks: {
    packageAfterCopy: async (_forgeConfig, buildPath, electronVersion, platform, arch) => {
      await installBetterSqlitePrebuild(buildPath, electronVersion, platform, arch);
    },
  },
  makers: [new MakerSquirrel({}), new MakerZIP({}, ['win32', 'darwin'])],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      build: [
        { entry: 'src/main/index.ts', config: 'vite.main.config.ts', target: 'main' },
        { entry: 'src/preload/index.ts', config: 'vite.preload.config.ts', target: 'preload' },
      ],
      renderer: [{ name: 'main_window', config: 'vite.renderer.config.ts' }],
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

function installBetterSqlitePrebuild(
  buildPath: string,
  electronVersion: string,
  platform: string,
  arch: string,
): Promise<void> {
  const prebuildInstall = path.resolve('node_modules', 'prebuild-install', 'bin.js');
  const modulePath = path.join(buildPath, 'node_modules', 'better-sqlite3');

  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        prebuildInstall,
        '--runtime',
        'electron',
        '--target',
        electronVersion,
        '--platform',
        platform,
        '--arch',
        arch,
        '--force',
      ],
      { cwd: modulePath, stdio: 'inherit' },
    );

    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`better-sqlite3 预编译包安装失败，退出码：${code ?? 'unknown'}`));
    });
  });
}

export default config;
