import cp from "child_process";
import {log} from "./utils";

export function sync(source: string, target: string) {
    log("Info:Transferring data...")
    cp.execSync(`rclone sync "${source}" "${target}" --size-only --include "/*/*.7z"`)
    log("Info:Data transferred")
}
