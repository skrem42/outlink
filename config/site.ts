export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Link in Bio",
  description: "Manage your links, creators, domains and analytics all in one place.",
  navItems: [
    {
      label: "My Links",
      href: "/dashboard/links",
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
    },
    {
      label: "My Creators",
      href: "/dashboard/creators",
    },
    {
      label: "Domains",
      href: "/dashboard/domains",
    },
  ],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "My Links",
      href: "/dashboard/links",
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
    },
    {
      label: "My Creators",
      href: "/dashboard/creators",
    },
    {
      label: "Domains",
      href: "/dashboard/domains",
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
