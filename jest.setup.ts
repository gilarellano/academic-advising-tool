if (process.env.HIDE_LOGS === 'true') {
    global.console = {
      log: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      // Include any other methods you need to mock
    } as unknown as Console;
  }
  