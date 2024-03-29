import fs from "fs";
import path from "path";
import {config} from "./index";
import {Cmp, Package} from "./class";
import {keypress, log, sort, versionCmp} from "./utils";
import {generate} from "./listGenerator";

//移动一个包至“历史版本”文件夹
function eliminate(item: Package): boolean {
    const dir = config.LOCAL_ROOT;
    const oldPath = path.join(dir, item.category, item.fullName),
        newPath = path.join(dir, item.category, "历史版本", item.fullName),
        trashCan = path.join(dir, item.category, "历史版本");
    if (!fs.existsSync(trashCan)) {
        fs.mkdirSync(trashCan);
    }
    fs.renameSync(oldPath, newPath);
    return !fs.existsSync(oldPath) && fs.existsSync(newPath);
}

//处理包名冲突，淘汰输家，返回赢家
function judge(a: Package, b: Package): Package {
    let eliminatedTarget, reservedTarget;
    //处理其中有bot构建的情况
    if(a.fullName.indexOf("bot")!=-1&&b.fullName.indexOf("bot")==-1){
        eliminatedTarget = b;
        reservedTarget = a;
    }else if(a.fullName.indexOf("bot")==-1&&b.fullName.indexOf("bot")!=-1){
        eliminatedTarget = a;
        reservedTarget = b;
    }else{
        let cmpRes = versionCmp(a.version, b.version);
        switch (cmpRes) {
            case Cmp.L:
                eliminatedTarget = a;
                reservedTarget = b;
                break;
            case Cmp.G:
                eliminatedTarget = b;
                reservedTarget = a;
                break;
            default:
                log(`Warning:Equal version detected,eliminate former`);
                eliminatedTarget = a;
                reservedTarget = b;
                break;
        }

    }
    if (eliminate(eliminatedTarget)) {
        log(
            `Info:Eliminate ${eliminatedTarget.fullName} at ${eliminatedTarget.category},reserve ${reservedTarget.fullName} at ${reservedTarget.category}`
        );
    } else {
        log(
            "Error:Elimination failed : ${eliminatedTarget.fullName} at ${eliminatedTarget.category}"
        );
    }
    return reservedTarget;
}

//提示非法的名称，并等待被解决
async function solveIllegalName(rootFolder: string, plain: boolean): Promise<null> {
    return new Promise(async (resolve) => {
        let array = generate(rootFolder, plain)
        //输出非法版本号
        let restart = false;
        for (let item of array) {
            if (item.illegal) {
                console.log(`${item.fullName} at ${item.category}`);
                restart = true;
            }
        }
        if (restart) {
            log(
                "Warning:Illegal name detected,please deal with that before press any key to continue"
            );
            await keypress();
            await solveIllegalName(rootFolder, plain);
            resolve(null);
        } else {
            resolve(null);
        }
    });
}

function solveRepeated(array: Array<Package>): void {
    let sortedArray = sort(array);
    //找出重复名称并裁决
    let tmp = {
        name: "",
        fullName: "",
        category: "",
        version: "",
        illegal: false,
    };
    for (let item of sortedArray) {
        if (tmp.name == item.name) {
            tmp = judge(item, tmp);
        } else {
            tmp = item;
        }
    }
}

export {solveIllegalName, solveRepeated};
