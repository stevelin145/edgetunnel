const env = {
  p: "trojan",                 // 默认密码
  tt: "target.proxy.ip",       // 原 proxyip 改为 tt
  ip1: "target.ip.address",    // 目标服务器 IP
  pt1: "2053",                 // 端口改为 2053
  cdnip: "",                   // CDN IP（可选）
  sy: "https://cn.bing.com"    // 首页伪装网址默认值
};

async function handleTCPOutBound(request, targetHost, targetPort) {
  // TCP代理逻辑保留
}

function parseygkkkHeader(request) {
  // WebSocket头解析逻辑保留
}

async function ygkkkOverWSHandler(request) {
  // WebSocket代理逻辑保留
}

const worker_default = {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const p = env.p;
    const tt = env.tt;
    const hostName = request.headers.get("host");

    switch (pathname) {
      case "/":
        if (env.sy && env.sy.trim() !== "") {
          // 如果 sy 有值，直接 fetch 该网址内容
          try {
            return await fetch(env.sy);
          } catch (err) {
            return new Response("Error fetching sy URL: " + err.message, { status: 502 });
          }
        } else {
          // 默认伪装首页
          return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Welcome</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #333; }
              </style>
            </head>
            <body>
              <h1>Welcome to My Site</h1>
              <p>This is a normal website.</p>
            </body>
            </html>
          `, { headers: { "Content-Type": "text/html" } });
        }

      case `/${p}`:
        return new Response("OK", { status: 200 });

      case `/${p}/ws`:
        return ygkkkOverWSHandler(request);

      case `/${p}/tcp`:
        const targetHost = env.ip1 || tt;
        const targetPort = env.pt1;
        return handleTCPOutBound(request, targetHost, targetPort);

      default:
        return new Response("Not Found", { status: 404 });
    }
  }
};

export default worker_default;
