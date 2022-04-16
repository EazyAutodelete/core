export default class WebHook {
  url: null | string;
  content: null | string;
  title: null | string;
  description: null | string;
  color: null | number;
  author: {
    name: null | string;
    url: null | string;
    icon_url: null | string;
  };
  footer: {
    text: null | string;
    icon_url: null | string;
  };
  timestamp: null | string;
  webhook_url: string;
  constructor(webhook_url: string);
  send(): void;
  setAuthor(name: string, icon_url?: string | null, url?: string | null): this;
  setUrl(url: string): this;
  setColor(color: string): this;
  setTitle(text: string): this;
  setContent(text: string): this;
  setDescription(text: string): this;
  setFooter(text: string, icon_url?: string | null): this;
  setTimestamp(timestamp?: number): this;
}
