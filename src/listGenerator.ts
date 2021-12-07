import {Package} from "./class";
import {isIllegalPackageName} from "./utils";
import fs from "fs";

export function generate(rootFolder: string, plain: boolean): Array<Package> {
    //获取根列表
    let rootList = fs.readdirSync(rootFolder);

    //新建数组
    let array = [] as Array<Package>;

    if (plain) {
        rootList.forEach((fullName) => {
            if (!isIllegalPackageName(fullName)) {
                array.push(packageGenerator(fullName, "未分类"))
            }
        });
    } else {
        //遍历全部分类
        let list;
        rootList.forEach((category) => {
            list = fs.readdirSync(rootFolder + "/" + category);
            list.forEach((fullName) => {
                if (fullName != "历史版本") {
                    array.push(packageGenerator(fullName, category))
                }
            });
        });
    }
    return array
}

function packageGenerator(fullName: string, category: string): Package {
    let version = fullName.split("_")[1];
    return {
        name: fullName.split("_")[0],
        fullName,
        category,
        version,
        illegal: isIllegalPackageName(fullName)
    };
}
