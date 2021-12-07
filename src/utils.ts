import { Package } from "./class";
import chalk from "chalk";

enum Cmp {
  E,
  L,
  G,
}

function versionCmp(a: string, b: string): Cmp {
  const x = a.split(".");
  const y = b.split(".");
  let result: Cmp = Cmp.E;

  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    if (Number(x[i]) < Number(y[i])) {
      result = Cmp.L;
      break;
    } else if (Number(x[i]) > Number(y[i])) {
      result = Cmp.G;
      break;
    }
  }

  // 处理前几位版本号相同但是位数不一致的情况，如1.3/1.3.0
  if (result === Cmp.E && x.length !== y.length) {
    // 找出较长的那一个
    let t: Array<string>;
    t = x.length < y.length ? y : x;
    // 读取剩余位
    for (
      let i = Math.min(x.length, y.length);
      i < Math.max(x.length, y.length);
      i++
    ) {
      if (Number(t[i]) !== 0) {
        result = x.length < y.length ? Cmp.L : Cmp.G;
        break;
      }
    }
  }

  return result;
}

function isIllegalPackageName(fullName: string): boolean {
  let version=fullName.split("_")[1]
  return fullName.match(/^[^_]*_[^_]*_[^_]*.7z$/) == null || version.match(/\d*\.\d*(\.\d)?(\.\d)?/)==null;
}

async function keypress() {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve(null);
    })
  );
}

function sort(array: Array<Package>): Array<Package> {
  //按名称排序数组
  array.sort((a, b) => {
    return a.name.localeCompare(b.name, "zh");
  });
  return array;
}

function log(text: string) {
  // 增加字符串类型判断
  if (typeof text != "string") {
    console.log(chalk.yellow("Warning ") + "Illegal type detected");
    console.log(JSON.stringify(text));
    return;
  }

  const spl = text.split(":");
  if (spl.length < 2) {
    console.log(chalk.yellow("Warning ") + "Illegal message detected");
    console.log(text);
    return;
  }

  const inf = text.substring(spl[0].length + 1);
  switch (spl[0]) {
    case "Info":
      console.log(chalk.blue("Info ") + inf);
      break;
    case "Success":
      console.log(chalk.greenBright("Success ") + inf);
      break;
    case "Warning":
      console.log(chalk.yellow("Warning ") + inf);
      break;
    case "Error":
      console.log(chalk.red("Error ") + inf);
      break;
    default:
      console.log(chalk.yellow("Warning ") + "Illegal message detected");
      console.log(text);
  }
}

export { versionCmp, isIllegalPackageName, keypress, sort, log };
