import fetch from 'cross-fetch';

class RequestManager {
  constructor(maxRequests) {
    this.max = maxRequests;
  }
  count = 0;
  queue = [];
  async execute(request, after) {
    this.count++;
    await request();
    this.count--;
    after();
    this.checkQueue();
  }
  async add(request, after = () => {}) {
    if (this.count < this.max) {
      this.execute(request, after);
    } else {
      this.queue.push({request, after});
    }
  }
  checkQueue() {
    let i = 0;
    for (; i < this.max - this.count && i < this.queue.length; i++) {
      const {request, after} = this.queue[i];
      this.execute(request, after);
    }
    this.queue = this.queue.slice(i);
  }
}

class Crawler {
  static searchInHTML(html) {
    return [...html.matchAll(/<a.*?href="([^"]*)".*?>/g)].map((search) => {
      return search[1];
    });
  }
  static prepareUrl(url, parentUrl) {
    if (/^https?:\/\//.test(url)) {
      return url;
    }
    // relative reference
    if (url.startsWith('//')) {
      return `${new URL(parentUrl).protocol}${url}`;
    }

    if (url.startsWith('/')) {
      return `${new URL(parentUrl).origin}${url}`;
    }
  }
  static new(...args) {
    return new Crawler(...args);
  }
  constructor(url, maxDepth, maxRequests) {
    this.maxDepth = maxDepth;
    this.requests = new RequestManager(maxRequests);
    this.url = url;
    this.urlsToParse.push({
      url,
      depth: 0,
    });
  }
  urls = {};
  urlsToParse = [];
  lastIndex = 0;
  resolve = null;

  async start() {
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.handleUrl(this.url, 0);
    return promise;
  }
  async handleUrl(url, depth) {
    this.urls[url] = true;
    this.requests.add(async () => {
      if (depth >= this.maxDepth) {
        return;
      }
      try {
        const response = await fetch(url);
        const html = await response.text();
        const parsedUrls = Crawler.searchInHTML(html);

        const newUrls = parsedUrls.filter((url) => {
          return !this.urls[url];
        });
        newUrls.forEach((newUrl) => {
          const preparedUrl = Crawler.prepareUrl(newUrl, url);
          if (!preparedUrl) {
            return;
          }
          this.urlsToParse.push({
            url: preparedUrl,
            depth: depth + 1,
          });
        });
      } catch (e) {}
    }, this.afterRequest);
  }
  afterRequest = () => {
    for (let i = this.lastIndex + 1; i < this.urlsToParse.length; i++) {
      const {url, depth} = this.urlsToParse[i];
      this.handleUrl(url, depth);
    }
    this.lastIndex = this.urlsToParse.length - 1;

    if (
      this.requests.queue.length === 0 &&
      this.requests.count === 0 &&
      this.lastIndex === this.urlsToParse.length - 1
    ) {
      this.resolve(Object.keys(this.urls));
    }
  };
}
export default Crawler;
