import { headers } from "next/headers";

type DeviceInfoResult = {
  browser: string;
  os: string;
};

const browsers = ["Chrome", "Firefox", "Safari", "Edge"];
const OS = ["Windows", "Mac", "Linux", "Android", "iOS"];
export async function getDeviceInfo(): Promise<DeviceInfoResult> {
  const userAgent = (await headers()).get("user-agent") || "";

  
  const  browser =
    browsers.find((browser) => userAgent.includes(browser)) ?? "Unknown";
  const os = OS.find((os) => userAgent.includes(os)) ?? "Unknown";

  return { browser, os };
}
