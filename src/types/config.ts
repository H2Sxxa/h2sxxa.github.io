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

export interface TopLevelRouteConfig {
  readonly path: string;
  readonly label: string;
  readonly section?: string;
  readonly index?: string;
}

export interface NavigationConfig {
  readonly fab: readonly FabLink[];
  readonly explore: readonly ExploreLink[];
  readonly friends: readonly FriendLink[];
  readonly routes: readonly TopLevelRouteConfig[];
}

export interface BlogConfig {
  readonly pageSize: number;
}

export interface CommandPaletteLink {
  readonly group?: string;
  readonly title: string;
  readonly subtitle: string;
  readonly href: string;
  readonly keywords?: string;
}

export interface CommandPaletteConfig {
  readonly enabled: boolean;
  readonly placeholder: string;
  readonly resultLimit: number;
  readonly links?: readonly CommandPaletteLink[];
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
  readonly hue: number;
  readonly tertiaryHue?: number;
}

export interface SiteConfig {
  readonly site: SiteMetadataConfig;
  readonly author: AuthorConfig;
  readonly navigation: NavigationConfig;
  readonly blog: BlogConfig;
  readonly commandPalette: CommandPaletteConfig;
  readonly comments: GiscusCommentsConfig | false;
  readonly theme: ThemeConfig;
}

/**
 * Identity helper providing strict type checking for site configuration.
 */
export function defineSiteConfig(config: SiteConfig): SiteConfig {
  return config;
}
