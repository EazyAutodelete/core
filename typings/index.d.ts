declare module "@eazyautodelete/eazyautodelete-core" {
  import {
    Collection,
    Guild,
    Message,
    Client,
    GuildMember,
    User,
    MessageEmbed,
    MessageActionRow,
    ApplicationCommandOptionData,
    CommandInteraction,
    SelectMenuInteraction,
    ConstantsClientApplicationAssetTypes,
  } from "discord.js";
  import { APIGuild, APIMessage } from "discord-api-types/v10";
  import {
    translate,
    Translator,
    locales,
  } from "@eazyautodelete/eazyautodelete-lang";
  import DatabaseHandler from "@eazyautodelete/eazyautodelete-db-client";
  import { Console } from "console";

  const images: {
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

  const colors: {
    error: string;
    succesfull: string;
    default: string;
    partners: {
      serverblaze: string;
    };
  };

  const assets: {
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

  const emojis: {
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

  const constants: {
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

  export class WebHook {
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
    send(): any;
    setAuthor(
      name: string,
      icon_url?: string | null,
      url?: string | null
    ): this;
    setUrl(url: string): this;
    setColor(color: string): this;
    setTitle(text: string): this;
    setContent(text: string): this;
    setDescription(text: string): this;
    setFooter(text: string, icon_url?: string | null): this;
    setTimestamp(timestamp?: number): this;
  }

  export class Command {
    client: Bot;
    config: {
      options: ApplicationCommandOptionData[];
      name: string;
      description: string;
      cooldown: number;
      usage: string;
      example: string;
      permissionLevel: string;
    };
    help: {
      name: string;
      description: string;
      permissionLevel: string;
      cooldown: number;
      usage: string;
      example: string;
      aliases: string[];
    };
    data: {
      name: string;
      description: string;
      options: Array<ApplicationCommandOptionData>;
    };
    assets: typeof assets;
    colors: typeof colors;
    emojis: typeof emojis;
    Logger: Logger;
    reply: (
      interaction: CommandInteraction,
      input: string | MessageEmbed | any,
      ephemeral: boolean | undefined,
      components: MessageActionRow | any
    ) => Promise<void>;
    constructor(
      client: Bot,
      {
        name,
        description,
        dirname,
        permissionLevel,
        cooldown,
        aliases,
        example,
        usage,
        options,
      }: CommandOptions
    );
    docsButton(url: string): MessageActionRow;
    run(interaction: CommandInteraction): Promise<void>;
    autocompleteHandler(query: string): never[];
    selectMenuHandler(interaction: SelectMenuInteraction): void;
    translate(options: any): any;
    response(
      interaction: CommandInteraction,
      input: string | MessageEmbed | any,
      ephemeral: boolean | undefined,
      components: MessageActionRow | any
    ): Promise<void>;
    error(interaction: CommandInteraction, text: string): Promise<void>;
    get embed(): MessageEmbed;
    get shard(): any;
  }

  export class Logger extends Console {
    constructor();
    info(input: string, type?: string): void;
    error(input: string): void;
    warn(input: string): void;
    command(command: string, user: User): void;
    date(msTimeStamp?: number): string;
  }

  export class Bot extends Client {
    config: any;
    wait: <T = void>(
      delay?: number | undefined,
      value?: T | undefined,
      options?: import("timers").TimerOptions | undefined
    ) => Promise<T>;
    allShardsReady: boolean;
    customEmojis: typeof emojis;
    startedAt: Date;
    startedAtString: string;
    activeEvents: string[];
    eventLog: string;
    shard: any;
    stats: {
      commandsRan: number;
    };
    locales: locales;
    Translator: Translator;
    translate: translate;
    cooldownUsers: Collection<string, number>;
    commands: Collection<string, Command>;
    disabledCommands: Map<any, any>;
    ready: boolean;
    Logger: Logger;
    logger: Logger;
    loggedActions: {
      messages: Map<any, any>;
      commands: Map<any, any>;
    };
    database: DatabaseHandler;
    activeChannels: string[];
    checkedChannels: string[];
    filters: {
      FLAGS: {
        PINNED: string;
        NOT_PINNED: string;
        REGEX: string;
        NOT_REGEX: string;
        ALL: string;
        WITH_LINK: string;
        WITHOUT_LINK: string;
        WITH_EMOJIS: string;
        WITHOUT_EMOJIS: string;
        WITH_ATTACHMENT: string;
        WITHOUT_ATTACHMENT: string;
        USAGE_ALL: string;
        USAGE_ONE: string;
      };
    };
    eventLogPath: string;
    assets: typeof assets;
    colors: typeof colors;
    constructor(config: any);
    logEvent(eventName: string): void;
    filterMessages(
      messages: Message[] | APIMessage[],
      filters: string[],
      filterUsage: string,
      regex: RegExp
    ): Collection<any, any>;
    logAction(action: string, duration: number): boolean;
    modeToString(mode: number): string;
    filterToString(filter: number): string;
    filterUsageToString(filterUsage: string): string;
    bulkDelete(
      channel: string,
      messages: Collection<string, Message> | any
    ): Promise<void | string[]>;
    createDeleteLog(
      channelId: string,
      messages: Collection<string, Message> | any
    ): void;
    parseDuration(duration: number): string;
    parseDate(timestamp: string): string;
    clientValue(value: string): Promise<Array<string>>;
    sendShardWebhook(message: string): void;
    sendGuildWebhook(message: string): void;
    shardEval(input: string): Promise<Array<string>>;
    resolveMember(search: string, guild: Guild): Promise<GuildMember | void>;
    getApiGuild(id: string): Promise<APIGuild>;
    getApiUser(id: string): Promise<any | void>;
    registerEvents(dir?: string): Promise<void>;
    registerCommands(dir?: string): Promise<void>;
  }

  export class Event {
    name: string;
    client: Bot;
    emojis: typeof emojis;
    colors: typeof colors;
    assets: typeof assets;
    constructor(name: string, client: Bot);
    run(client: Bot, arg1: any, arg2: any, arg3: any): Promise<any>;
    getShard(client: Bot): number;
  }

  export class ShardEvent extends Event {
    constructor(name: string, client: Bot);
    get isShardEvent(): boolean;
  }

  export interface Member extends GuildMember {
    client: Bot;
  }

  export interface CommandOptions {
    name: string;
    description: string;
    dirname: string;
    permissionLevel: string;
    cooldown: number;
    aliases: Array<string>;
    example: string;
    usage: string;
    options: Array<ApplicationCommandOptionData>;
  }

  const core: {
    Bot: typeof Bot;
    Command: typeof Command;
    Event: typeof Event;
    ShardEvent: typeof ShardEvent;
    Logger: typeof Logger;
    WebHook: typeof WebHook;
  };
  export default core;
}
