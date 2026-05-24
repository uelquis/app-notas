import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { NAV_THEME } from "@lib/theme";

export default function RootLayout() {

  return  <ThemeProvider value={NAV_THEME.light}>
    <Stack />
    <PortalHost />
 </ThemeProvider>
}
