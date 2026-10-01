export const createWebSocket = (url: string, signal: AbortSignal): WebSocket => {
  const ws = new WebSocket(url);

  if (signal.aborted) {
    ws.close();
  } else {
    signal.addEventListener(
      'abort',
      () => {
        ws.close(1000, 'Operation aborted');
      },
      { once: true },
    );
  }

  return ws;
};
