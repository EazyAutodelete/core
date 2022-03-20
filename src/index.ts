import Bot          from "../structures/Bot";
import Command      from "../structures/Command";
import Event        from "../structures/Event";
import ShardEvent   from "../structures/ShardEvent";
import Logger       from "../utils/Logger";
import WebHook      from "../utils/WebHook";
import Utils        from "../utils/Utils";
import constants    from "../constants/constants";
import emojis       from "../constants/emojis/emojis";
import assets       from "../constants/assets/assets";
import colors       from "../constants/assets/colors/colors";
import images       from "../constants/assets/img/images";
import permissions  from "../helpers/permissions";

const core = {
    Bot,
    Command,
    Event,
    ShardEvent,
    Logger,
    WebHook,
    Utils,
    constants,
    emojis,
    assets,
    colors,
    images,
    permissions
};

export default core;