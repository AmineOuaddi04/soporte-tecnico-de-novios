self.addEventListener("push", event => {
  const notice = event.data?.json() ?? {};
  event.waitUntil(self.registration.showNotification("Entre tú y yo", {
    body: notice.body || "Tienes novedades.",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAIAAADdvvtQAAAEFUlEQVR4nO3dzbEbVRSF0WuKZEiECMiEATFQBZkQJAO5xEPv19qt7n3Ua409OH3u19ey7Hr+9tcvvy64109HD8BsAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiLy89EDbOD3f/78+Bf8/dsf+0xyo3awDX2b+3+mfno8r+1zYLWDPcK8gO44ntcecWC1gz3UpIA2OaGrbY+qebaHGhPQtid0lR9V7WD7GBDQg07opftOq3awPbX/MX6HQ2rW//i9N9D+u/v66948287abyDKld5AB17dH7/rtYMdpfEG6v+N/xCda6kL6PA1fTBA82xH6QqoZEFvjtE824G6AmKcooCq3q2bYZpnO1ZRQEzUElDVW3VxHal5tsO1BMRQFV8k9rxPszR8tegGIiIgIgIicnxAPgDdrWF1xwfEaAIiIiAiAiIiICICIiIgIscH1PAXOkM1rO74gBhNQEQERKQioIbfy8cpWVpFQMzVElDJ+zRFz7paAmIoAREpCqjnWi5XtaiigJioK6Cqd6tT24q6AmKcuoDa3rAqhcupC2hVrqlB51oaA1qtyzpQ7UJKA2KK3oBq37n9Na+iN6DVvbjdlC+hOqBVv75H63/89oDWhCU+yIgHHxDQGrLKbU155BkBrTkL3cSghx0T0Bq11sSsx5wU0Jq23DuMe8BhAa2BK/66iY82L6A1c9GfGvpQIwNaY9f9nrmPMzWgNXnpN0Y/yOCA1vDVX0x/hIqfVJ9r+HmlP2p6Ohezb6CrcYcxbuD3PElAa9SRDBr1U88T0BpyMCOG/LqnCmjVH0/5eHd4toBW8SHVDpZ4woBW5VEVjrSJ5wxolR1Y1TDbetqAVs2xlYzxIE/yReLHjvqa8bnTuXjmG+jqkIM8Qz3rJAGt3Y/zJPWs8wS0djzU89SzThXQ2uVoT1XPOsmH6Nce8bH6bOlcnOsGYnMnDWjz2+Kc1886bUBr0yM/bT3rtJ+BXko+D505nYvz3kBsQkD33yKunyWgiztSUM+FgL77oSDUcyWg/3wxC/W8JKD/+TQO9dwQEBEB3frgjnH9vCYgIgJ6w5s3jevnTQJ6200u6nmPgIgI6F3XW8f18wEBEREQEQER8Q/KiLiBiAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiIiICICIiIgIgIiIiAiAiIiICI/AvY9ujfUWk8fAAAAABJRU5ErkJggg==",
    data: { ticket: notice.ticket, memory: notice.memory },
  }));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL("./", self.registration.scope);
  if (event.notification.data?.memory) {
    target.searchParams.set("memory", event.notification.data.memory);
  } else if (event.notification.data?.ticket) {
    target.searchParams.set("ticket", event.notification.data.ticket);
  }
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const app = windows.find(client => client.url.startsWith(self.registration.scope));
    if (app) {
      const navigated = await app.navigate(target.href);
      if (navigated) return navigated.focus();
    }
    return self.clients.openWindow(target.href);
  })());
});
