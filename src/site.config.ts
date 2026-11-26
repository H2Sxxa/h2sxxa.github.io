export interface SiteMetadataConfig {
  readonly title: string;
  readonly description: string;
  readonly lang: string;
  readonly dateLocale: string;
  readonly ogImage?: string;
}

export interface SocialLink {
  readonly href: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export interface AuthorConfig {
  readonly name: string;
  readonly bio: string;
  readonly avatar: string;
  readonly roles: readonly string[];
  readonly socials: readonly SocialLink[];
}

export interface FabLink {
  readonly href: string;
  readonly label: string;
  readonly icon: string;
}

export interface ExploreLink {
  readonly title: string;
  readonly description: string;
  readonly href: string;
}

export interface FriendLink {
  readonly title: string;
  readonly intro: string;
  readonly link: string;
  readonly avatar: string;
}

export interface NavigationConfig {
  readonly fab: readonly FabLink[];
  readonly explore: readonly ExploreLink[];
  readonly friends: readonly FriendLink[];
}

export interface BlogConfig {
  readonly pageSize: number;
}

export interface GiscusThemeConfig {
  readonly lightCss: string;
  readonly darkCss: string;
  readonly fallbackLight: string;
  readonly fallbackDark: string;
}

export interface GiscusCommentsConfig {
  readonly repo: string;
  readonly repoId: string;
  readonly category: string;
  readonly categoryId: string;
  readonly mapping:
    | "pathname"
    | "url"
    | "title"
    | "og:title"
    | "specific"
    | "number";
  readonly strict: boolean;
  readonly reactionsEnabled: boolean;
  readonly emitMetadata: boolean;
  readonly inputPosition: "top" | "bottom";
  readonly lang: string;
  readonly theme: GiscusThemeConfig;
}

export interface ThemeConfig {
  readonly defaultTheme: "system" | "light" | "dark";
}

export interface SiteConfig {
  readonly site: SiteMetadataConfig;
  readonly author: AuthorConfig;
  readonly navigation: NavigationConfig;
  readonly blog: BlogConfig;
  readonly comments: GiscusCommentsConfig | false;
  readonly theme: ThemeConfig;
}

/**
 * Identity helper providing strict type checking for site configuration.
 */
export function defineSiteConfig(config: SiteConfig): SiteConfig {
  return config;
}

export const siteConfig: SiteConfig = defineSiteConfig({
  site: {
    title: "H2Sxxa's Blog",
    description: "Just share something interesting.",
    lang: "zh-CN",
    dateLocale: "zh-CN",
  },

  author: {
    name: "H2Sxxa",
    bio: "Just Developing for Fun.",
    avatar: "https://avatars.githubusercontent.com/u/88923783",
    roles: ["Full-Stack", "Rustacean", "Modder", "Open-Source Builder"],
    socials: [
      {
        href: "https://github.com/H2Sxxa",
        title: "GitHub",
        description: "My GitHub Profile.",
        icon: "mdi:github",
      },
      {
        href: "https://steamcommunity.com/profiles/76561199187367033/",
        title: "Steam",
        description: "Maybe you want play game with me.",
        icon: "mdi:steam",
      },
      {
        href: "mailto:h2sxxa0w0@gmail.com",
        title: "Email",
        description: "I will check my email every day.",
        icon: "mdi:email",
      },
    ],
  },

  navigation: {
    fab: [
      {
        href: "/",
        label: "Home",
        icon: "mdi:home",
      },
      {
        href: "/blog",
        label: "Blog",
        icon: "mdi:book-open-page-variant",
      },
      {
        href: "/friends",
        label: "Friends",
        icon: "mdi:account-group",
      },
      {
        href: "/explore",
        label: "Explore",
        icon: "mdi:compass-outline",
      },
    ],
    explore: [
      {
        title: "Home",
        description: "平平无奇的首页",
        href: "/",
      },
      {
        title: "Blog",
        description: "在这浏览所有文章",
        href: "/blog",
      },
      {
        title: "About Me",
        description: "关于我",
        href: "/about",
      },
      {
        title: "Friends",
        description: "朋友们的博客",
        href: "/friends",
      },
      {
        title: "Playground",
        description: "一些新奇的尝试",
        href: "/playground",
      },
    ],
    friends: [
      {
        title: "black_trees",
        intro: "幻想乡算法研究所",
        link: "https://enonya.github.io/",
        avatar: "https://avatars.githubusercontent.com/u/77879721",
      },
      {
        title: "NanodaOvO",
        intro: "NanodaOvO's Blog",
        link: "https://nanodaovo.github.io/",
        avatar: "https://avatars.githubusercontent.com/u/106482877",
      },
      {
        title: "Kano",
        intro: "关注鹿乃喵,关注鹿乃谢谢喵",
        link: "https://2754lm.github.io/",
        avatar: "https://avatars.githubusercontent.com/u/86175561",
      },
      {
        title: "lliiooll",
        intro: "柴柴的技术博客",
        link: "https://blog.imoli.moe/",
        avatar: "https://avatars.githubusercontent.com/u/44719954",
      },
      {
        title: "MiaoMint",
        intro: "樱丘女子高等学校轻音部平泽唯",
        link: "http://0u0.ren/",
        avatar: "https://avatars.githubusercontent.com/u/44718819",
      },
      {
        title: "Enonya",
        intro: "black_trees's -> Enonya's Blog",
        link: "https://en0nya.github.io/",
        avatar: "https://avatars.githubusercontent.com/u/77879721",
      },
      {
        title: "YOO_koishi",
        intro: "YOO_koishi's blog",
        link: "https://blog.yookoishi.com/",
        avatar: "https://avatars.githubusercontent.com/u/115394813",
      },
      {
        title: "Amiya_desi",
        intro: "Amiya's Desk",
        link: "https://blog.sayori.org/",
        avatar: "https://avatars.githubusercontent.com/u/288253848",
      },
    ],
  },

  blog: {
    pageSize: 8,
  },

  comments: {
    repo: "H2Sxxa/h2sxxa.github.io",
    repoId: "R_kgDOSuttsw",
    category: "Announcements",
    categoryId: "DIC_kwDOSutts84C-zu8",
    mapping: "pathname",
    strict: false,
    reactionsEnabled: true,
    emitMetadata: false,
    inputPosition: "bottom",
    lang: "zh-CN",
    theme: {
      lightCss: "/giscus-light.css",
      darkCss: "/giscus-dark.css",
      fallbackLight: "light",
      fallbackDark: "dark_dimmed",
    },
  },

  theme: {
    defaultTheme: "system",
  },
});
