import {solveIllegalName, solveRepeated} from "./jury";
import {generate} from "./listGenerator";
import {solveUpdate} from "./updater";
import {log} from "./utils";
import {sync} from "./rclone";


export const config = {
    LOCAL_ROOT: "E:/Edgeless/OneDrive - 洛阳科技职业学院/插件包",
    REMOTE_ROOT: "pineapple:/hdisk/edgeless/插件包",
    NEWLY_ADDED: "D:/Download",
};

async function main() {
    //从服务器向本地同步
    sync(config.REMOTE_ROOT,config.LOCAL_ROOT)
    //解决本地根目录名称合法性问题
    await solveIllegalName(config.LOCAL_ROOT, false);
    //读取本地根目录和新增目录
    let rootList = generate(config.LOCAL_ROOT, false);
    //处理本地插件重复，然后更新列表
    solveRepeated(rootList);
    //匹配并复制新增目录插件
    await solveUpdate(() => {
        return generate(config.LOCAL_ROOT, false)
    }, () => {
        return generate(config.NEWLY_ADDED, true)
    });
    //处理重复
    rootList = generate(config.LOCAL_ROOT, false)
    solveRepeated(rootList);
    //从本地向服务器同步
    sync(config.LOCAL_ROOT,config.REMOTE_ROOT)

    log("Success:Syncing finished")
}

main().then(_ => {
    process.exit(0)
});
