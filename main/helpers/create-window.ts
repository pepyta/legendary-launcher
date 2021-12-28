import { ChildProcessWithoutNullStreams, exec, execSync, spawn } from 'child_process';
import {
  screen,
  BrowserWindowConstructorOptions,
  ipcMain,
} from 'electron';
import { BrowserWindow, setVibrancy } from 'electron-acrylic-window';
import Store from 'electron-store';
import { release } from 'os';

function isVibrancySupported() {
  // Windows 10 or greater
  return (
    process.platform === 'win32' &&
    parseInt(release().split('.')[0]) >= 10
  )
}

const onGoingSupprocesses: Map<number, ChildProcessWithoutNullStreams> = new Map();

/**
 * Get shell for different os
 * @returns Windows: powershell
 * @returns unix: $SHELL or /usr/bin/bash
 */
const getShell = () => {
  // Dont change this logic since Heroic will break when using SH or FISH
  switch (process.platform) {
    case 'win32':
      return 'powershell.exe'
    case 'linux':
      return '/bin/bash'
    case 'darwin':
      return '/bin/zsh'
    default:
      return '/bin/bash'
  }
};

export default (windowName: string, options: BrowserWindowConstructorOptions): BrowserWindow => {
  const key = 'window-state';
  const name = `window-state-${windowName}`;
  const store = new Store({ name });
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {};
  let win: BrowserWindow;

  const restore = () => store.get(key, defaultSize);

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = windowState => {
    const visible = screen.getAllDisplays().some(display => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
  };

  state = ensureVisibleOnSomeDisplay(restore());

  let vibrancy: any = 'dark';

  if (isVibrancySupported()) {
    vibrancy = {
      theme: 'dark',
      effect: 'acrylic',
      disableOnBlur: true,
      useCustomWindowRefreshMethod: false,
    }
  }

  const browserOptions: BrowserWindowConstructorOptions = {
    ...options,
    ...state,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      ...options.webPreferences,
    },
  };

  win = new BrowserWindow(browserOptions);

  setVibrancy(win, vibrancy);

  ipcMain.on("kill-signal", (e, pid: number) => {
    onGoingSupprocesses.get(pid)?.kill();
  });

  ipcMain.on("command-handler", (event, id: string, args: string[]) => {
    const handlerChannel = `command-handler-response-${id}`;
    console.log(`exec ${args}...`);

    const onCloseListener = () => event.reply(handlerChannel, "close");
    const onDataListener = (data) => event.reply(handlerChannel, "data", data.toString());
    const onErrorListener = (data) => event.reply(handlerChannel, "data", data.toString());

    const head = args.shift();
    const instance = spawn(head, args);
    onGoingSupprocesses.set(instance.pid, instance);

    event.reply(handlerChannel, "pid", instance.pid);

    instance.on("close", () => {
      onCloseListener();
      onGoingSupprocesses.delete(instance.pid);
      instance.removeAllListeners();
    });

    instance.stdout.on("data", onDataListener);
    instance.stderr.on("data", onErrorListener);
    instance.stdout.on("error", onErrorListener);
    instance.stderr.on("error", onErrorListener);
  });


  ipcMain.on("command-handler-exec-sync", (event, cmd: string) => {
    console.log(`[Command Handler] execAsync ${cmd}`);

    const MAX_BUFFER = 25 * 1024 * 1024 // 25MB should be safe enough for big installations even on really slow internet

    const execOptions = {
      maxBuffer: MAX_BUFFER,
      shell: getShell(),
    }

    try {
      execSync(cmd, execOptions);
    } catch(e) {
      console.error(e);
    }
  });

  ipcMain.on("maximize", () => win.maximize());
  ipcMain.on("close", () => win.close());
  ipcMain.on("restore", () => win.restore());
  ipcMain.on("minimize", () => win.minimize());

  ipcMain.on("isMaximized", (e) => {
    e.reply("isMaximized-reply", win.isMaximized());
    win.on("maximize", () => e.reply("isMaximized-reply", win.isMaximized()));
    win.on("resize", () => e.reply("isMaximized-reply", win.isMaximized()));
  });

  win.on('close', saveState);

  return win;
};
