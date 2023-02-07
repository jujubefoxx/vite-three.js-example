// 根据目录动态生成路由 目录下文件格式 /[name].vue
// 1.引入模块
const exampleList = import.meta.glob('./*.vue', {import: 'default', eager: true})
console.log(exampleList)
// 2.路由数组作为Children使用
const exampleRouter = [];
const exampleNameList = [];
// 中文标题配置
const titleConfig={
    'horse':'小马',
    'vr-house':'VR看房'
}
Object.keys(exampleList).forEach(key => {
    // 路由名称
    const name = exampleList[key].name;
    // 路由属性
    const obj = {
        name,
        path: name,
        component: exampleList[key]
    }
    exampleRouter.push(obj)
    exampleNameList.push({title:titleConfig[name]||name,name})
});
export {exampleRouter,exampleNameList}