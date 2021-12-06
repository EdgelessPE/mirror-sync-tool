import cp from "child_process";

export function sync(source:string,target:string){
    cp.execSync(`rclone sync "${source}" "${target}" --size-only --include "/*/*.7z"`)
}