import fs from "fs";
import path from "path";
import { Package } from "./class";
import { solveIllegalName, solveRepeated } from "./jury";
import { generate } from "./listGenerator";
import { sync } from "./rclone";
import { solveUpdate } from "./updater";

export const config = {
  LOCAL_ROOT: "E:/Edgeless/OneDrive - 洛阳科技职业学院/插件包",
  REMOTE_ROOT: "pineapple:/hdisk/edgeless/插件包",
  NEWLY_ADDED: "D:/Download",
};

async function main() {
  //从服务器向本地同步
  //sync(config.REMOTE_ROOT,config.LOCAL_ROOT)
  //读取本地根目录和新增目录
  let rootList = generate(config.LOCAL_ROOT, false),
    newList = generate(config.NEWLY_ADDED, true);
  //解决本地根目录和新增目录的名称合法性
  await solveIllegalName(rootList);
  await solveIllegalName(newList);
  //处理本地插件重复，然后更新列表
  solveRepeated(rootList);
  rootList = generate(config.LOCAL_ROOT, false);
  //匹配并复制新增目录插件
  await solveUpdate(rootList, newList);
  //处理重复
  solveRepeated(rootList);
  //从本地向服务器同步
  //sync(config.LOCAL_ROOT,config.REMOTE_ROOT)
}

main().then();
