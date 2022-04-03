import Bot from "../structures/Bot";
import Command from "../structures/Command";
import Event from "../structures/Event";
import ShardEvent from "../structures/ShardEvent";
import Logger from "../utils/Logger";
import WebHook from "../utils/WebHook";
declare const _default: {
  Bot: typeof Bot;
  Command: typeof Command;
  Event: typeof Event;
  ShardEvent: typeof ShardEvent;
  Logger: typeof Logger;
  WebHook: typeof WebHook;
  constants: {
    assets: {
      colors: {
        error: string;
        succesfull: string;
        default: string;
        partners: {
          serverblaze: string;
        };
      };
      images: {
        avatar: string;
        logo: {
          png: {
            url: string;
          };
          url: string;
        };
        sponsors: {
          serverblaze: {
            logo_light: string;
          };
          uptimerobot: {
            banners: {
              white: string;
              black: string;
            };
            logo: {
              white: string;
            };
          };
        };
      };
      invite: string;
      statuspage: string;
      votepage: string;
      url: {
        docs: string;
        statuspage: string;
        invite: string;
        discordInvite: string;
        statusWebhook: string;
        messageWebhook: string;
        website: string;
        logs: {
          guilds: string;
          channels: string;
          actions: string;
        };
      };
    };
    emojis: {
      error: string;
      succes: string;
      yes: string;
      statusOnline: string;
      loading: string;
      ram: string;
      root: string;
      host: string;
      blank: string;
      nodeJS: string;
      dev: string;
      err: string;
      uptimerobot: string;
      calender: string;
      discord: {
        js: string;
      };
      discordjs: string;
      channel: string;
      members: string;
      verifiedBot: string;
      developer: string;
      admin: string;
      pin: string;
      status: {
        DND: string;
        OFFLINE: string;
        IDLE: string;
        ONLINE: string;
      };
    };
  };
  emojis: {
    error: string;
    succes: string;
    yes: string;
    statusOnline: string;
    loading: string;
    ram: string;
    root: string;
    host: string;
    blank: string;
    nodeJS: string;
    dev: string;
    err: string;
    uptimerobot: string;
    calender: string;
    discord: {
      js: string;
    };
    discordjs: string;
    channel: string;
    members: string;
    verifiedBot: string;
    developer: string;
    admin: string;
    pin: string;
    status: {
      DND: string;
      OFFLINE: string;
      IDLE: string;
      ONLINE: string;
    };
  };
  assets: {
    colors: {
      error: string;
      succesfull: string;
      default: string;
      partners: {
        serverblaze: string;
      };
    };
    images: {
      avatar: string;
      logo: {
        png: {
          url: string;
        };
        url: string;
      };
      sponsors: {
        serverblaze: {
          logo_light: string;
        };
        uptimerobot: {
          banners: {
            white: string;
            black: string;
          };
          logo: {
            white: string;
          };
        };
      };
    };
    invite: string;
    statuspage: string;
    votepage: string;
    url: {
      docs: string;
      statuspage: string;
      invite: string;
      discordInvite: string;
      statusWebhook: string;
      messageWebhook: string;
      website: string;
      logs: {
        guilds: string;
        channels: string;
        actions: string;
      };
    };
  };
  colors: {
    error: string;
    succesfull: string;
    default: string;
    partners: {
      serverblaze: string;
    };
  };
  images: {
    avatar: string;
    logo: {
      png: {
        url: string;
      };
      url: string;
    };
    sponsors: {
      serverblaze: {
        logo_light: string;
      };
      uptimerobot: {
        banners: {
          white: string;
          black: string;
        };
        logo: {
          white: string;
        };
      };
    };
  };
  permissions: (
    | {
        level: number;
        name: string;
        check: (
          member: import("../helpers/permissions").Member
        ) => import("discord.js").Role | undefined;
      }
    | {
        level: number;
        name: string;
        check: (member: import("../helpers/permissions").Member) => boolean;
      }
  )[];
};
export default _default;
export { default as Bot } from "../structures/Bot";
export { default as Command } from "../structures/Command";
export { default as Event } from "../structures/Event";
export { default as ShardEvent } from "../structures/ShardEvent";
export { default as Logger } from "../utils/Logger";
export { default as WebHook } from "../utils/WebHook";
