"use client";

import { useState } from "react";
import { Group, Title } from "@mantine/core";
import {
  IconLogout,
  IconUser,
  IconHome,
  IconPencilPlus,
  IconPencil,
} from "@tabler/icons-react";
import classes from "./NavbarSimpleColored.module.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const data = [
  { link: "/account", label: "Account", icon: IconUser },
  { link: "/home", label: "Home", icon: IconHome },
  { link: "/create-session", label: "Create Sesison", icon: IconPencilPlus },
  { link: "/sessions", label: "Sessions", icon: IconPencil },
];

export function NavbarSimpleColored() {
  const [active, setActive] = useState<string>("Home");
  const router = useRouter();
  const pathname = usePathname();

  const links = data.map((item) => (
    <Link
      className={`${classes.link} ${
        item.link === pathname ? classes.active : ""
      }`}
      href={item.link}
      key={item.label}
      data-active={item.label === active || undefined}
      onClick={() => setActive(item.label)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  const handleLogout = (event: any) => {
    event.preventDefault();
    localStorage.removeItem("jwt");
    router.push("/auth");
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Title order={2} c="white">
            CIT - Dashboard
          </Title>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <Link
          href="/auth"
          className={classes.link}
          onClick={(event) => handleLogout(event)}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
}
