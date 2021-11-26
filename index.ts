import * as fs from "fs";

interface Package {
    name:string,
    fullName:string,
    category:string
}

const dir="E:/Edgeless/OneDrive - 洛阳科技职业学院/插件包"

function main() {
    //获取分类列表
    let cateList=fs.readdirSync(dir)

    //新建数组
    let array=[] as Array<Package>

    //遍历全部分类
    let list
    cateList.forEach((category)=>{
        list=fs.readdirSync(dir+'/'+category)
        list.forEach((fullName)=>{
            if(fullName!="历史版本"){
                array.push({
                    name:fullName.split('_')[0],
                    fullName,
                    category
                })
            }
        })
    })

    //按名称排序数组
    array.sort((a,b)=>{
        return a.name.localeCompare(b.name, "zh")
    })

    //遍历找出重复名称
    let tmp={
        name:"",
        fullName:"",
        category:""
    }
    for (let item of array) {
        if(tmp.name==item.name){
            console.log(`${tmp.fullName} at ${tmp.category}`)
            console.log(`${item.fullName} at ${item.category}`)
        }else {
            tmp=item
        }
    }

    console.log("Finish")
}

main()
