"use client";
import { AppShell, AppShellProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavbarSimpleColored } from "./NavbarSimpleColored";

const CITAppShell: React.FC<AppShellProps> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      aside={{
        width: 300,
        breakpoint: "md",
        collapsed: { desktop: false, mobile: true },
      }}
      padding={{ base: 10, sm: 15, lg: "xl" }}
    >
      <AppShell.Navbar p="md">
        <NavbarSimpleColored />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default CITAppShell;
