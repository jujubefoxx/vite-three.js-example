// 根据目录动态生成路由 目录下文件格式 /[name].vue
// 1.引入模块
const exampleList = import.meta.glob('./*.vue', {import: 'default', eager: true})
// 2.路由数组作为Children使用
const exampleRouter = [];
const exampleNameList = [];
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
    exampleNameList.push(name)
});
export {exampleRouter,exampleNameList}