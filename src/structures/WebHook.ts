import axios from "axios";

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

  constructor(webhook_url: string) {
    this.url = null;
    this.content = null;
    this.title = null;
    this.description = null;
    this.color = null;
    this.author = {
      name: null,
      url: null,
      icon_url: null,
    };
    this.footer = {
      text: null,
      icon_url: null,
    };
    this.timestamp = null;
    this.webhook_url = webhook_url;
  }

  public async send(): Promise<void> {
    const objBody = {
      content: this?.content,
      embeds:
        this.description || this.title
          ? [
              {
                title: this.title,
                description: this.description,
                url: this.url,
                color: this.color ? this.color : null,
                author: {
                  name: this.author.name ? this.author.name : null,
                  url: this.author.url ? this.author.url : null,
                  icon_url: this.author.icon_url ? this.author.icon_url : null,
                },
                footer: {
                  text: this.footer.text ? this.footer.text : null,
                  icon_url: this.footer.icon_url ? this.footer.icon_url : null,
                },
                timestamp: this.timestamp ? this.timestamp : null,
              },
            ]
          : [],
    };

    if (!this.webhook_url) throw new SyntaxError("No WebHook URL");

    await axios({
      method: "post",
      url: this.webhook_url,
      data: JSON.stringify(objBody),
      headers: { "Content-Type": "application/json" },
    }).catch(console.error);

    return;
  }

  public setAuthor(name: string, icon_url: string | null = null, url: string | null = null): WebHook {
    this.author.name = name;
    this.author.icon_url = icon_url;
    this.author.url = url;
    return this;
  }

  public setUrl(url: string): WebHook {
    this.url = url;
    return this;
  }

  public setColor(color: string): WebHook {
    this.color = parseInt(color.replace("#", ""), 16);
    if (isNaN(this.color) || !this.color) throw new SyntaxError("Invalid Color");
    return this;
  }

  public setTitle(text: string): WebHook {
    this.title = text;
    return this;
  }

  public setContent(text: string): WebHook {
    this.content = text;
    return this;
  }

  public setDescription(text: string): WebHook {
    this.description = text;
    return this;
  }

  public setFooter(text: string, icon_url: string | null = null): WebHook {
    this.footer.text = text;
    this.footer.icon_url = icon_url;
    return this;
  }

  public setTimestamp(timestamp: number = new Date().getTime()): WebHook {
    this.timestamp = new Date(timestamp).toISOString();
    return this;
  }
}
